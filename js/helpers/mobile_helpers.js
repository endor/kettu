(function() {
  var stopEvent = function(event) {
    event.stopPropagation();
    event.preventDefault();
  };

  var deactivateLinks = function() {
    $('a, input').removeClass('ui-btn-active');
  };

  var scrollTop = function(y) {
    setTimeout(function() {
      $('#device').css('height', '200px');
      $(window).scrollTop(y);
      $('#device').css('height', '0px');
    }, 200);
  };

  var showBackButton = function(context, y) {
    $('#mobile-header .back').
      show().
      click(function() {
        $(this).hide();
        deactivateLinks();
        context.closeInfo();
        context.redirect('#/torrents');
        scrollTop(y);
      });
  };

  kettu.MobileHelpers = {
    activateSwipe: function($torrent) {
      $torrent = $torrent || $('.torrent');

      $torrent.swipe({
        swipeLeft: function(event) {
          stopEvent(event);

          var torrent = $(this);

          torrent.find('.pauseAndActivateButtonForm').hide();
          torrent.find('.torrent_delete_container').
            show().
            find('[type="submit"]').click(function(event) {
              stopEvent(event);
              $(this).parents('form:first').submit();
            });

          $(document).one('click', function(event) {
            stopEvent(event);
            torrent.find('.pauseAndActivateButtonForm').show();
            torrent.find('.torrent_delete_container').hide();
          });
        },

        swipeRight: function(event) {
          stopEvent(event);

          var torrent = $(this);

          torrent.find('.pauseAndActivateButtonForm').show();
          torrent.find('.torrent_delete_container').hide();
        }
      });
    },

    activateMobileButtons: function() {
      if(kettu.app.mobile) {
        var context = this;
        var y = 0;

        $('#mobile-footer .links .settings, #mobile-footer .links .add_a_torrent, ' +
          '#mobile-footer .links .statistics').click(function(event) {
          stopEvent(event);
          context.redirect($(this).attr('href'));
          showBackButton(context, y);
        });

        $(document).on('click', '.pauseAndActivateButton', function(event) {
          stopEvent(event);
          $(this).parents('form:first').submit();
        });

        $(document).on('click', '.torrent', function(event) {
          stopEvent(event);
          deactivateLinks();
          y = $(this).position().top;
          context.redirect('#/torrent_details/' + $(this).attr('id'));
          showBackButton(context, y);
          scrollTop(0);
        });

        this.activateSwipe();
      }
    }
  };
})();

/*global kettu*/

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
    activateMobileButtons: function() {
      if(kettu.app.mobile) {
        var context = this;
        var y = 0;

        $('#mobile-header .gear').click(function(event) {
          stopEvent(event);
          $('#gear_menu').slideDown('slow');            
        });
      
        $('#gear_menu .cancel').click(function(event) {
          stopEvent(event);
          deactivateLinks();
          $('#gear_menu').slideUp('slow');
        });

        $('#gear_menu .settings, #gear_menu .add_a_torrent').click(function(event) {
          stopEvent(event);
          deactivateLinks();
          $('#gear_menu').hide();
          context.redirect($(this).attr('href'));
          showBackButton(context, y);
        });
      
        $('#gear_menu .start_all, #gear_menu .stop_all').click(function() {
          deactivateLinks();
          $('#gear_menu').hide();
        });

        $('.pauseAndActivateButton').live('click', function(event) {
          stopEvent(event);
          $(this).parents('form:first').submit();
        });

        $('.torrent').live('click', function(event) {
          stopEvent(event);
          deactivateLinks();
          y = $(this).position().top;
          context.redirect('#/torrent_details/' + $(this).attr('id'));
          showBackButton(context, y);
          scrollTop(0);
        });

        $('.torrent').live('swipeleft', function(event) {
          stopEvent(event);

          var torrent = $(this);

          torrent.find('.pauseAndActivateButtonForm').hide();
          torrent.find('.torrent_delete_form').
            show().
            find('[type="submit"]').tap(function(event) {
              stopEvent(event);
              $(this).parents('form:first').submit();
            });

          $(document).one('tap', function(event) {
            stopEvent(event);
            torrent.find('.pauseAndActivateButtonForm').show();
            torrent.find('.torrent_delete_form').hide();              
          });
        });      
      }
    }
  };
})();
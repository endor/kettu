var stopEvent = function(event) {
  event.stopPropagation();
  event.preventDefault();  
};

var showBackButton = function(context, y) {
  $('#mobile-header .back').
    show().
    click(function() {
      $(this).hide();
      context.closeInfo();
      context.redirect('#/torrents');
      $.mobile.silentScroll(y);
    });
};

kettu.MobileHelpers = {
  activateMobileButtons: function() {
    if(kettu.app.mobile) {
      var context = this;
      var y = 0;

      $('#mobile-header .gear').live('click', function(event) {
        stopEvent(event);
        
        y = $(this).position().top;
        
        $('#gear_menu').show();
        $.mobile.silentScroll(0);

        $('#gear_menu .cancel').click(function(event) {
          stopEvent(event);
          $('#gear_menu').hide();
          $.mobile.silentScroll(y);
        });

        $('#gear_menu .settings').click(function(event) {
          stopEvent(event);
          $('#gear_menu').hide();
          context.redirect($(this).attr('href'));
          showBackButton(context, y);
        });
        
        $('#gear_menu .start_all, #gear_menu .stop_all').click(function() {
          $('#gear_menu').hide();
        });
      });

      $('.pauseAndActivateButton').live('click', function(event) {
        stopEvent(event);
        $(this).parents('form:first').submit();
      });

      $('.torrent').live('click', function(event) {
        stopEvent(event);
        
        y = $(this).position().top;
        
        context.redirect('#/torrent_details/' + $(this).attr('id'));
        showBackButton(context, y);
        $.mobile.silentScroll(0);
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
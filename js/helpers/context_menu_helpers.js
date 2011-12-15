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

kettu.ContextMenuHelpers = {
  hideContextMenu: function() {
    $('#context_menu').hide();
  },
  
  activateTapHoldMenu: function() {
    if(kettu.app.mobile) {
      var context = this;
      var y = 0;

      $('#mobile-header .gear').live('click', function(event) {
          stopEvent(event);
          y = $(this).position().top;
          $('#gear_menu').show();
          $.mobile.silentScroll(0);
          
          $('#gear_menu .cancel').click(function() {
              $('#gear_menu').hide();
              $.mobile.silentScroll(y);
          });
          
          $('#gear_menu .link').click(function() {
              $('#gear_menu').hide();
              context.redirect($(this).attr('href'));
              showBackButton(context, y);
          });
      });
      
      $('.pauseAndActivateButton').live('click', function(event) {
        stopEvent(event);
        $(this).parents('form:first').submit();
      });

      var redirectToTorrent = function(event) {
        stopEvent(event);
        y = $(this).position().top;
        context.redirect('#/torrent_details/' + $(this).attr('id'));
        showBackButton(context, y);
        $.mobile.silentScroll(0);
      };
      
      $('.torrent').live('click', redirectToTorrent);
      
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
  },
  
  activateContextMenu: function() {
    if(!kettu.app.mobile) {
      var context = this;
    
      $('#torrents').contextMenu({
        menu: '#context_menu',
        onContextMenu: function(event) {
          if($('.torrent.active').length === 0) {
            context.highlightTorrents($(event.target).closest('.torrent'));
          }

          var active_torrents = $('.torrent.active'),
            data = {
              ids: $.map(active_torrents, function(torrent) { return $(torrent).attr('id'); }).join(','),
              names: $.map(active_torrents, function(torrent) { return $(torrent).find('.name').text(); }).join('<br />'),
              deselect_all: $('.torrent').length === active_torrents.length,
              paused: active_torrents.length === $('.torrent.active.paused').length,
              not_paused: $('.torrent.active.paused').length === 0
            };
        
          context.render('templates/context_menu/show.mustache', data, function(rendered_view) {
            $('#context_menu').html('').append(rendered_view);

            $('#context_menu .select_all_link').click(function() {
              $('.torrent').addClass('active');
            });
            $('#context_menu .deselect_all_link').click(function() {
              $('.torrent').removeClass('active');
            });
            $('#context_menu .facebox_link').facebox();
          });        
        }
      });
    }
  }
};
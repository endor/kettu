var stopEvent = function(event) {
  event.stopPropagation();
  event.preventDefault();  
};

kettu.ContextMenuHelpers = {
  hideContextMenu: function() {
    $('#context_menu').hide();
  },
  
  activateTapHoldMenu: function() {
    if(kettu.app.mobile) {
      var context = this;

      $('.pauseAndActivateButton').live('click', function(event) {
        stopEvent(event);
        $(this).parents('form:first').submit();
      });

      var redirectToTorrent = function(event) {
        stopEvent(event);
        context.redirect('#/torrent_details/' + $(this).attr('id'));        
      };
      
      $('.torrent').live('click', redirectToTorrent);
      
      $('.torrent').live('swipeleft', function(event) {
        stopEvent(event);

        var torrent = $(this);
        
        $('#taphold_menu').remove();

        if($('.torrent.active').length === 0) {
          context.highlightTorrents(torrent);
        }
        
        var data = {
          id: torrent.attr('id'),
          paused: torrent.hasClass('paused'),
          not_paused: !torrent.hasClass('paused')
        };
        
        context.render('templates/torrents/taphold_menu.mustache', data, function(rendered_view) {
          torrent.append(rendered_view);
          
          $('.delete_link').tap(function(event) {
            stopEvent(event);
            $('#taphold_menu').html($('#delete_form').html());
            $('.torrent_delete_form input[type="submit"]').tap(function() {
              $(this).parents('form:first').submit();
            });
          });

          $(document).one('tap', function() {
            $('#taphold_menu').remove();  
          });
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
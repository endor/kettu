var ContextMenuHelpers = {
  hideContextMenu: function() {
    $('#context_menu').hide();
  },
  
  activateTapHoldMenu: function() {
    if(transmission.mobile) {
      var context = this;

      $('.torrent').live('taphold', function(event) {
        var torrent = $(this);

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
          
          $('li.delete').live('click', function(event) {
            $('#taphold_menu').html($('#delete_form').html());
            event.preventDefault();
          });
        });
      });      
    }
  },
  
  activateContextMenu: function() {
    if(!transmission.mobile) {
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
kettu.ContextMenuHelpers = {
  hideContextMenu: function() {
    $('#context_menu').hide();
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
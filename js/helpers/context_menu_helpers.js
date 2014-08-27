kettu.ContextMenuHelpers = {
  hideContextMenu: function() {
    $('#context_menu').hide();
  },

  contextMenuIsOpen: function() {
    return $('#context_menu').is(':visible');
  },

  activateContextMenu: function() {
    if(!kettu.app.mobile) {
      var context = this;

      $('#torrents').contextMenu({
        menu: '#context_menu',
        onContextMenu: function(event) {
          kettu.app.context_menu_target = $(event.target);

          if (!$(event.target).closest('.torrent').hasClass('active')) {
            context.highlightTorrents($(event.target).closest('.torrent'));
          }

          var active_torrents = $('.torrent.active'),
            paused_and_finnished = $('.torrent.active.paused, .torrent.active.finished'),
            data = {
              ids: $.map(active_torrents, function(torrent) { return $(torrent).attr('id'); }).join(','),
              names: $.map(active_torrents, function(torrent) { return $(torrent).find('.name').text(); }),
              deselect_all: $('.torrent').length === active_torrents.length,
              paused: active_torrents.length === paused_and_finnished.length,
              not_paused: paused_and_finnished.length === 0
            };

          context.render('templates/context_menu/show.mustache', data, function(rendered_view) {
            $('#context_menu').html('').append(rendered_view);

            $('#context_menu .select_all_link').click(function() {
              $('.torrent').addClass('active');
            });
            $('#context_menu .deselect_all_link').click(function() {
              $('.torrent').removeClass('active');
            });
          });
        }
      });
    }
  },

  reactivateContextMenu: function() {
    if(kettu.app.context_menu_target) { kettu.app.context_menu_target.trigger('contextmenu'); }
  }
};

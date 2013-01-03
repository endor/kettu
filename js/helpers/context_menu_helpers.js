/*global kettu*/

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
          // Highlight element under cursor if it isn't active
          if (!$(event.target).closest('.torrent').hasClass('active')) {
            var torrentToHighlight = $(event.target).closest('.torrent');
            context.highlightTorrents(torrentToHighlight);
            if (context.infoIsOpen() && context.infoDisplaysInspector()) { context.redirect('#/torrent_details/' + torrentToHighlight.attr('id')); }
          }

          var active_torrents = $('.torrent.active'),
            data = {
              ids: $.map(active_torrents, function(torrent) { return $(torrent).attr('id'); }).join(','),
              names: $.map(active_torrents, function(torrent) { return $(torrent).find('.name').text() }),
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
          });
        }
      });
    }
  },

  reactivateContextMenu: function() {
    if(kettu.app.context_menu_target) { kettu.app.context_menu_target.trigger('contextmenu'); }
  }
};

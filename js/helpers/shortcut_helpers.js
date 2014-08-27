kettu.ShortcutHelpers = {
  enableShortcuts: function() {
    // Allow Cmd/Ctrl+A to select all,
    // Cmd/Ctrl+Backspace to delete,
    // Cmd/Ctrl+Alt+Backspace to delete all finished
    $(document).bind('keydown', function(e) {
      // Note: e.metaKey will also be true if the Ctrl key is pressed
      if(e.metaKey && e.which === 65) {
        $('.torrent').addClass('active');
        if(kettu.InfoHelpers.infoIsOpen()) {
          kettu.app.trigger('refresh-torrent-details');
        }
        return false;
      } else if(e.metaKey && e.which === 8) {
        if(e.altKey) {
          $('.torrent').removeClass('active');
          $('.torrent.finished').addClass('active');
        }
        if($('.torrent.active').length > 0) {
          kettu.app.trigger('create-delete-facebox');
          return false;
        }
      }
      return true;
    });
  }
};
kettu.ViewHelpers = {
  highlightTorrents: function(torrents, more_torrents) {
    $('#torrents .torrent').removeClass('active');
    torrents.addClass('active');
    if(more_torrents) { more_torrents.addClass('active'); }
  },

  showErrors: function(errors) {
    var error_string = _.reduce(errors, function(error_string, error) {
      error_string += error.field + ': ' + error.message + '<br />';
    }, '<p>');
    $('#errors').html(error_string + '</p>');
  },

  saveLastMenuItem: function(active_menu_item) {
    if(active_menu_item.length > 0) {
      kettu.app.last_menu_item = $(active_menu_item).attr('id');
    }
  },

  menuizeInfo: function() {
    $('#info .menu-item').click(function() {
      $('#info .menu-item').removeClass('active');
      $(this).addClass('active');
      var item = $(this).attr('data-item');
      $('#info .item').hide();
      $('#info .' + item).show();
      $('#info .blocklist').toggle(item === 'peers');
    });
    $('#info .item').hide();
    if(kettu.app.last_menu_item && $('#' + kettu.app.last_menu_item).length > 0) {
      var contextMenuWasOpen = this.contextMenuIsOpen();
      $('#' + kettu.app.last_menu_item).click();
      if(contextMenuWasOpen) { this.reactivateContextMenu(); }
    } else {
      $('#info .item:first').show();
      $('#info .menu-item:first').addClass('active');
    }
  },

  sanitizeNumber: function(number) {
    if(number >= 0) {
      return number;
    } else if(number === -1) {
      return 'N/A';
    } else if(number === -2) {
      return 'Infinity';
    }
  },

  activateSortSelect: function() {
    $('#sort_link').click(function() {
      $('#sorts').slideToggle();
    });
    $('#sorts a').click(function() {
      $('#sorts').slideUp();
    });
    $('#reverse_link').click(function() {
      $(this).toggleClass('reverse');
    });
    if(kettu.app.reverse_sort) {
      $('#reverse_link').addClass('reverse');
    }
  }
};

var ViewHelpers = {
  highlightTorrents: function(torrents, more_torrents) {
    $('#torrents .torrent').removeClass('active');
    torrents.addClass('active');
    if(more_torrents) {
      more_torrents.addClass('active');
    }
  },
  
  showErrors: function(errors) {
    var error_string = '<p>';
    $.each(errors, function() {
      error_string += this.field + ': ' + this.message + '<br />';
    });
    error_string += '.</p>';
    $('#errors').html(error_string);
  },
  
  saveLastMenuItem: function(id) {
    transmission.last_menu_item = id;
  },
  
  menuizeInfo: function() {
    $('#info .menu-item').click(function() {
      $('#info .menu-item').removeClass('active');
      $(this).addClass('active');
      var item = $(this).attr('data-item');
      $('#info .item').hide();
      $('#info .' + item).show();
    });
    $('#info .item').hide();
    if(transmission.last_menu_item) {
      $('#' + transmission.last_menu_item).click();
      delete transmission.last_menu_item;
    } else {
      $('#info .item:first').show();
      $('#info .menu-item:first').addClass('active');      
    }
  },
  
  sanitizeNumber: function(number) {
    if(number >= 0) {
      return number;
    } else if(number == -1) {
      return 'N/A';
    } else if(number == -2) {
      return 'Infinity';
    }
  },
  
  activateSortSelect: function(context) {
    $('#sort_link').click(function() {
      $('#sorts').slideToggle();
    });
    $('#sorts a').click(function() {
      $('#sorts').slideUp();
    });
    $('#reverse_link').click(function() {
      $(this).toggleClass('reverse');
    });
    if(transmission.reverse_sort) {
      $('#reverse_link').addClass('reverse');
    }
  }
};
var ViewHelpers = {
  highlightLink: function(menu_id, element_class) {
    $(menu_id + ' a').removeClass('active');
    $(menu_id + ' ' + element_class).addClass('active');
  },
  
  highlightTorrents: function(torrents, more_torrents) {
    $('#torrents .torrent').removeClass('active');
    torrents.addClass('active');
    if(more_torrents) {
      more_torrents.addClass('active');
    }
  },
  
  showAndHideFlash: function(message) {
    $('#flash').html(message);
    $('#flash').show().delay(3000).fadeOut('slow');
  },

  showErrors: function(errors) {
    var error_string = '<p>';
    $.each(errors, function() {
      error_string += this['field'] + ': ' + this['message'] + '<br />';
    });
    $('#errors').html(error_string + '.</p>');
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
    $('#sorts select').change(function() {
      context.redirect($(this).val());
    });
  }
};
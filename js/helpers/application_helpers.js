kettu.ApplicationHelpers = {
  cachePartial: function(template, partial, context) {
    if(!context.cache(partial)) {
      $.ajax({async: false, url: template, success: function(response) {
        context.cache(partial, response);
      }});
    }
  },

  configureFacebox: function() {
    $(document).bind('reveal.facebox', function() {
      $('#context_menu').hide();
      $('#facebox form').submit(function() {
        $(document).trigger('close.facebox');
        return true;
      });
    });
    $(document).bind('afterClose.facebox', function() {
      $('#facebox').removeClass('graph');
    });
  },

  hashDiff: function(hash1, hash2) {
    var diff = {}, different = false;

    for(var key in hash1) {
      if(hash1[key] !== hash2[key]) {
        diff[key] = hash2[key];
        different = true;
      }
    }

    return different ? diff : false;
  },

  shorten: function(string, lng) {
    if(string.length > lng) {
      return string.substr(0, lng) + '…';
    } else {
      return string;
    }
  },

  enableDragging: function() {
    if(!kettu.app.mobile) {
      // Setting distance to non-zero allows our custom single-click
      // and double-click behavior
      $("#torrents").selectable({distance: 1});
      $("#torrents").bind("selectablestop", function() {
        $('#context_menu').hide();
        kettu.app.trigger('refresh-torrent-details');
      });
    }
  },

  inPixel: function(string) {
    var int = parseInt(string, 10),
      unit = string.substr(string.length - 2);

    if (isNaN(int)) {
      return 0;
    } else if (unit === 'px') {
      return int;
    } else if(unit === 'em') {
      return this.emToPixel(int);
    } else {
      return 0;
    }
  },

  emToPixel: function(em) {
    var fontSize = parseFloat($('body').css('font-size'));
    return (fontSize * em);
  }
};

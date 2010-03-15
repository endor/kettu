var InfoHelpers = {
  closeInfo: function() {
    this.clearReloadInterval();
    $('#torrents').css('width', '100%');
    $('#info').html('');
    $('#info').hide();
    var path = transmission.filter_mode ? '#/filtered_torrents/' + transmission.filter_mode : '#/torrents';
    this.redirect(path);
    return false;
  },

  openInfo: function(view) {
    var info = $('#info');
    info.html(view);
    info.show();
    this.menuizeInfo();
  },

  clearReloadInterval: function() {
    if(transmission.info_interval_id) {
      clearInterval(transmission.info_interval_id);
    }
  },
  
  infoIsOpen: function() {
    return $('#info').is(':visible');
  },

  handleDoubleClickOnTorrent: function(torrent) {
    var context = this;
    $('#' + torrent.id).dblclick(function() {
      if(context.infoIsOpen()) {
        context.closeInfo();
      } else {
        var active_torrent = $('.torrent.active');
        if(active_torrent.get(0)) {
          context.redirect('#/torrents/' + active_torrent.attr('id'));
        }        
      }
      return false;
    });
  },
  
  handleClickOnTorrent: function(torrent) {
    var context = this;
    $('#' + torrent.id).click(function() {
      context.highlightLi('#torrents', this);
      if(context.infoIsOpen()) {
        context.saveLastMenuItem($('.menu-item.active').attr('id'));
        window.location = '#/torrents/' + $(this).attr('id');
        // NOTE: a redirect seems to interfere with our double click handling here
      }
    });    
  },
  
  updateInfo: function(torrent) {
    this.trigger('changed');
    
    this.handleClickOnTorrent(torrent);
    this.handleDoubleClickOnTorrent(torrent);
  },
  
  startCountDownOnNextAnnounce: function() {
    var context = this;
    var timer = setInterval(function() {
      var timestamp = $('.countdown').attr('data-timestamp');
      var formatted = context.formatNextAnnounceTime(timestamp);
      
      if(formatted.match(/59 min/)) {
        clearInterval(timer);
        context.saveLastMenuItem($('.menu-item.active').attr('id'));
        context.closeInfo();
        context.openInfo();
      } else {
        $('.countdown').text(formatted);
      }
    }, 980);
  }
};
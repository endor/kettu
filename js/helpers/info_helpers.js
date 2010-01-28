var InfoHelpers = {
  closeInfo: function() {
    $('#torrents').css('width', '100%');
    var info = $('#info');
    info.html('');
    info.hide();
    this.redirect('#/torrents');
    return false;
  },

  openInfo: function(view) {
    var info = $('#info');
    info.html(view);
    info.show();
    this.menuizeInfo();
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
        window.location.hash = '/torrents/' + $(this).attr('id');
      }
    });    
  },
  
  updateInfo: function(torrent) {
    this.trigger('changed');
    
    this.handleClickOnTorrent(torrent);
    this.handleDoubleClickOnTorrent(torrent);
  }
};
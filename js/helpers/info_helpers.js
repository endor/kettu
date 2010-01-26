var InfoHelpers = {
  closeInfo: function() {
    $('#torrents').css('width', '100%');
    var info = $('#info');
    info.html('');
    info.hide();
    window.location.hash = '/torrents'; 
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

  updateInfo: function(torrent) {
    var context = this;
    context.trigger('changed');
    
    $('#' + torrent.id).click(function(event) {
      context.highlightLi('#torrents', this);
      if(context.infoIsOpen()) {
        window.location.hash = '/torrents/' + $(this).attr('id');
      }
    });
    $('#' + torrent.id).dblclick(function() {
      if(context.infoIsOpen()) {
        context.closeInfo();
      } else {
        var active_torrent = $('.torrent.active');
        if(active_torrent.get(0)) {
          window.location.hash = '/torrents/' + active_torrent.attr('id');
        }        
      }
      return false;
    });
  }
};
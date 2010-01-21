var TorrentInfoHelpers = {
  closeTorrentInfo: function() {
    $('#torrents').css('width', '100%');
    var info = $('#torrent_info');
    info.html('');
    info.hide();
    window.location.hash = '/torrents';
  },

  openAndUpdateTorrentInfo: function() {
    var active_torrent = $('.torrent.active:first');
    if(active_torrent.get(0)) {
      window.location.hash = '/torrents/' + active_torrent.attr('id');
    }
  },

  torrentInfoOpen: function() {
    return $('#torrent_info').is(':visible');
  },

  toggleTorrentInfo: function(_open, _close) {
    $('#torrent_info').is(':visible') ? _close() : _open();
  },
  
  updateTorrentInfoElements: function() {
    var context = this;
    $('.torrent').click(function() {
      context.highlightLi('#torrents', this);
      if(context.torrentInfoOpen()) {
        context.openAndUpdateTorrentInfo();
      }
    });
    $('.torrent').dblclick(function() {
      context.toggleTorrentInfo(context.openAndUpdateTorrentInfo, context.closeTorrentInfo);
    });
  }
};
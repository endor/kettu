var TorrentInfoHelpers = {
  closeTorrentInfo: function() {
    $('#torrents').css('width', '100%');
    var info = $('#torrent_info');
    info.html('');
    info.hide();
  },

  openAndUpdateTorrentInfo: function() {
    var active_torrent = $('.torrent.active');
    if(active_torrent.get(0)) {
      window.location.hash = '/torrents/' + active_torrent.attr('id');
    }
  },
  
  showTorrentInfo: function(view) {
    var info = $('#torrent_info');
    info.html(view);
    info.show();
    $('#torrent_info .header').click(function() {
      $(this).parent().next().toggle('slow');
      $(this).toggleClass('active');
  		return false;
    }).parent().next().hide();
  },

  torrentInfoOpen: function() {
    return $('#torrent_info').is(':visible');
  },

  toggleTorrentInfo: function(_open, _close) {
    $('#torrent_info').is(':visible') ? _close() : _open();
  },
  
  rebindForms: function() {
    var context = this;
    var forms = context.$element().find('form:not(.' + context.app.eventNamespace() + ')')
    forms.bind('submit', function() {
      return context.app._checkFormSubmission(this);
    }).addClass(context.app.eventNamespace());
  },
  
  updateTorrentInfo: function(torrent) {
    var context = this;

    context.rebindForms();
    
    $('#' + torrent.id).click(function(event) {
      context.highlightLi('#torrents', this);
      if(context.torrentInfoOpen()) {
        context.openAndUpdateTorrentInfo();
      }
    });
    // TODO: triple double clicking doesnt work
    $('#' + torrent.id).dblclick(function() {
      context.toggleTorrentInfo(context.openAndUpdateTorrentInfo, context.closeTorrentInfo);
      return false;
    });
  }
};
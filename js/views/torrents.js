TorrentsView = function(torrents) {
  this.torrents = torrents;
  
  var view = {
    'torrents': this.torrents,
    'pauseAndActivateButton': function() {
      var torrent = Torrent(this);
      var method = torrent.isActive() ? ['torrent-stop', 'Pause'] : ['torrent-start', 'Activate'];
      return '<form action="#/torrents/' + torrent.id + '" method="PUT">' +
             '<input type="hidden" name="method" value="' + method[0] + '"/>' +
             '<input type="submit" value="' + method[1] + '"/></form>';
    }    
  };
  
  return view;
}

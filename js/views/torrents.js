TorrentsView = function(torrents) {
  this.torrents = torrents;
  
  var view = {
    'torrents': this.torrents,
    'pauseAndActivateButton': function() {
      var torrent = Torrent(this);
      var method = torrent.isActive() ? ['torrent-stop', 'Pause', 'pause'] : ['torrent-start', 'Activate', 'activate'];
      return '<form action="#/torrents/' + torrent.id + '" method="PUT">' +
             '<input type="hidden" name="method" value="' + method[0] + '"/>' +
             '<input type="submit" value="' + method[1] + '" class="pauseAndActivateButton ' + method[2] + '" /></form>';
    }    
  };
  
  return view;
}

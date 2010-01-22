TorrentView = function(torrent, context) {
  var view = torrent;
  
  view.pauseAndActivateButton = function() {
    var torrent = Torrent(this);
    var options = torrent.isActive() ? ['torrent-stop', 'Pause', 'pause'] : ['torrent-start', 'Activate', 'activate'];
    this.cache_partial('./templates/torrents/pause_and_activate_button.mustache', 'pause_and_activate_button', context);
    return Mustache.to_html(context.cache('pause_and_activate_button'), {
      'id': torrent.id,
      'method': options[0],
      'button': options[1],
      'css_class': options[2]
    });    
  };
  
  view.cache_partial = context.cache_partial;
  
  return view;
};
TorrentView = function(torrent, context) {
  var view = torrent;
  
  view.pauseAndActivateButton = function() {
    var torrent = Torrent(view);
    var options = torrent.isActive() ? ['torrent-stop', 'Pause', 'pause'] : ['torrent-start', 'Activate', 'activate'];
    this.cache_partial('./templates/torrents/pause_and_activate_button.mustache', 'pause_and_activate_button', context);
    return Mustache.to_html(context.cache('pause_and_activate_button'), {
      'id': torrent.id,
      'method': options[0],
      'button': options[1],
      'css_class': options[2]
    });    
  };
  
  view.formatTime = function(timestamp) {
    var current = new Date(parseInt(timestamp) * 1000);
    if(current) {
      var date = (current.getMonth() + 1) + '/' + current.getDate() + '/' + current.getFullYear();
      var time = current.getHours() + ':' + current.getMinutes();
      return date + ' ' + time;      
    } else {
      return timestamp;
    }
  };
  
  view.addFormattedTimes = function() {
    if(view.trackerStats !== undefined) {
      var i = 0;
      $.each(view.trackerStats, function() {
        view.trackerStats[i]['lastAnnounceTimeFormatted'] = view.formatTime(this.lastAnnounceTime);
        view.trackerStats[i]['nextAnnounceTimeFormatted'] = view.formatTime(this.nextAnnounceTime);
        view.trackerStats[i]['lastScrapeTimeFormatted'] = view.formatTime(this.lastScrapeTime);
        i += 1;
      });      
    }
  };
  
  view.cache_partial = context.cache_partial;
  view.addFormattedTimes();
  
  return view;
};
kettu.TorrentsView = function(torrent, context) {
  var view = torrent;
  
  view.pauseAndActivateButton = function() {
    var torrent = kettu.Torrent(view);
    var options = torrent.isActive() ? ['torrent-stop', 'Pause'] : ['torrent-start', 'Activate'];
    this.cache_partial('templates/torrents/pause_and_activate_button.mustache', 'pause_and_activate_button', context);
    return context.mustache(context.cache('pause_and_activate_button'), {
      'id': torrent.id,
      'method': options[0],
      'button': options[1],
      'css_class': torrent.statusWord()
    });    
  };

  view.firstTracker = function() {
    if(view.trackerStats && view.trackerStats[0]) {
      return view.trackerStats[0]['host'];
    } else {
      return '';
    }
  };
  
  view.errorClass = function() {
    return view.hasError() ? ' error' : '';
  };
  
  view.showPriorityArrow = function() {
    return torrent.bandwidthPriority != 0;
  }
  
  view.priorityArrow = function() {
    return torrent.bandwidthPriority == 1 ? 'up' : 'down';
  }
  
  view.cache_partial = context.cache_partial;

  return view;
};
TorrentView = function(torrent, context) {
  var view = torrent;
  
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
        view.trackerStats[i]['nextAnnounceTimeFormatted'] = context.formatNextAnnounceTime(this.nextAnnounceTime);
        view.trackerStats[i]['lastScrapeTimeFormatted'] = view.formatTime(this.lastScrapeTime);
        i += 1;
      });      
    };    
  };
  
  view.addFormattedSizes = function() {
    if(view.files !== undefined) {
      var i = 0;
      $.each(view.files, function() {
        view.files[i]['lengthFormatted'] = Math.formatBytes(this['length']);
        view.files[i]['percentDone'] = Math.formatPercent(this['length'], this['length'] - this.bytesCompleted);
        i += 1;
      });
    }
    if(view.peers !== undefined) {
      var i = 0;
      $.each(view.peers, function() {
        view.peers[i]['uploadFormatted'] = this['rateToPeer'] != 0 ? Math.formatBytes(this['rateToPeer']) : '';
        view.peers[i]['downloadFormatted'] = this['rateToClient'] != 0? Math.formatBytes(this['rateToClient']) : '';
        view.peers[i]['percentDone'] = Math.formatPercent(100, 100 - (this['progress'] * 100));
        i += 1;
      });      
    }
  };
  
  view.addFormattedTimes();
  view.addFormattedSizes();
  
  return view;
};
TorrentView = function(torrent, context, sort_peers) {
  var view = torrent;
  view.sort_peers = sort_peers || 'client';
  
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
    }    
  };
  
  view.addFormattedSizes = function() {
    var i = 0;
    if(view.files !== undefined) {
      $.each(view.files, function() {
        view.files[i]['lengthFormatted'] = Math.formatBytes(this['length']);
        view.files[i]['percentDone'] = Math.formatPercent(this['length'], this['length'] - this.bytesCompleted);
        i += 1;
      });
    }
    if(view.peers !== undefined) {
      i = 0;
      $.each(view.peers, function() {
        view.peers[i]['uploadFormatted'] = this['rateToPeer'] !== 0 ? Math.formatBytes(this['rateToPeer']) : '';
        view.peers[i]['downloadFormatted'] = this['rateToClient'] !== 0? Math.formatBytes(this['rateToClient']) : '';
        view.peers[i]['percentDone'] = Math.formatPercent(100, 100 - (this['progress'] * 100));
        i += 1;
      });      
    }
  };
  
  view.sortPeers = function() {
    if(view.peers !== undefined) {
      var peers = view.peers;
      var peer_sort_function = function() {};
    
      switch(view.sort_peers) {
        case 'client':
          peer_sort_function = function(a, b) {
            var a_name = a.clientName.toUpperCase();
            var b_name = b.clientName.toUpperCase();
            return (a_name < b_name) ? -1 : (a_name > b_name) ? 1 : 0;
          };
          break;
        case 'percent':
          peer_sort_function = function(a, b) {
            return b.percentDone - a.percentDone;
          };
          break;
        case 'upload':
          peer_sort_function = function(a, b) {
            return b.rateToPeer - a.rateToPeer;
          };
          break;
        case 'download':
          peer_sort_function = function(a, b) {
            return b.rateToClient - a.rateToClient;
          };
          break;
      }

      view.peers = peers.sort(peer_sort_function);
    }
  };
  
  view.addIdsToFiles = function() {
    $.each(view.files, function() {
      var id = view.files.indexOf(this)
      this['id'] = 'file_' + id;
      this['wanted'] = view.fileStats[id].wanted ? ' checked="checked"' : '';
      this['disabled'] = (view.files[id]['length'] - view.files[id]['bytesCompleted'] == 0) ? ' disabled="disabled"' : '';
    });
    if(view.files.length == 1) {
      view.files[0]['disabled'] = ' disabled="disabled"';
    }
  };
  
  view.addFormattedTimes();
  view.addFormattedSizes();
  view.sortPeers();
  view.addIdsToFiles();
  
  return view;
};
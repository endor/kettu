kettu.FilterTorrentsHelpers = {
  filterTorrents: function(filter_mode, torrents) {    
    var filtered_torrents = [];
    var stati = kettu.Torrent.stati;
    
    switch(filter_mode) {
      case 'all':
        filtered_torrents = torrents;
        break;
      case 'activity':
        _.each(torrents, function(torrent) {
          if(torrent.activity()) {
            filtered_torrents.push(torrent);
          }
        });
        break;
      default:
        _.each(torrents, function(torrent) {
          if(torrent.status == stati[filter_mode]) {
            filtered_torrents.push(torrent);
          }
        });      
        break;
    }

    return filtered_torrents;
  }
};
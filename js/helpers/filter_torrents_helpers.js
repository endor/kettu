var FilterTorrentsHelpers = {
  filterTorrents: function(filter_mode, torrents) {    
    var filtered_torrents = [];
    var stati = Torrent({}).stati;
    
    switch(filter_mode) {
      case 'all':
        filtered_torrents = torrents;
        break;
      case 'active':
        $.each(torrents, function() {
          if(this.activity()) {
            filtered_torrents.push(this)
          }
        });
        break;
      default:
        $.each(torrents, function() {
          if(this.status == stati[filter_mode]) {
            filtered_torrents.push(this);
          }
        });      
        break;
    }

    return filtered_torrents;
  }
}
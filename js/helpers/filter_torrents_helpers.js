var FilterTorrentsHelpers = {
  filterTorrents: function(filter_mode, torrents) {    
    var filtered_torrents = [];
    var stati = Torrent({}).stati;
    
    if(filter_mode == 'all') {
      filtered_torrents = torrents;
    } else if(filter_mode == 'active') {
      $.each(torrents, function() {
        if(this.activity()) {
          filtered_torrents.push(this)
        }
      })
    } else {
      $.each(torrents, function() {
        if(this.status == stati[filter_mode]) {
          filtered_torrents.push(this);
        }
      });      
    }

    return filtered_torrents;
  }
}

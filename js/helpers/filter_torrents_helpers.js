kettu.FilterTorrentsHelpers = {
  filterTorrents: function(filter_mode, torrents) {
    var stati = kettu.Torrent.stati;

    if(filter_mode === 'all') {
      return torrents;
    } else if(filter_mode === 'activity') {
      return _.select(torrents, function(torrent) {
        return torrent.activity();
      });
    } else {
      return _.select(torrents, function(torrent) {
        return torrent.status === stati[filter_mode];
      });
    }
  }
};

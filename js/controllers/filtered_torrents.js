FilteredTorrents = function(sammy) { with(sammy) {
  valid_filters = ['seeding', 'downloading', 'paused', 'seeding'];
  
  get('#/filtered_torrents/:filter', function() {
    var filter = '';
    if($.inArray(this.params['filter'], valid_filters) >= 0) {
      filter = '.' + this.params['filter'];
    }
    $('.torrent').hide();
    $('.torrent' + filter).show();
    
    this.cycleTorrents();
    this.highlightLink('#filterbar', '.' + this.params['filter']);
    this.closeTorrentInfo();
  });
}};

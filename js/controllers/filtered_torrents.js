FilteredTorrents = function(transmission) { with(transmission) {
  get('#/filtered_torrents/:filter', function() {
    var filter = '';
    var valid_filters = ['seeding', 'downloading', 'paused', 'seeding'];

    if($.inArray(this.params['filter'], valid_filters) >= 0) {
      if(!transmission.interval_id) {
        transmission.redirect = '#/filtered_torrents/' + this.params['filter'];
        this.redirect('#/torrents')
      }
      
      filter = '.' + this.params['filter'];
      transmission.filter_mode = this.params['filter'];
    }
    $('.torrent').hide();
    $('.torrent' + filter).show();
    
    this.cycleTorrents();
    this.highlightLink('#filterbar', '.' + this.params['filter']);
  });
}};

FilteredTorrents = function(sammy) { with(sammy) {  
  get('#/filtered_torrents/:filter', function() {
    var filter = '';
    if($.inArray(this.params['filter'], this.valid_filters()) >= 0) {
      filter = '.' + this.params['filter'];
    }
    $('.torrent').hide();
    $('.torrent' + filter).show();
    
    this.cycleTorrents();
    this.highlightLink('#filterbar', '.' + this.params['filter']);
  });
}};

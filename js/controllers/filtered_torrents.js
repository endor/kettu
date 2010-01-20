FilteredTorrents = function(sammy) { with(sammy) {
  get('#/filtered_torrents/:filter', function() {
    var filter = getFilter(this.params['filter']);
    $('.torrent').css('background-color', '#FFFFFF');
    $('.torrent' + filter).css('background-color', '#FFF8DC');
  });
  
  getFilter = function(filter_status) {
    var stati, status, filter = '';
    
    stati = Torrent({}).stati;
    for(var i in stati) {
      if(i == filter_status) { status = i; }
    }
    if(status != undefined) {
      filter = '.' + status;
    }
    
    return filter;
  };
}};

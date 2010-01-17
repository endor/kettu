Torrents = function(sammy) { with(sammy) {
  get('#/torrents', function() {
    var context = this;
    var request = {
      'method': 'torrent-get',
      'arguments': {'fields':Torrent({})['fields']}
    };
    rpc.query(request, function(response) {
      var torrents = response['torrents'].map( function(row) {return Torrent(row)} );
      var view = { 'torrents': torrents };
      context.partial('./templates/torrents/index.mustache', view, function(rendered_view) {
        sammy.swap(rendered_view);
        $('#globalUpAndDownload').html(globalUpAndDownload(torrents));
        $('#numberOfTorrents').html(numberOfTorrents(torrents));
      });
    });
  });
  
  globalUpAndDownload = function(torrents) {
    var uploadRate = 0.0, downloadRate = 0.0;
    $.each(torrents, function() {
      uploadRate += this['rateUpload'];
      downloadRate += this['rateDownload'];
    });
    return Torrent({}).downAndUpLoadRateString(downloadRate, uploadRate);
  };
  
  numberOfTorrents = function(torrents) {
    var len = torrents.length, numberOfTorrents; 
    if(len > 0) {
      numberOfTorrents = len === 1 ? "1 torrent" : len + " torrents";
    } else {
      numberOfTorrents = "No torrents";
    }      
    return numberOfTorrents;
  };
}};
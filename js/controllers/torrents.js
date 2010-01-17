Torrents = function(sammy) { with(sammy) {
  get('#/torrents', function() {
    var context = this;
    var request = {
      'method': 'torrent-get',
      'arguments': {'fields':['id', 'name', 'status', 'totalSize', 'sizeWhenDone', 'haveValid', 'leftUntilDone', 'eta', 'uploadedEver', 'uploadRatio', 'rateDownload', 'rateUpload']}
    };      
    rpc.query(request, function(response) {
      var view = { 'torrents': response['torrents'].map( function(row) {return Torrent(row)} ) };
      context.partial('./templates/torrents/index.mustache', view); 
    });
  });  
}};
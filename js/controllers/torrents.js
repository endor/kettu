Torrents = function(sammy) { with(sammy) {
  var context;
  
  get('#/torrents', function() {
    context = this;
    getAndRenderTorrents();
    setInterval('getAndRenderTorrents()', reload_interval);
  });
    
  getAndRenderTorrents = function() {
    var request = {
      'method': 'torrent-get',
      'arguments': {'fields':Torrent({})['fields']}
    };
    rpc.query(request, function(response) {
      var torrents = response['torrents'].map( function(row) {return Torrent(row)} );
      var view = { 'torrents': torrents };
      
      context.partial('./templates/torrents/index.mustache', view, function(rendered_view) {
        sammy.swap(rendered_view);
        $('#globalUpAndDownload').html(context.globalUpAndDownload(torrents));
        $('#numberOfTorrents').html(context.numberOfTorrents(torrents));
      });
    });    
  };  
}};
Torrents = function(sammy) { with(sammy) {
  var context;
  
  get('#/torrents', function() {
    context = this;
    getAndRenderTorrents();
    setInterval('getAndRenderTorrents()', reload_interval);
  });
  
  put('#/torrents/:id', function() {
    context = this;
    var id = parseInt(this.params['id']);
    var request = {
      'method': this.params['method'],
      'arguments': {'ids': id}
    };
    rpc.query(request, function(response) {
      getAndRenderTorrent(id);
    });
  });
  
  getAndRenderTorrent = function(id) {
    var request = {
      'method': 'torrent-get',
      'arguments': {'ids': id, 'fields':Torrent({})['fields']}
    };
    rpc.query(request, function(response) {
      var torrent = response['torrents'].map( function(row) {return Torrent(row)} )[0];

      context.partial('./templates/torrents/show.mustache', TorrentView(torrent), function(rendered_view) {
        $(element_selector).find('#' + this.params['id']).replaceWith(rendered_view);
      });
    });
  };
    
  getAndRenderTorrents = function() {
    var request = {
      'method': 'torrent-get',
      'arguments': {'fields':Torrent({})['fields']}
    };
    rpc.query(request, function(response) {
      var torrents = response['torrents'].map( function(row) {return Torrent(row)} );
                
      context.partial('./templates/torrents/index.mustache', TorrentsView(torrents), function(rendered_view) {
        context.app.swap(rendered_view);
        trigger('torrents-refreshed', torrents);
      });
    });    
  };
  
  bind('torrents-refreshed', function(e, torrents) { with(this) {
    this.updateViewElements(torrents);    
  }});
    
}};
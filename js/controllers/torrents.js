Torrents = function(sammy) { with(sammy) {
  var context;
  
  get('#/torrents', function() {
    context = this;
    getAndRenderTorrents();
    setInterval('getAndRenderTorrents()', reload_interval);
  });
  
  get('#/torrents/:id', function() {
    context = this;
    var id = parseInt(context.params['id']);
    
    getTorrent(id, function(torrent) {
      context.partial('./templates/torrents/show_info.mustache', torrent, function(rendered_view) {
        context.openInfo(rendered_view);
      });
    });
  });
  
  put('#/torrents/:id', function() {
    context = this;
    var id = parseInt(context.params['id']);
    var request = {
      'method': context.params['method'],
      'arguments': {'ids': id}
    };
    rpc.query(request, function(response) {
      getTorrent(id, renderTorrent);
    });
  });
  
  getTorrent = function(id, callback) {
    var request = {
      'method': 'torrent-get',
      'arguments': {'ids': id, 'fields': Torrent({})['fields'].concat(Torrent({})['info_fields'])}
    };
    rpc.query(request, function(response) {
      callback(response['torrents'].map( function(row) {return Torrent(row);} )[0]);
    });
  }
    
  renderTorrent = function(torrent) {
    context.partial('./templates/torrents/show.mustache', TorrentView(torrent, context), function(rendered_view) {
      $(element_selector).find('#' + torrent.id).replaceWith(rendered_view);
      trigger('torrent-refreshed', torrent);
    });    
  };
  
  getAndRenderTorrents = function() {
    var request = {
      'method': 'torrent-get',
      'arguments': {'fields':Torrent({})['fields']}
    };
    rpc.query(request, function(response) {
      var torrents = response['torrents'].map( function(row) {return Torrent(row)} );
      trigger('torrents-refreshed', torrents);
    });    
  };
  
  // TODO: find a way to put this into the appropriate helper files
  bind('torrents-refreshed', function(e, torrents) { with(this) {
    this.updateViewElements(torrents);
  }});
  
  bind('torrent-refreshed', function(e, torrent) { with(this) {
    this.updateInfo(torrent);
    this.cycleTorrents();    
  }});
}};
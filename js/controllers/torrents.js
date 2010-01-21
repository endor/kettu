Torrents = function(sammy) { with(sammy) {
  var context;
  
  get('#/torrents', function() {
    context = this;
    getAndRenderTorrents();
    setInterval('getAndRenderTorrents()', reload_interval);
  });
  
  get('#/torrents/:id', function() {
    var id = parseInt(this.params['id']);
    var context = this;
    
    getTorrent(id, function(torrent) {
      var info = $('#torrent_info');
      context.partial('./templates/torrents/show_info.mustache', torrent, function(rendered_view) {
        info.html(rendered_view);
        info.show();
        $('#torrents').css('width', '70%');
      });
    });
  });
  
  put('#/torrents/:id', function() {
    var id = parseInt(this.params['id']);
    var request = {
      'method': this.params['method'],
      'arguments': {'ids': id}
    };
    rpc.query(request, function(response) {
      getTorrent(id, renderTorrent);
    });
  });
  
  getTorrent = function(id, callback) {
    var request = {
      'method': 'torrent-get',
      'arguments': {'ids': id, 'fields':Torrent({})['fields']}
    };
    rpc.query(request, function(response) {
      callback(response['torrents'].map( function(row) {return Torrent(row)} )[0]);
    });
  }
    
  renderTorrent = function(torrent) {
    this.partial('./templates/torrents/show.mustache', TorrentView(torrent), function(rendered_view) {
      $(element_selector).find('#' + torrent.id).replaceWith(rendered_view);
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
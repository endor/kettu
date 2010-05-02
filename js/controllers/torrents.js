Torrents = function(transmission) { with(transmission) {
  var context;
  
  before(function() {
    context = this;
    context.set_and_save_modes(context.params);
    context.reload_interval = context.reload_interval || 2000;
  });
  
  get('#/torrents', function() {
    get_and_render_torrents(true);
    if(transmission.interval_id) { clearInterval(transmission.interval_id); }
    transmission.interval_id = setInterval('get_and_render_torrents(false)', context.reload_interval);    
  });
  
  get_and_render_torrents = function(rerender) {
    var request = context.build_request('torrent-get', {fields:Torrent({})['fields']});
    context.remote_query(request, function(response) {
      trigger('torrents-refreshed', {
        "torrents": response['torrents'].map( function(row) {return Torrent(row)} ),
        "rerender": rerender
      });
    });    
  };

  get('#/torrents/new', function() {
    this.partial('./templates/torrents/new.mustache', {}, function(rendered_view) {
      context.openInfo(rendered_view);
    });
  });
  
  // NOTE: this route is not restful, but how else to handle
  // registered protocol and content handlers?
  get('#/torrents/add', function() {
    var request = context.build_request('torrent-add', {'filename': this.params['url'], 'paused': false});
    context.remote_query(request, function(response) {
      torrentsUploaded(response['torrent-added']);
    });
  });
  
  del('#/torrents', function() {
    var ids = $.map(context.params['ids'].split(','), function(id) {return parseInt(id, 10);});
    var request = context.build_request('torrent-remove', {'ids': ids});
    
    if(this.params['delete_data']) { request['arguments']['delete-local-data'] = true; }
    
    context.remote_query(request, function(response) {
      context.trigger('flash', 'Torrents removed successfully.');
      $.each(ids, function() { $('#' + this).remove(); });
    });
  });
  
  post('#/torrents', function() {
    if(this.params['url'].length > 0) {
      var request = context.build_request('torrent-add', {'filename': this.params['url'], 'paused': true})
      context.remote_query(request, function(response) {
        torrentsUploaded(response['torrent-added']);
      });      
    } else {
      context.submit_add_torrent_form(context, true, torrentsUploaded);      
    }    
  });
  
  put('#/torrents/:id', function() {
    var id = parseInt(context.params['id']);
    var request = context.parseRequestFromPutParams(context.params, id);
    
    context.remote_query(request, function(response) {
      if(request['method'].match(/torrent-set/)) {
        context.trigger('flash', 'Torrent updated successfully.');
      } else {
        getTorrent(id, renderTorrent);
      }
    });
    
    if(context.params['start_download']) {
      context.remote_query({'method': 'torrent-start', 'arguments': {'ids': id}}, function() {});
      getTorrent(id, renderTorrent);
    }
    if(context.params['location']) {
      context.remote_query({
          'method': 'torrent-set-location',
          'arguments': {'ids': id, 'location': context.params['location'], 'move': true}
        }, function() {});
    }
  });
  
  put('#/torrents', function() {
    var ids = $.map(context.params['ids'].split(','), function(id) {return parseInt(id, 10);});
    if(!ids[ids.length - 1] > 0) { delete(ids[ids.length - 1]); }

    var request = context.build_request(context.params['method'], {'ids': ids});
    context.remote_query(request, function(response) {
      $.each(ids, function() {
        getTorrent(this, renderTorrent);
      });
    });
  });
  
  getTorrent = function(id, callback) {
    var fields = Torrent({})['fields'].concat(Torrent({})['info_fields']);
    var request = context.build_request('torrent-get', {'ids': id, 'fields': fields});
    context.remote_query(request, function(response) {
      if(callback) {
        callback(response['torrents'].map( function(row) {return Torrent(row);} )[0]);
      }
    });
  };
    
  renderTorrent = function(torrent) {
    var template = (transmission.view_mode == 'compact') ? 'show_compact' : 'show';
    context.partial('./templates/torrents/' + template + '.mustache', TorrentsView(torrent, context), function(rendered_view) {
      $(element_selector).find('#' + torrent.id).replaceWith(rendered_view);
      trigger('torrent-refreshed', torrent);
    });    
  };
  
  torrentsUploaded = function(torrent_added) {
    if(torrent_added) {
      var request = context.build_request('torrent-get', {fields:Torrent({})['fields']});
      context.remote_query(request, function(response) {
        context.closeInfo();
        var newest = context.get_newest_torrents(context, response);
        if(newest.length > 1) {
          context.partial('./templates/torrents/new_multiple.mustache', {torrents: newest}, function(rendered_view) {
            $.facebox(rendered_view);
          });
        } else {
          getTorrent(newest[0].id, function(torrent) {
            context.partial('./templates/torrents/new_with_data.mustache', TorrentView(torrent, context, context.params['sort_peers']), function(rendered_view) {
              $.facebox(rendered_view);
            });          
          });
        }
      });
    } else {
      context.trigger('flash', 'Torrent could not be added.');
    }
  };
  
  bind('torrents-refreshed', function(e, params) { with(this) {
    this.addUpAndDownToStore(params['torrents']);
    var sorted_torrents = this.sortTorrents(transmission.sort_mode, params['torrents'], transmission.reverse_sort);
    var filtered_torrents = this.filterTorrents(transmission.filter_mode, sorted_torrents);
    this.updateViewElements(filtered_torrents, params['rerender']);
    this.handleDragging();
  }});
  
  bind('torrent-refreshed', function(e, torrent) { with(this) {
    this.updateInfo(torrent);
  }});
}};
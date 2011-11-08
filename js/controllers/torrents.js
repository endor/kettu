kettu.Torrents = function(transmission) {
  transmission.get('#/torrents', function(context) {
    context.setAndSaveModes(context);
    
    if(kettu.app.torrents_interval_id) { clearInterval(kettu.app.torrents_interval_id); }
    kettu.app.trigger('get-torrents', {rerender: true});
    kettu.app.torrents_interval_id = setInterval("kettu.app.trigger('get-torrents')", kettu.app.reloadInterval);
    
    if(kettu.app.settings_interval_id) { clearInterval(kettu.app.settings_interval_id); }
    kettu.app.trigger('get-settings');
    kettu.app.settings_interval_id = setInterval("kettu.app.trigger('get-settings')", (kettu.app.reloadInterval * 2));
  });
    
  transmission.get('#/torrents/new', function(context) {
    this.render('templates/torrents/new.mustache', {}, function(rendered_view) {
      context.openInfo(rendered_view);
    });
  });
  
  transmission.get('#/torrents/add', function(context) {
    var request = context.buildRequest('torrent-add', { filename: this.params['url'], paused: false });
    context.remote_query(request, function(response) {
      context.renderConfigForNewTorrents(response['torrent-added']);
    });
  });
  
  transmission.del('#/torrents', function(context) {
    var ids = $.map(context.params['ids'].split(','), function(id) {return parseInt(id, 10);});
    var request = context.buildRequest('torrent-remove', { ids: ids });
    
    if(this.params['delete_data']) { request['arguments']['delete-local-data'] = true; }
    
    context.remote_query(request, function(response) {
      kettu.app.trigger('flash', 'Torrents removed successfully.');
      $.each(ids, function() { $('#' + this).remove(); });
    });
  });
  
  transmission.post('#/torrents', function(context) {
    if(this.params['url'].length > 0) {
      var request = context.buildRequest('torrent-add', { filename: this.params['url'], paused: true })
      context.remote_query(request, function(response) {
        context.renderConfigForNewTorrents(response['torrent-added']);
      });      
    } else {
      context.submitAddTorrentForm(context, true);
    }    
  });
  
  transmission.put('#/torrents/:id', function(context) {
    var id = parseInt(context.params['id']);
    var request = context.parseRequestFromPutParams(context.params, id);
    
    context.remote_query(request, function(response) {
      if(request['method'].match(/torrent-set/)) {
        kettu.app.trigger('flash', 'Torrent updated successfully.');
      } else {
        context.getTorrent(id);
      }
    });
    
    if(context.params['start_download']) {
      context.remote_query({ method: 'torrent-start', arguments: { ids: id } }, function() {});
      context.getTorrent(id);
    }
    if(context.params['location']) {
      context.remote_query({
          method: 'torrent-set-location',
          arguments: { ids: id, location: context.params['location'], move: true }
        }, function() {});
    }
  });
  
  transmission.put('#/torrents', function(context) {
    var ids = $.map(context.params['ids'].split(','), function(id) {return parseInt(id, 10);});
    if(!ids[ids.length - 1] > 0) { delete(ids[ids.length - 1]); }

    var request = context.buildRequest(context.params['method'], { ids: ids });
    context.remote_query(request, function(response) {
      $.each(ids, function() {
        context.getTorrent(this);
      });
    });
  });
  
  transmission.bind('get-torrents', function(e, params) {
    var request = { method: 'torrent-get', arguments: { fields: kettu.Torrent({})['fields'] } };
    this.remote_query(request, function(response) {
      kettu.app.trigger('refreshed-torrents', {
        torrents: response['torrents'].map(function(row) { return kettu.Torrent(row); }),
        rerender: params && params.rerender
      });
    });
  });
  
  transmission.bind('refreshed-torrents', function(e, params) {
    var sorted_torrents = this.sortTorrents(kettu.app.sort_mode, params['torrents'], kettu.app.reverse_sort);
    var filtered_torrents = this.filterTorrents(kettu.app.filter_mode, sorted_torrents);
    this.addUpAndDownToStore(params['torrents']);
    this.updateViewElements(filtered_torrents, params['rerender'], kettu.app.settings || {});
  });
  
  transmission.bind('refreshed-torrent', function(e, torrent) {
    this.updateInfo(torrent);
  });
};
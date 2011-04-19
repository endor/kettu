Torrents = function(transmission) {
  transmission.get('#/torrents', function(context) {
    context.set_and_save_modes(context);
    context.get_and_render_torrents(true);
    context.get_settings();
    transmission.interval_id = setInterval("transmission.trigger('render_torrents')", transmission.reloadInterval);
    transmission.settings_interval_id = setInterval("transmission.trigger('render_settings')", (transmission.reloadInterval * 2));
  });
  
  transmission.bind('render_torrents', function() {
    this.get_and_render_torrents(false);
  });
  
  transmission.bind('render_settings', function() {
    this.get_settings();
  });
  
  transmission.get('#/torrents/new', function(context) {
    this.render('templates/torrents/new.mustache', {}, function(rendered_view) {
      context.openInfo(rendered_view);
    });
  });
  
  transmission.get('#/torrents/add', function(context) {
    var request = context.build_request('torrent-add', { filename: this.params['url'], paused: false });
    context.remote_query(request, function(response) {
      context.render_config_for_new_torrents(response['torrent-added']);
    });
  });
  
  transmission.del('#/torrents', function(context) {
    var ids = $.map(context.params['ids'].split(','), function(id) {return parseInt(id, 10);});
    var request = context.build_request('torrent-remove', { ids: ids });
    
    if(this.params['delete_data']) { request['arguments']['delete-local-data'] = true; }
    
    context.remote_query(request, function(response) {
      transmission.trigger('flash', 'Torrents removed successfully.');
      $.each(ids, function() { $('#' + this).remove(); });
    });
  });
  
  transmission.post('#/torrents', function(context) {
    if(this.params['url'].length > 0) {
      var request = context.build_request('torrent-add', { filename: this.params['url'], paused: true })
      context.remote_query(request, function(response) {
        context.render_config_for_new_torrents(response['torrent-added']);
      });      
    } else {
      context.submit_add_torrent_form(context, true);
    }    
  });
  
  transmission.put('#/torrents/:id', function(context) {
    var id = parseInt(context.params['id']);
    var request = context.parseRequestFromPutParams(context.params, id);
    
    context.remote_query(request, function(response) {
      if(request['method'].match(/torrent-set/)) {
        transmission.trigger('flash', 'Torrent updated successfully.');
      } else {
        context.get_torrent(id);
      }
    });
    
    if(context.params['start_download']) {
      context.remote_query({ method: 'torrent-start', arguments: { ids: id } }, function() {});
      context.get_torrent(id);
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

    var request = context.build_request(context.params['method'], { ids: ids });
    context.remote_query(request, function(response) {
      $.each(ids, function() {
        context.get_torrent(this);
      });
    });
  });
  
  transmission.bind('torrents-refreshed', function(e, params) {
    var sorted_torrents = this.sortTorrents(transmission.sort_mode, params['torrents'], transmission.reverse_sort);
    var filtered_torrents = this.filterTorrents(transmission.filter_mode, sorted_torrents);
    this.addUpAndDownToStore(params['torrents']);
    this.updateViewElements(filtered_torrents, params['rerender'], transmission.settings || {});
    this.handleDragging();
  });
  
  transmission.bind('torrent-refreshed', function(e, torrent) {
    this.updateInfo(torrent);
  });
};
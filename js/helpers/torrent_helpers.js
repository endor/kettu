var TorrentHelpers = {
  build_request: function(method, arguments) {
    return({
      'method': method,
      'arguments': arguments
    });
  },

  get_and_render_torrents: function(rerender) {
    var request = { method: 'torrent-get', arguments: { fields: Torrent({})['fields'] } };
    this.remote_query(request, function(response) {
      transmission.trigger('torrents-refreshed', {
        torrents: response['torrents'].map( function(row) {return Torrent(row)} ),
        rerender: rerender
      });
    });    
  },

  render_config_for_new_torrents: function(torrent_added) {
    var context = this;
    
    if(torrent_added) {
      var request = context.build_request('torrent-get', {fields:Torrent({})['fields']});
      context.remote_query(request, function(response) {
        context.closeInfo(context);
        var newest = context.get_newest_torrents(context, response);
        if(newest.length > 1) {
          context.render('templates/torrents/new_multiple.mustache', {torrents: newest}, function(rendered_view) {
            $.facebox(rendered_view);
          });
        } else {
          context.get_torrent(newest[0].id, function(torrent) {
            context.render('templates/torrents/new_with_data.mustache', TorrentView(torrent, context, context.params['sort_peers']), function(rendered_view) {
              $.facebox(rendered_view);
            });          
          });
        }
      });
    } else {
      transmission.trigger('flash', 'Torrent could not be added.');
    }
  },
  
  get_torrent: function(id, callback) {
    var fields = Torrent({})['fields'].concat(Torrent({})['info_fields']),
      request = this.build_request('torrent-get', { ids: id, fields: fields }),
      context = this;
      
    callback = callback || this.render_torrent;
    
    this.remote_query(request, function(response) {
      callback.call(context, response['torrents'].map( function(row) { return Torrent(row); } )[0]);
    });
  },
  
  render_torrent: function(torrent) {
    var template = (transmission.view_mode == 'compact') ? 'show_compact' : 'show';
    this.render('templates/torrents/' + template + '.mustache', TorrentsView(torrent, this), function(rendered_view) {
      $(transmission.element_selector).find('#' + torrent.id).replaceWith(rendered_view);
      transmission.trigger('torrent-refreshed', torrent);
    });
  },  
  
  set_and_save_modes: function(context) {
    var params = context.params;
    
    if(params['sort'] == 'reverse') {
      transmission.reverse_sort = !transmission.reverse_sort;
      $('#reverse_link').attr('href', '#/torrents?sort=reverse&random=' + new Date().getTime());
      delete(params['sort']);
    }

    $.each([{key: 'view', def: 'normal'}, {key: 'filter', def: 'all'}, {key: 'sort', def: 'name'}], function() {
      var key = this.key, def = this.def;
      transmission[key + '_mode'] = params[key] || transmission.store.get(key + '_mode') || def;
      transmission.store.set(key + '_mode', transmission[key + '_mode']);
    });

    context.update_sort_dropdown();
    context.update_filter_list();
    context.clear_all_intervals();
    
    $('.torrent').show();
  },
  
  clear_all_intervals: function() {
    $.each(['update_settings_interval_id', 'info_interval_id', 'interval_id', 'settings_interval_id'], function() {
      if(transmission[this]) {
        clearInterval(transmission[this]);
        delete(transmission[this]);
      }      
    });    
  },
  
  update_sort_dropdown: function() {
    var sort_mode = transmission.sort_mode.charAt(0).toUpperCase() + transmission.sort_mode.slice(1);
    $('#sort_link').text('Sort by ' + (sort_mode || '…'));    
  },

  update_filter_list: function() {
    $('#filters a').removeClass('active');
    $('#filters .' + transmission.filter_mode).addClass('active');
  },
  
  submit_add_torrent_form: function(context, paused) {
    $('#add_torrent_form').ajaxSubmit({
  		url: '/transmission/upload?paused=' + paused,
  		type: 'POST',
  		data: { 'X-Transmission-Session-Id' : context.remote_session_id() },
  		dataType: 'xml',
      iframe: true,
  		success: function(response) {
  		  context.render_config_for_new_torrents(JSON.parse($(response).children(':first').text()).success);
  		}
		});  
  },
  
  get_newest_torrents: function(context, response) {
    var newest = [];

    $.each(response['torrents'].map(function(row) {return Torrent(row);}), function() {
      if((parseInt(this.addedDate, 10) - parseInt((new Date().getTime()).toString().substr(0, 10), 10)) > -2) {
        newest.push(this);
      }
    });

    return newest;
  },

  globalUpAndDownload: function(torrents) {    
    var rates = transmission.store.get('up_and_download_rate');
    var last_rate = rates[rates.length - 1];
    return Torrent({}).downAndUploadRateString(last_rate.down, last_rate.up);
  },
  
  makeNewTorrent: function(torrent, view) {
    var template = (transmission.view_mode == 'compact') ? 'show_compact' : 'show';
    var rendered_view = this.mustache(this.cache(template), TorrentsView(torrent, this));
    $('#torrents').append(rendered_view);
    this.updateInfo(torrent);
    rendered_view = null;
  },
  
  updateStatus: function(old_torrent, torrent) {
    old_torrent.removeClass('downloading').removeClass('seeding').removeClass('paused').addClass(torrent.statusWord());
    old_torrent.find('input.pauseAndActivateButton').removeClass('downloading').removeClass('seeding').removeClass('paused').addClass(torrent.statusWord());
  },
  
  updateTorrent: function(torrent) {
    var old_torrent = $('#' + torrent.id);
    old_torrent.find('.progressDetails').html(torrent.progressDetails());
    old_torrent.find('.progressbar').html(torrent.progressBar());
    old_torrent.find('.statusString').html(torrent.statusString());
    this.updateStatus(old_torrent, torrent);
    old_torrent = null;
  },
  
  addOrUpdateTorrents: function(torrents) {
    var context = this;
    $.each(torrents, function() {
      if(! $('#' + this.id.toString()).get(0)) {
        context.makeNewTorrent(this);
      } else {
        context.updateTorrent(this);
      }
    });
  },
  
  removeOldTorrents: function(torrents) {
    var old_ids = $.map($('.torrent'), function(torrent) {return $(torrent).attr('id');});
    var new_ids = $.map(torrents, function(torrent) {return torrent.id});
    $.each(old_ids, function() {
      if(new_ids.indexOf(parseInt(this)) < 0) {
        $('#' + this).remove();
      }
    });
  },
  
  updateTorrents: function(torrents, rerender) {
    this.cache_partials();
    if(torrents && rerender) {
      $('.torrent').remove();
      this.addOrUpdateTorrents(torrents);
    } else if(torrents) {
      this.removeOldTorrents(torrents);
      this.addOrUpdateTorrents(torrents);
    }
  },
  
  updateSpeedLimitMode: function(speed_limit_mode_enabled, context) {
    if(context.speed_limit_mode_enabled == speed_limit_mode_enabled) { return; }

    var form = $('#speed_limit_mode_form');
    if(speed_limit_mode_enabled) {
      $('#speed_limit_mode').addClass('active').text('Disable Speed Limit Mode');
      form.find('input:first').attr('value', 'false');
    } else {
      $('#speed_limit_mode').removeClass('active').text('Enable Speed Limit Mode');
      form.find('input:first').attr('value', 'true');      
    }
    
    context.speed_limit_mode_enabled = speed_limit_mode_enabled;
  },
  
  updateViewElements: function(torrents, rerender, settings) {
    this.updateTorrents(torrents, rerender);
    this.updateSpeedLimitMode(settings['alt-speed-enabled'], this);
    $('#globalUpAndDownload').html(this.globalUpAndDownload(torrents));
    $('.facebox_link').facebox();
  },
  
  cache_partials: function() {
    var context = this;
    ['delete_data', 'show', 'show_compact'].forEach(function(partial) {
      context.cache_partial('templates/torrents/' + partial + '.mustache', partial, context);
    });
  },
  
  formatNextAnnounceTime: function(timestamp) {
    var now = new Date().getTime();
    var current = new Date(parseInt(timestamp) * 1000 - now);
    if(current) {
      return current.getMinutes() + ' min, ' + current.getSeconds() + ' sec';
    } else {
      return timestamp;
    }
  },
  
  parseRequestFromPutParams: function(params, id) {
    var request;
    if(params['method']) {
      request = {
        'method': params['method'],
        'arguments': {'ids': id}
      };
    } else if(params['location']) {
      updatable_settings = [
        "bandwidthPriority", "downloadLimit", "downloadLimited",
        "location", "peer-limit", "seedRatioLimit", "seedRatioMode",
        "uploadLimit", "uploadLimited"
      ];
      request = {
        'method': 'torrent-set',
        'arguments': {'ids': id}
      }
      
      $.each(updatable_settings, function() {
        var setting = this;
        request['arguments'][setting] = params[setting] ? true : false;
        if(params[setting] && params[setting].match(/^-?\d+$/)) {
          request['arguments'][setting] = parseInt(params[setting], 10);
        } else if(params[setting] && params[setting] != "on") {
          request['arguments'][setting] = params[setting];
        }
      });
    } else {
      var wanted_files = $.map($('.file:checked'), function(file) {
        return parseInt($(file).attr('name').split('_')[1], 10);
      });
      var unwanted_files = $.map($('.file:not(:checked)'), function(file) {
        return parseInt($(file).attr('name').split('_')[1], 10);
      });
      request = {
        'method': 'torrent-set',
        'arguments': { 'ids': id, 'files-unwanted': unwanted_files }
      }
      if(wanted_files.length > 0) {
        request['arguments']['files-wanted'] = wanted_files;
      }
    }
    return request; 
  }
};
var TorrentHelpers = {
  build_request: function(method, arguments) {
    return({
      'method': method,
      'arguments': arguments
    });
  },
  
  // TODO: this needs to be cleaned up
  set_and_save_modes: function(params) {
    if(params['sort'] == 'reverse') {
      transmission.reverse_sort = !transmission.reverse_sort;
      $('#reverse_link').attr('href', '#/torrents?sort=reverse&random=' + new Date().getTime());
      transmission.sort_mode = transmission.store.get('sort_mode') || 'name';
    } else {
      transmission.sort_mode = params['sort'] || transmission.store.get('sort_mode') || 'name';
      var sort_mode = transmission.sort_mode.charAt(0).toUpperCase() + transmission.sort_mode.slice(1);
      $('#sort_link').text('Sort by ' + sort_mode);
    }
    
    transmission.view_mode = params['view'] || transmission.store.get('view_mode') || 'normal';
    transmission.filter_mode = params['filter'] || transmission.store.get('filter_mode') || 'all';
    
    $('#filters a').removeClass('active');
    $('#filters ' + transmission.filter_mode).addClass('active');
    
    transmission.store.set('sort_mode', transmission.sort_mode);
    transmission.store.set('view_mode', transmission.view_mode);
    transmission.store.set('filter_mode', transmission.filter_mode);
    
    if(transmission.settings_interval_id) {
      clearInterval(transmission.settings_interval_id);
      delete(transmission.settings_interval_id);
    }
    
    if(transmission.info_interval_id) {
      clearInterval(transmission.info_interval_id);
      delete(transmission.info_interval_id);      
    }
    
    $('.torrent').show();
  },

  submit_add_torrent_form: function(context, paused, torrentsUploaded) {
    $('#add_torrent_form').ajaxSubmit({
  		'url': '/transmission/upload?paused=' + paused,
  		'type': 'POST',
  		'data': { 'X-Transmission-Session-Id' : context.remote_session_id() },
  		'dataType': 'xml',
      'iframe': true,
  		'success': function(response) {
  		  torrentsUploaded($(response).children(':first').text().match(/200/));
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
  },
  
  updateStatus: function(old_torrent, torrent) {
    old_torrent.removeClass('downloading').removeClass('seeding').removeClass('paused').addClass(torrent.statusWord());
  },
  
  updateTorrent: function(torrent) {
    var old_torrent = $('#' + torrent.id);
    old_torrent.find('.progressDetails').html(torrent.progressDetails());
    old_torrent.find('.progressbar').html(torrent.progressBar());
    old_torrent.find('.statusString').html(torrent.statusString());
    this.updateStatus(old_torrent, torrent);
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
  
  updateViewElements: function(torrents, rerender) {
    this.updateTorrents(torrents, rerender);
    $('#globalUpAndDownload').html(this.globalUpAndDownload(torrents));
    $('.facebox_link').facebox();
  },
  
  cache_partials: function() {
    var context = this;
    $.each(['delete_data', 'show', 'show_compact'], function() {
      context.cache_partial('./templates/torrents/' + this + '.mustache', this, context);
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
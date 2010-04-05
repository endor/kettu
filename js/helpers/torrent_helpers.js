var TorrentHelpers = {  
  globalUpAndDownload: function(torrents) {
    var uploadRate = 0.0, downloadRate = 0.0;
    $.each(torrents, function() {
      uploadRate += this.rateUpload;
      downloadRate += this.rateDownload;
    });
    this.addUpAndDownToStore({"up": uploadRate, "down": downloadRate});
    return Torrent({}).downAndUploadRateString(downloadRate, uploadRate);
  },
  
  cycleTorrents: function() {
    $('.torrent').removeClass('even');
    $('.torrent:even').addClass('even');
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
  
  updateTorrents: function(torrents, need_change) {
    this.cache_partials();
    if(torrents && need_change) {
      $('.torrent').remove();
      this.addOrUpdateTorrents(torrents);
    } else if(torrents) {
      this.removeOldTorrents(torrents);
      this.addOrUpdateTorrents(torrents);
    }
  },
  
  updateViewElements: function(torrents, need_change) {
    this.makeSortLinkReverse();
    this.updateTorrents(torrents, need_change);
    this.cycleTorrents();
    $('#globalUpAndDownload').html(this.globalUpAndDownload(torrents));
    this.highlightLink('#filters', '.' + transmission.filter_mode);
    this.highlightLink('#sorts', '.' + transmission.sort_mode);
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
  
  makeSortLinkReverse: function() {
    var link = $('#sorts .' + transmission.sort_mode);
    var url = link.attr('href');
    
    $('#sorts a').each(function() {
      $(this).attr('href', $(this).attr('href').match(/([^&]+)(&reverse=true)?/)[1]);
    });
    if(!url.match(/reverse/)) {
      link.attr('href', url + '&reverse=true');
    }
  },
  
  parseRequestFromPutParams: function(params, id) {
    var request;
    if(params['method']) {
      request = {
        'method': params['method'],
        'arguments': {'ids': id}
      };
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
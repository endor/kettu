var TorrentHelpers = {
  valid_filters: function() {
    return ['seeding', 'downloading', 'paused', 'seeding'];
  },
  
  globalUpAndDownload: function(torrents) {
    var uploadRate = 0.0, downloadRate = 0.0;
    $.each(torrents, function() {
      uploadRate += this.rateUpload;
      downloadRate += this.rateDownload;
    });
    this.addUpAndDownToStore({"up": uploadRate, "down": downloadRate});
    return Torrent({}).downAndUploadRateString(downloadRate, uploadRate);
  },
  
  addUpAndDownToStore: function(data) {
    if(store.exists('up_and_download_rate')) {
      store_data = store.get('up_and_download_rate');
      if(store_data.length > 29) {
        store_data.shift();
      }
      store_data.push(data);
      data = store_data;
    } else {
      data = [data];
    }
    store.set('up_and_download_rate', data);
  },
  
  cycleTorrents: function() {
    $('.torrent').removeClass('even');
    $('.torrent:even').addClass('even');
  },
  
  makeNewTorrent: function(torrent, view) {
    var template = (transmission.view_mode == 'compact') ? 'show_compact' : 'show';
    this.cache_partial('./templates/torrents/' + template + '.mustache', template, this);
    var rendered_view = Mustache.to_html(this.cache(template), TorrentView(torrent, this));
    $('#torrents').append(rendered_view);
    this.updateInfo(torrent);
  },
  
  updateTorrent: function(torrent) {
    var old_torrent = $('#' + torrent.id);
    old_torrent.find('.progressDetails').html(torrent.progressDetails());
    old_torrent.find('.progressbar').html(torrent.progressBar());
    old_torrent.find('.statusString').html(torrent.statusString());
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
    if(torrents && need_change) {
      $('.torrent').remove();
      this.addOrUpdateTorrents(torrents);
    } else if(torrents) {
      this.removeOldTorrents(torrents);
      this.addOrUpdateTorrents(torrents);
    }
  },
  
  updateViewElements: function(torrents, view) {
    this.updateTorrents(torrents, view);
    this.cycleTorrents();
    $('#globalUpAndDownload').html(this.globalUpAndDownload(torrents));
  },
  
  cache_partial: function(template, partial, context) {
    if(!context.cache(partial)) {
      $.ajax({'async': false, 'url': template, 'success': function(response) {
        context.cache(partial, response);
      }});
    };    
  },
  
  activateAddTorrentLink: function() {
    var context = this;
    $('#add_a_torrent').click(function() {
      if(context.infoIsOpen()) {
        context.closeInfo();
      } else {
        window.location.hash = '/torrents/new';
      }
      return false;
    });
  },
  
  activateFilterAndSortLink: function() {
    var context = this;
    $('#activate_filters').click(function() {
      $('#filters').show();
      $('#sorts').hide();
    });
    $('#activate_sorts').click(function() {
      $('#filters').hide();
      $('#sorts').show();      
    });
  },
  
  activateTurtleModeLink: function() {
    var context = this;
    $('#turtle_mode').click(function() {
      var form = $('#turtle_mode_form');
      form.submit();
      if($(this).hasClass('active')) {
        $(this).removeClass('active');
        $(this).text('Enable Turtle Mode');
        form.find('input:first').attr('value', 'true');
      } else {
        $(this).addClass('active');
        $(this).text('Disable Turtle Mode');
        form.find('input:first').attr('value', 'false');
      }
      return false;
    });
  },
  
  activateCompactViewLink: function() {
    var context = this;
    $('#compact_view').click(function() {
      if($(this).hasClass('active')) {
        $(this).removeClass('active');
        $(this).text('Enable Compact View');
        context.redirect('#/torrents?view=normal');
      } else {
        $(this).addClass('active');
        $(this).text('Disable Compact View');
        context.redirect('#/torrents?view=compact');
      }
      return false;
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
  }  
};
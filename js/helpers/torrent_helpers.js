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
    return Torrent({}).downAndUpLoadRateString(downloadRate, uploadRate);
  },
  
  cycleTorrents: function() {
    $('.torrent').removeClass('even');
    $('.torrent:even').addClass('even');
  },
  
  removeOldTorrents: function(new_torrents, old_torrents) {
    var old_ids = $.map(old_torrents, function(torrent) {return $(torrent).attr('id');});
    var new_ids = $.map(new_torrents, function(torrent) {return torrent.id});
    $.each(old_ids, function() {
      if(new_ids.indexOf(parseInt(this)) < 0) {
        $('#' + this).remove();
      }
    });
  },
  
  makeNewTorrent: function(torrent) {
    this.cache_partial('./templates/torrents/show.mustache', 'torrent_show', this);
    var rendered_view = Mustache.to_html(this.cache('torrent_show'), TorrentView(torrent, this));
    $('#torrents').append(rendered_view);
    this.updateInfo(torrent);
  },
  
  updateTorrents: function(torrents) {
    var context = this;
    var updatableFields = ['progressDetails', 'name', 'progressBar', 'pauseAndActivateButton', 'statusString'];

    this.removeOldTorrents(torrents, $('.torrent'));
    
    $.each(torrents, function() {
      var old_torrent = $('#' + this.id);

      if(!old_torrent.get(0)) {
        context.makeNewTorrent(this);
      } else {
        var new_torrent = this;
        $.each(updatableFields, function() {
          old_torrent.find('.' + this).html(new_torrent[this]);
        });
        $.each(context.valid_filters(), function() {
          if(old_torrent.hasClass(this)) {
            old_torrent.removeClass(this);
          };
        });
        old_torrent.addClass(new_torrent.statusWord());        
      };
    });
  },
  
  updateViewElements: function(torrents) {
    this.updateTorrents(torrents);
    this.cycleTorrents();
    $('#globalUpAndDownload').html(this.globalUpAndDownload(torrents));
  },
  
  cache_partial: function(template, partial, context) {
    if(!context.cache(partial)) {
      $.ajax({'async': false, 'url': template, 'success': function(response) {
        context.cache(partial, response);
      }});
    };    
  }
};
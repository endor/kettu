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
  
  makeNewTorrent: function(torrent) {
    var template = transmission.view_mode == 'compact' ? 'show_compact.mustache' : 'show.mustache';
    this.cache_partial('./templates/torrents/' + template, 'torrent_show', this);
    var rendered_view = Mustache.to_html(this.cache('torrent_show'), TorrentView(torrent, this));
    $('#torrents').append(rendered_view);
    this.updateInfo(torrent);
  },
  
  updateTorrents: function(torrents) {
    var context = this;
    var active_torrent_id = $('.torrent.active').attr('id');

    context.clearCache('torrent_show');
    $('.torrent').remove();
    $.each(torrents, function() {
      context.makeNewTorrent(this);
    });
    
    var active_torrent = $('#' + active_torrent_id);
    if(active_torrent.length > 0) {
      context.highlightLi('#torrents', active_torrent);
      if(context.infoIsOpen()) {
        window.location.hash = '/torrents/' + active_torrent_id;
      }      
    }
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
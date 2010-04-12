var InfoHelpers = {
  closeInfo: function() {
    this.clearReloadInterval();
    $('.main').removeClass('info');
    $('#info').hide();
    var path = transmission.filter_mode ? '#/torrents?filter=' + transmission.filter_mode : '#/torrents';
    this.redirect(path);
    return false;
  },

  openInfo: function(view) {
    var info = $('#info');
    info.html(view);
    info.show();
    $('.main').addClass('info');
    this.menuizeInfo();
  },

  clearReloadInterval: function() {
    if(transmission.info_interval_id) {
      clearInterval(transmission.info_interval_id);
    }
  },
  
  infoIsOpen: function() {
    return $('.main').hasClass('info');
  },

  handleDoubleClickOnTorrent: function(torrent) {
    var context = this;
    $('#' + torrent.id).dblclick(function(event) {
      if(context.infoIsOpen()) {
        context.closeInfo();
      } else {
        var active_torrent = $('.torrent.active');
        if(active_torrent.get(0)) {
          context.redirect('#/torrents/' + active_torrent.attr('id'));
        }        
      }
      event.preventDefault();
    });
  },
  
  // NOTE: make this smaller and more readable
  handleClickOnTorrent: function(torrent) {
    var context = this;
    $('#' + torrent.id).click(function(e) {
      if(e.shiftKey && $('.torrent.active').length >= 1) {
        var first_index = $('.torrent.active:first').index();
        var last_index = $('.torrent').index($(this));

        if(first_index > last_index) {
          first_index = last_index;
          last_index = $('.torrent.active:last').index();
        }

        var torrents = $('.torrent:lt(' + (last_index + 1) + ')');
        if(first_index > 0) { torrents = torrents.filter(':gt(' + (first_index - 1) + ')'); }

        context.highlightTorrents(torrents);
        $('#search').focus();          
      } else if(e.metaKey && $('.torrent.active').length >= 1) {
        $(this).toggleClass('active');
      } else {
        context.highlightTorrents($(this));
        if(context.infoIsOpen()) {
          context.saveLastMenuItem($('.menu-item.active').attr('id'));
          window.location = '#/torrents/' + $(this).attr('id');
          // NOTE: a redirect seems to interfere with our double click handling here
        }        
      }
    });    
  },
  
  handleDragging: function() {
    var context = this;
    $('#torrents').mousedown(function(event) {
      context.original_position = $(event.target).closest('.torrent').position().top;
      
      $('#torrents').mousemove(function(event) {
        var selectable_torrents = [];
        var y1 = context.original_position;
        var y2 = $(event.target).closest('.torrent').position().top;

    		if(y2 < y1) {var tmp = y1; y1 = y2; y2 = tmp; }
        
        $('.torrent').each(function() {
          var position = $(this).position();
          
          if(position.top < y2 && position.top > y1) {
            $(this).addClass('active');
          }
        });
      });
      
      event.preventDefault();
    });

    $('body').mouseup(function() {
      $('#torrents').unbind('mousemove');
    });
    
    $('#torrents').mouseup(function() {
      $('#torrents').unbind('mousemove');
    });
  },

  updateInfo: function(torrent) {
    this.trigger('changed');
    this.handleClickOnTorrent(torrent);
    this.handleDoubleClickOnTorrent(torrent);
  },
  
  activateInfoInputs: function() {
    $('#info input').change(function() {
      $(this).parents('form:first').trigger('submit');
      return false;
    });
  },

  activateFileInputs: function() {
    $('#info .file').change(function() {
      $(this).parents('form:first').trigger('submit');
      return false;
    });
    $('#info .files .select_all').click(function() {
      $('#info .file:not(:disabled)').attr('checked', true);
      $('#info .files form').submit();
      return false;
    });
    $('#info .files .deselect_all').click(function() {
      $('#info .file:not(:disabled)').attr('checked', false);
      $('#info .files form').submit();
      return false;
    });    
  },
  
  startCountDownOnNextAnnounce: function() {
    var context = this;
    var timer = setInterval(function() {
      var timestamp = $('.countdown').attr('data-timestamp');
      var formatted = context.formatNextAnnounceTime(timestamp);
      
      if(formatted.match(/59 min/)) {
        clearInterval(timer);
        context.saveLastMenuItem($('.menu-item.active').attr('id'));
        context.closeInfo();
        context.openInfo();
      } else {
        $('.countdown').text(formatted);
      }
    }, 980);
  }
};
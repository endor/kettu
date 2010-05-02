var InfoHelpers = {
  closeInfo: function() {
    this.clearReloadInterval();
    $('.main').removeClass('info');
    $('#info').hide();
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
        if(active_torrent.length > 0) {
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
      // NOTE: why is this necessary? somehow safari does not stop propagation on a context menu event.
      if($('#context_menu').is(':visible')) { return false; }
      
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
        if(context.infoIsOpen()) {
          context.partial('./templates/torrents/multiple_torrents_selected.mustache', {}, function(view) {
            $('#info').html(view);
          });          
        }
        
        $('#search').focus();          
      } else if(e.metaKey && $('.torrent.active').length >= 1) {
        $(this).toggleClass('active');
        if(context.infoIsOpen()) {
          context.partial('./templates/torrents/multiple_torrents_selected.mustache', {}, function(view) {
            $('#info').html(view);
          });          
        }
      } else {
        context.highlightTorrents($(this));
        if(context.infoIsOpen()) {
          context.saveLastMenuItem($('.menu-item.active').attr('id'));
          window.location = '#/torrents/' + $(this).attr('id');
          // NOTE: a redirect seems to interfere with our double click handling here
        }        
      }
      
      e.preventDefault();
    });    
  },
  
  handleDragging: function() {
    var context = this;
    $('#torrents').mousedown(function(event) {
      var closest_torrent = $(event.target).closest('.torrent');
      context.original_position = closest_torrent.position().top;
      context.closest_torrent = closest_torrent;

  		// NOTE: this might be slow for lots of torrents
  		//       maybe there's a faster way to do this?
      $('#torrents').mousemove(function(event) {
        context.closest_torrent.addClass('active');
        
        var y1 = context.original_position;
        var y2 = $(event.target).closest('.torrent').position().top;

    		if(y2 < y1) { var tmp = y1; y1 = y2; y2 = tmp; }
        
        $('.torrent:visible').each(function() {
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
  
  activateInfoInputs: function(torrent) {
    $('#info input').change(function() {
      $(this).parents('form:first').trigger('submit');
      return false;
    });

    $('#info select').change(function() {
      $(this).parents('form:first').trigger('submit');
      if($(this).hasClass('seedRatioMode')) {
        if($(this).val() == 1) {
          $('#info .seedRatioLimit').show();
        } else {
          $('#info .seedRatioLimit').hide();
        }
      }
      return false;
    });
    
    $('#info .bandwidthPriority').val(torrent.bandwidthPriority);
    $('#info .seedRatioMode').val(torrent.seedRatioMode);

    if(torrent.seedRatioMode == 1) {
      $('#info .seedRatioLimit').show();
    } else {
      $('#info .seedRatioLimit').hide();
    }
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
    $('#info .folder').click(function() {
      $(this).nextAll('.files_in_folders:first').slideToggle();
      var arrow = $(this).find('.arrow');
      if(arrow.attr('src').match(/right/)) {
        arrow.attr('src', 'css/images/arrow_down.png');
      } else {
        arrow.attr('src', 'css/images/arrow_right.png');
      }
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
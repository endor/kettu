kettu.InfoHelpers = {
  closeInfo: function() {
    if(kettu.app.info_interval_id) { clearInterval(kettu.app.info_interval_id); }
    if(kettu.app.mobile) { $('#mobile-header .back').hide(); }
    this.saveLastMenuItem($('.menu-item.active'));
    $('.main').removeClass('info');
    $('#info').hide();
    $('.info_nav a').removeClass('active');
    this.redirect('#/torrents');
    return false;
  },

  openInfo: function(view, clazz) {
    var info = $('#info');

    info.html(view);
    // NOTE: if there's a way in CSS to fix this without using JS, that'd be preferable
    if(kettu.app.mobile) {
      info.css('height', $(document).height());
      info.css('width', $(document).width());
    } else {
      info.css('height', $(document).height() - $('header').height() - $('footer').height() -
        this.inPixel(info.css('padding-top')) - this.inPixel(info.css('padding-bottom')));
      info.css('left', ($(window).width() / 2) - ($('#container').width() / 2) + 550);
    }
    info.show();
    $('.main').addClass('info');
    this.menuizeInfo();

    $('.info_nav a').removeClass('active');
    $('.info_nav a.' + clazz + '-link').addClass('active');

    if(clazz) { info.removeClass().addClass(clazz); }
  },

  infoIsOpen: function() {
    return $('.main').hasClass('info');
  },

  infoDisplaysInspector: function() {
    return $('#info').hasClass('details');
  },

  infoDisplaysSettings: function() {
    return $('#info').hasClass('settings');
  },

  handleDoubleClickOnTorrent: function(torrent) {
    var context = this;
    $('#' + torrent.id).dblclick(function(event) {
      if(context.infoIsOpen()) {
        context.closeInfo();
      } else {
        var active_torrent = $('.torrent.active');
        if(active_torrent.length > 0) {
          context.redirect('#/torrent_details/' + active_torrent.attr('id'));
        }
      }
      event.preventDefault();
    });
  },

  // NOTE: make this smaller and more readable
  handleClickOnTorrent: function(torrent) {
    if(!kettu.app.mobile) {
      var context = this;
      $('#' + torrent.id).click(function(e) {
        // NOTE: safari does not stop propagation on a context menu event, that means
        //       a click event is fired also
        if($('#context_menu').is(':visible')) { $('#context_menu').hide(); return false; }

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
          if(context.infoIsOpen()) { context.redirect('#/torrent_details'); }
          $('#search').focus();
        } else if(e.metaKey && $('.torrent.active').length >= 1) {
          $(this).toggleClass('active');
          if(context.infoIsOpen()) { context.redirect('#/torrent_details'); }
        } else {
          context.highlightTorrents($(this));
          if(context.infoIsOpen()) {
            context.saveLastMenuItem($('.menu-item.active'));
            window.location = '#/torrent_details/' + $(this).attr('id');
            // NOTE: a redirect seems to interfere with our double click handling here
          }
        }
      });
    }
  },

  updateInfo: function(torrent) {
    this.trigger('changed');
    this.handleClickOnTorrent(torrent);
    this.handleDoubleClickOnTorrent(torrent);
  },

  activateInfoInputs: function(torrent) {
    $('#info input:not(.dont_update_parent)').change(function() {
      $(this).parents('form:first').trigger('submit');
      return false;
    });

    $('#info select').change(function() {
      if($(this).hasClass('locationSelect')) {
        $('#info .location-field input').val($(this).val());
      }

      $(this).parents('form:first').trigger('submit');
      if($(this).hasClass('seedRatioMode')) {
        if($(this).val() === 1) {
          $('#info .seedRatioLimit').show();
        } else {
          $('#info .seedRatioLimit').hide();
        }
      }

      return false;
    });

    $('#info .bandwidthPriority').val(torrent.bandwidthPriority);
    $('#info .seedRatioMode').val(torrent.seedRatioMode);

    if(torrent.seedRatioMode === 1) {
      $('#info .seedRatioLimit').show();
    } else {
      $('#info .seedRatioLimit').hide();
    }

    var $locationSelect = $('#info .locationSelect');
    if ($locationSelect.length > 0) {
      $locationSelect.val(torrent.downloadDir);
    }
  },

  activateFileInputs: function() {
    $('#info .file').change(function() {
      $(this).parents('form:first').trigger('submit');
      return false;
    });
    $('#info .files .select_all').click(function() {
      $('#info .file:not(:disabled)').attr('checked', true);
      $('#info .folder-check:not(:disabled)').attr('checked', true);
      $('#info .files form').submit();
      return false;
    });
    $('#info .files .deselect_all').click(function() {
      $('#info .file:not(:disabled)').removeAttr('checked');
      $('#info .folder-check:not(:disabled)').removeAttr('checked');
      $('#info .files form').submit();
      return false;
    });
    $('#info .folder').click(function() {
      $(this).nextAll('.files_in_folders:first').slideToggle();
      var arrow = $(this).parent().find('.arrow');
      if(arrow.attr('src').match(/right/)) {
        arrow.attr('src', 'css/images/arrow_down.png');
      } else {
        arrow.attr('src', 'css/images/arrow_right.png');
      }
      return false;
    });
    $('#info .folder-check').click(function() {
      if($(this).is(':checked')) {
        $(this).siblings('.files_in_folders').find('input.file').attr('checked', 'checked');
      } else {
        $(this).siblings('.files_in_folders').find('input.file').removeAttr('checked');
      }
      $('#info .files form').submit();
      return true;
    });
  },

  activatePrioritySelects: function() {
    $('img.priority').click(function(event) {
      var menu = $('#selectPriority'),
          hiddenPriority = $(this).siblings('input.priority_hidden:first'),
          newPriority;

      if(hiddenPriority.val() === 'done') { return false; }

      var callback = function() {
          menu.hide();
          menu.find('a').unbind('click');
          menu.find('form').unbind('submit');
          return true;
      };

      $(document).one('click', callback);
      menu.find('form').submit(callback);

      menu.find('a').click(function(evt) {
        evt.preventDefault();
        newPriority = $(this).attr('data-priority');

        if(hiddenPriority.hasClass('priority_file')) {
          hiddenPriority.val(newPriority);
        } else if(hiddenPriority.hasClass('priority_folder')) {
          var files = hiddenPriority.siblings('.files_in_folders');
          files.find('.priority_file').val(newPriority);
          files.find('img.priority').attr('src', 'css/images/priority_' + newPriority + '_small.png');
          hiddenPriority.val(newPriority);
        }

        hiddenPriority.parents('form:first').submit();
        hiddenPriority.siblings('img.priority').attr('src', 'css/images/priority_' + newPriority + '_small.png');
      });

      $(document).keyup(function(event) {
        if(event.keyCode === 27) { callback(); }
      });

      menu.css({
        left: event.pageX - 170,
        top: event.pageY - 150
      }).show();

      event.stopPropagation();
    });
  },

  startCountDownOnNextAnnounce: function() {
    var context = this;
    var timer = setInterval(function() {
      var timestamp = $('.countdown').attr('data-timestamp'),
          formatted = context.formatNextAnnounceTime(timestamp);

      if(formatted.match(/59 min/)) {
        clearInterval(timer);
        context.saveLastMenuItem($('.menu-item.active'));
        context.closeInfo();
        context.openInfo();
      } else {
        $('.countdown').text(formatted);
      }
    }, 980);
  }
};

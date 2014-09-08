kettu.LinkHelpers = {
  activateLinks: function() {
    this.activateInspectorLink();
    this.activateAddTorrentLink();
    this.activateSettingsLink();
    this.activateStatisticsLink();
    this.activateSpeedLimitModeLink();
    this.activateCompactViewLink();
    this.activateStartAndStopAllLink();
  },

  activateInspectorLink: function() {
    var context = this;

    $(document).on('click', '.inspector', function() {
      if(context.infoIsOpen() && (window.location.hash.match(/\/torrents\/\d+/) ||
          window.location.hash.match(/\/torrent_details/))) {
        context.closeInfo();
      } else {
        context.redirect('#/torrent_details');
      }
      return false;
    });
  },

  activateAddTorrentLink: function() {
    var context = this;
    $('#add_a_torrent').click(function() {
      if(context.infoIsOpen() && window.location.hash.match('/torrents/new')) {
        context.closeInfo();
      } else {
        window.location.hash = '/torrents/new';
      }
      return false;
    });
  },

  activateSpeedLimitModeLink: function() {
    $('.speed_limit_mode').click(function() {
      var form = $('#speed_limit_mode_form'),
        link = $(this), title;
      form.trigger('submit');
      if(link.hasClass('active')) {
        title = 'Enable Speed Limit Mode';
        link.text(title).attr('title', title).removeClass('active');
        form.find('input:first').attr('value', 'true');
      } else {
        title = 'Disable Speed Limit Mode';
        link.text(title).attr('title', title).addClass('active');
        form.find('input:first').attr('value', 'false');
      }
      return false;
    });
  },

  activateCompactViewLink: function() {
    var context = this, redirect_path = '';

    if(this.store.get('view_mode') === 'compact') {
      $('.compact_view').addClass('active');
      $('.compact_view').text('Disable Compact View');
    }

    $('.compact_view').click(function() {
      if($(this).hasClass('active')) {
        $(this).removeClass('active');
        $(this).text('Enable Compact View');
        redirect_path = '#/torrents?view=normal';
      } else {
        $(this).addClass('active');
        $(this).text('Disable Compact View');
        redirect_path = '#/torrents?view=compact';
      }
      context.redirect(redirect_path);
      return false;
    });
  },

  activateStartAndStopAllLink: function() {
    var context = this,
      start_stop_all = function(data, clazz) {
        return function(evt) {
          context.render('templates/context_menu/show.mustache', data, function(rendered_view) {
            $('#context_menu').html(rendered_view);

            var selected_ids = $.map($('.torrent'), function(torrent) { return $(torrent).attr('id'); }).join(',');
            $('#context_menu .' + clazz + ' form .ids').val(selected_ids);
            $('#context_menu .' + clazz + ' form').submit();
          });

          evt.preventDefault();
        };
      };

    $('.start_all').click(start_stop_all({paused: true}, 'activate'));
    $('.stop_all').click(start_stop_all({not_paused: true}, 'pause'));
  },

  activateSettingsLink: function() {
    var context = this;
    $('#settings').click(function() {
      if(context.infoIsOpen() && window.location.hash.match('/settings')) {
        context.closeInfo();
      } else {
        context.redirect('#/settings');
      }
      return false;
    });
  },

  activateStatisticsLink: function() {
    var context = this;
    $('#statistics').click(function() {
      if(context.infoIsOpen() && window.location.hash.match('/statistics')) {
        context.closeInfo();
      } else {
        context.redirect('#/statistics');
      }
      return false;
    });
  }
};

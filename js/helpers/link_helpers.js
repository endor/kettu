var LinkHelpers = {
  activateLinks: function() {
    this.activateAddTorrentLink();
    this.activateSettingsLink();
    this.activateStatisticsLink();
    this.activateTurtleModeLink();
    this.activateCompactViewLink();
    this.activateFilterAndSortLink();
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
    $('#turtle_mode').click(function() {
      var form = $('#turtle_mode_form');
      form.trigger('submit');
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
    var context = this, redirect_path = '';
    $('#compact_view').click(function() {
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
  
  activateSettingsLink: function() {
    var context = this;
    $('#settings').click(function() {
      if(context.infoIsOpen()) {
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
      if(context.infoIsOpen()) {
        context.closeInfo();
      } else {
        context.redirect('#/statistics');
      }
      return false;
    });
  }
}
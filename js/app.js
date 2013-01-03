kettu.app = $.sammy(function() {
  this.use(Sammy.TransmissionRPC);
  this.use(Sammy.Mustache);
  this.use(Sammy.Cache);

  this.element_selector = 'body';
  this.cache_partials = true;

  this.helpers({
    store: kettu.store
  });
  this.helpers(kettu.ApplicationHelpers);
  this.helpers(kettu.MobileHelpers);
  this.helpers(kettu.LocationHelpers);
  this.helpers(kettu.ContextMenuHelpers);
  this.helpers(kettu.DraggingHelpers);
  this.helpers(kettu.FilterTorrentsHelpers);
  this.helpers(kettu.InfoHelpers);
  this.helpers(kettu.LinkHelpers);
  this.helpers(kettu.SearchHelpers);
  this.helpers(kettu.SettingHelpers);
  this.helpers(kettu.SortTorrentsHelpers);
  this.helpers(kettu.TorrentHelpers);
  this.helpers(kettu.TorrentDetailsHelpers);
  this.helpers(kettu.ViewHelpers);

  kettu.TorrentDetails(this);
  kettu.Torrents(this);
  kettu.Settings(this);
  kettu.Statistics(this);
  kettu.Blocklist(this);

  this.bind('flash', function(e, message) {
    $('#flash').html(message).show().delay(3000).fadeOut('slow');
  });

  this.bind('errors', function(e, errors) {
    this.showErrors(errors);
  });

  this.bind('refresh-details', function() {
    this.redirect('#/torrent_details');
  });

  this.bind('create-delete-facebox', function() {
    var active_torrents = $('.torrent.active'),
      data = {
        ids: $.map(active_torrents, function(torrent) { return $(torrent).attr('id'); }).join(','),
        names: $.map(active_torrents, function(torrent) { return $(torrent).find('.name').text() }),
      };

    this.render('templates/delete_facebox/show.mustache', data, function(rendered_view) {
      jQuery.facebox(rendered_view);
    });
  });

  this.bind('init', function() {
    this.activateMobileButtons();
    this.activateContextMenu();
    this.activateLinks();
    this.activateSearch(this);
    this.activateSortSelect(this);
    this.closeInfo();
    this.configureFacebox();
    this.handleDragging();
    this.hideContextMenu();

    // Allow Cmd/Ctrl+A to select all, Cmd/Ctrl+Backspace to delete
    $(document).bind('keydown', function(e) {
      if(e.metaKey && e.which == 65) {  // Note: e.metaKey will also be true if the Ctrl key is pressed
        $('.torrent').addClass('active');
        if(kettu.InfoHelpers.infoIsOpen()) { kettu.app.trigger('refresh-details'); };
        return false;
      } else if(e.metaKey && e.which == 8) {
        if($('.torrent.active').length > 0) {
          kettu.app.trigger('create-delete-facebox');
          return false;
        }
      }
      return true;
    });
  });
});

$(function() {
  kettu.app.reloadInterval = kettu.store.get('torrentReloadInterval') || kettu.config.reloadInterval || 2000;
  kettu.store.set('torrentReloadInterval', kettu.app.reloadInterval);

  if($(window).width() > 480) {
    kettu.app.mobile = false;
    kettu.app.run('#/torrents');
  } else {
    kettu.app.mobile = true;
    kettu.app.run('#/torrents?view=compact');
  }

  kettu.app.trigger('init');
});

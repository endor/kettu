kettu.store = new Sammy.Store({name: 'data', type: ['local', 'cookie']});

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
  
  this.bind('init', function() {
    this.activateTapHoldMenu();
    this.activateContextMenu();
    this.activateLinks();
    this.activateSearch(this);
    this.activateSortSelect(this);
    this.closeInfo(this);
    this.configureFacebox();
    this.handleDragging();
    this.hideContextMenu();
  });
});
 
$(function() {
  kettu.app.reloadInterval = kettu.store.get('torrentReloadInterval') || 2000;
  kettu.store.set('torrentReloadInterval', kettu.app.reloadInterval);
  if($(window).width() > 480) {
    kettu.app.mobile = false;
    kettu.app.run('#/torrents');    
  } else {
    $.mobile.touchOverflowEnabled = true;
    kettu.app.mobile = true;
    kettu.app.run('#/torrents?view=compact');
  }
  kettu.app.trigger('init');
});
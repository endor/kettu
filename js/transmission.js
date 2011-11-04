kettu.app = $.sammy(function() {
  this.use(Sammy.TransmissionRPC);
  this.use(Sammy.Mustache);
  this.use(Sammy.Cache);
  
  this.element_selector = 'body';
  this.cache_partials = true;
  this.store = new Sammy.Store({name: 'data', type: ['local', 'cookie']});
  
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
  this.helpers(kettu.StatisticHelpers);
  this.helpers(kettu.StoreHelpers);
  this.helpers(kettu.TorrentHelpers);
  this.helpers(kettu.TorrentDetailsHelpers);
  this.helpers(kettu.ViewHelpers);
  
  kettu.TorrentDetails(this);
  kettu.Torrents(this);
  kettu.Settings(this);
  kettu.Statistics(this);
  
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
  kettu.app.reloadInterval = 2000;
  if($(window).width() > 480) {
    kettu.app.mobile = false;
    kettu.app.run('#/torrents');    
  } else {
    kettu.app.mobile = true;
    kettu.app.run('#/torrents?view=compact');
  }
  kettu.app.trigger('init');
});
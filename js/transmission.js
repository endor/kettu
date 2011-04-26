var transmission = $.sammy(function() {
  this.use(Sammy.TransmissionRPC);
  this.use(Sammy.Mustache);
  this.use(Sammy.Cache);
  
  this.element_selector = 'body';
  this.cache_partials = true;
  this.store = new Sammy.Store({name: 'data', type: ['local', 'cookie']});
  
  this.helpers(ApplicationHelpers);
  this.helpers(ContextMenuHelpers);
  this.helpers(DraggingHelpers);
  this.helpers(FilterTorrentsHelpers);
  this.helpers(InfoHelpers);
  this.helpers(LinkHelpers);
  this.helpers(SearchHelpers);
  this.helpers(SettingHelpers);
  this.helpers(SortTorrentsHelpers);
  this.helpers(StatisticHelpers);
  this.helpers(StoreHelpers);
  this.helpers(TorrentHelpers);
  this.helpers(TorrentDetailsHelpers);
  this.helpers(ViewHelpers);
  
  TorrentDetails(this);
  Torrents(this);
  Settings(this);
  Statistics(this);
  
  this.bind('flash', function(e, message) {
    $('#flash').html(message).show().delay(3000).fadeOut('slow');
  });
  
  this.bind('errors', function(e, errors) {
    this.showErrors(errors);
  });
  
  this.bind('init', function() {
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
  transmission.reloadInterval = 2000;
  if($(window).width() > 480) {
    transmission.run('#/torrents');    
  } else {
    transmission.run('#/torrents?view=compact');
  }
  transmission.trigger('init');
});
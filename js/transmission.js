var transmission = $.sammy(function() { with(this) {
  use(Sammy.TransmissionRPC);
  use(Sammy.Mustache);
  use(Sammy.Cache);
  
  element_selector = 'body';
  cache_partials = true;
  store = new Sammy.Store({name: 'data', type: ['local', 'cookie']});
  
  helpers(ApplicationHelpers);
  helpers(ContextMenuHelpers);
  helpers(FilterTorrentsHelpers);
  helpers(InfoHelpers);
  helpers(LinkHelpers);
  helpers(SearchHelpers);
  helpers(SettingHelpers);
  helpers(SortTorrentsHelpers);
  helpers(StatisticHelpers);
  helpers(StoreHelpers);
  helpers(TorrentHelpers);
  helpers(TorrentDetailsHelpers);
  helpers(ViewHelpers);
  
  TorrentDetails(this);
  Torrents(this);
  Settings(this);
  Statistics(this);
  
  bind('flash', function(e, message) { with(this) {
    $('#flash').html(message).show().delay(3000).fadeOut('slow');
  }});
  
  bind('errors', function(e, errors) { with(this) {
    this.showErrors(errors);
  }});
  
  bind('init', function() { with(this) {
    this.activateLinks();
    this.activateSearch(this);
    this.activateSortSelect(this);
    this.activateContextMenu();
    this.configureFacebox();
    this.closeInfo();
    this.hideContextMenu();
  }});
}});
 
$(function() {
  transmission.run('#/torrents');
  transmission.trigger('init');
});
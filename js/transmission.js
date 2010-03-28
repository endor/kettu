var transmission = new $.sammy(function() { with(this) {
  element_selector = 'body';
  cache_partials = true;
  use(Sammy.TransmissionRPC);
  use(Sammy.Mustache);
  use(Sammy.Cache);
  
  helpers(ApplicationHelpers);
  helpers(LinkHelpers);
  helpers(TorrentHelpers);
  helpers(SortTorrentsHelpers);
  helpers(FilterTorrentsHelpers);
  helpers(InfoHelpers);
  helpers(ViewHelpers);
  helpers(StoreHelpers);
  helpers(SettingHelpers);
  helpers(StatisticHelpers);
  
  Torrents(this);
  Settings(this);
  Statistics(this);
  
  bind('flash', function(e, message) { with(this) {
    this.showAndHideFlash(message);
  }});
  
  bind('errors', function(e, errors) { with(this) {
    this.showErrors(errors);
  }});
  
  bind('init', function() { with(this) {
    this.initializeStore();
    this.activateLinks();
    this.closeInfo();
  }});
}});
 
$(function() {
  transmission.run('#/torrents');
  transmission.trigger('init');
});
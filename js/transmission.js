var sammy = new Sammy.Application(function() { with(this) {
  element_selector = '#container';
  cache_partials = true;
  reload_interval = 2000;
  rpc = new RPC();
  use(Sammy.Mustache);
  use(Sammy.Cache);
  
  helpers(TorrentHelpers);
  helpers(InfoHelpers);
  helpers(ViewHelpers);
  helpers(SettingHelpers);
  
  Torrents(this);
  FilteredTorrents(this);
  Settings(this);
  
  bind('flash', function(e, message) { with(this) {
    this.showAndHideFlash(message);
  }});
  
  bind('init', function() { with(this) {
    this.updateSettings();
  }});
}});
 
$(function() {
  sammy.run('#/torrents');
  sammy.trigger('init');
});
var sammy = new Sammy.Application(function() { with(this) {
  element_selector = '#torrents';
  cache_partials = false;
  reload_interval = 2000;
  rpc = new RPC();
  use(Sammy.Mustache);
  use(Sammy.Cache);
  
  helpers(TorrentHelpers);
  helpers(TorrentInfoHelpers);
  helpers(ViewHelpers);
  
  Torrents(this);
  FilteredTorrents(this);
  
  get('#/', function() {});
}});
 
$(function() {
  sammy.run('#/torrents');
});
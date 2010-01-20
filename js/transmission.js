var sammy = new Sammy.Application(function() { with(this) {
  element_selector = '#torrents';
  cache_partials = false;
  reload_interval = 40000;
  rpc = new RPC();
  use(Sammy.Mustache);

  helpers(TorrentHelpers);
  
  Torrents(this);
  FilteredTorrents(this);
  
  before(function() {
    // before block
  });
  
  get('#/', function() {});
    
  bind('error', function(e, data) { with(this) {
    $('#error').html(data.message).show();
  }});
  
  bind('notice', function(e, data) { with(this) {
    $('#notice').html(data.message).show();
  }});
}});
 
$(function() {
  sammy.run('#/torrents');
 
  // without this hack cucumber/culerity doesn't recognize the changed hash
  $('a').live('click', function() {
    var hash = $(this).attr('href').match(/#.+/)[0];
    if(hash) {
      sammy.runRoute('get', hash);
    };
    return false;
  });
});
TorrentsView = function(torrents) {
  this.torrents = torrents;
  
  var view = {
    'torrents': this.torrents,
    'pauseAndActivateButton': function() {
      var torrent = Torrent(this);
      var options = torrent.isActive() ? ['torrent-stop', 'Pause', 'pause'] : ['torrent-start', 'Activate', 'activate'];
      cache_partial('./templates/torrents/pause_and_activate_button.mustache', 'pause_and_activate_button', this);
      return Mustache.to_html(this.cache('pause_and_activate_button'), {
        'id': torrent.id,
        'method': options[0],
        'button': options[1],
        'css_class': options[2]
      });
    }    
  };
  
  function cache_partial(template, partial, context) {
    if(!context.cache(partial)) {
      $.ajax({'async': false, 'url': template, 'success': function(response) {
        context.cache(partial, response);
      }});
    };    
  };
  
  return view;
}

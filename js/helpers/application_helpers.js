var ApplicationHelpers = {
  cache_partial: function(template, partial, context) {
    if(!context.cache(partial)) {
      $.ajax({'async': false, 'url': template, 'success': function(response) {
        context.cache(partial, response);
      }});
    };
  },
  
  configureFacebox: function() {
    $(document).bind('reveal.facebox', function() {
      $('#facebox form').submit(function() {
        $(document).trigger('close.facebox');
        return true;
      });
    });
  }
}
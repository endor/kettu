var ApplicationHelpers = {
  cache_partial: function(template, partial, context) {
    if(!context.cache(partial)) {
      $.ajax({'async': false, 'url': template, 'success': function(response) {
        context.cache(partial, response);
      }});
    };
  }
}
var ApplicationHelpers = {
  cache_partial: function(template, partial, context) {
    if(!context.cache(partial)) {
      $.ajax({async: false, url: template, success: function(response) {
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
    $(document).bind('afterClose.facebox', function() {
      $('#facebox').removeClass('graph');
    });
  },
  
  hash_diff: function(hash1, hash2) {
    var diff = {}, different = false;
    
    for(key in hash1) {
      if(hash1[key] != hash2[key]) {
        diff[key] = hash2[key];
        different = true;
      }
    }
    
    return different ? diff : false;
  }
}
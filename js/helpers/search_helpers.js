$.expr[":"].containsIgnoreCase = function(el, i, m) {
    var search = m[3];
    return search ? eval("/" + search + "/i").test($(el).text()) : false;
};

var SearchHelpers = {
  activateSearch: function() {
    $('#search').keyup(function() {
      var search_term = $(this).val();
      
      if(search_term.length > 0) {
        $('.torrent').hide();
        $('.torrent:containsIgnoreCase(' + search_term + ')').show();
        $(".torrent[data-tracker*='" + search_term + "']").show();
      } else {
        $('.torrent').show();
      }
    });
  }
}
$.expr[":"].containsIgnoreCase = function(el, i, m) {
    var search = m[3];
    return search ? eval("/" + search + "/i").test($(el).text()) : false;
};

kettu.SearchHelpers = {
  performSearch: function(search_term) {
    if(search_term.length > 0) {
      $('.torrent').hide();
      $('.torrent:containsIgnoreCase(' + search_term + ')').show();
      $(".torrent[data-tracker*='" + search_term + "']").show();
    } else {
      $('.torrent').show();
    }
  },

  activateSearch: function(context) {
    $('#search').keyup(function() {
      context.performSearch($(this).val());
    });
  }
};

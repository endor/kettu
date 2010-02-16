Statistics = function(transmission) { with(transmission) {
  get('#/statistics', function() {
    var context = this;    
    var request = {
      'method': 'session-stats',
      'arguments': {'fields': ['current-stats', 'torrentCount']}
    }
    
    rpc.query(request, function(response) {
      context.partial('./templates/statistics/index.mustache', StatisticsView(response), function(rendered_view) {
        context.openInfo(rendered_view);
        context.drawGraphs();
      });      
    });
  });
}};
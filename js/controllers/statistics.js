Statistics = function(transmission) {
  transmission.get('#/statistics', function(context) {
    var request = {
      method: 'session-stats',
      arguments: {fields: ['current-stats', 'torrentCount', 'cumulative-stats']}
    }
    
    context.remote_query(request, function(response) {
      context.partial('./templates/statistics/index.mustache', StatisticsView(response), function(rendered_view) {
        context.openInfo(rendered_view);
        context.activate_graph_links(context);
      });      
    });
  });
};
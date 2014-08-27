kettu.Statistics = function(transmission) {
  transmission.get('#/statistics', function(context) {
    var request = {
      method: 'session-stats',
      arguments: {fields: ['current-stats', 'torrentCount', 'cumulative-stats']}
    };

    context.remoteQuery(request, function(response) {
      context.render('templates/statistics/index.mustache', kettu.StatisticsView(response), function(rendered_view) {
        context.openInfo(rendered_view, 'statistics');
      });
    });
  });
};

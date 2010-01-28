Statistics = function(sammy) { with(sammy) {
  get('#/statistics', function() {
    var context = this;    
    var request = {
      'method': 'session-stats',
      'arguments': {'fields': ['current-stats', 'torrentCount']}
    }
    
    rpc.query(request, function(response) {

      var view = {
        'number_of_torrents': response['torrentCount'],
        'uploaded': Math.formatBytes(response['current-stats']['uploadedBytes']),
        'downloaded': Math.formatBytes(response['current-stats']['downloadedBytes']),
        'time_active': Math.formatSeconds(response['current-stats']['secondsActive'])
      }

      context.partial('./templates/statistics/index.mustache', view, function(rendered_view) {
        context.openInfo(rendered_view);
        context.drawPie('torrents_by_status', {
          'Downloading': ($('.downloading').length - 1),
          'Seeding': ($('.seeding').length - 1),
          'Paused': ($('.paused').length - 1)
        });
      });      
    });
  });
}};
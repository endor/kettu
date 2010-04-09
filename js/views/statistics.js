StatisticsView = function(statistics) {
  var view = {
    'number_of_torrents': statistics['torrentCount'],
    'uploaded': Math.formatBytes(statistics['current-stats']['uploadedBytes']),
    'uploaded_total': Math.formatBytes(statistics['cumulative-stats']['uploadedBytes']),
    'downloaded': Math.formatBytes(statistics['current-stats']['downloadedBytes']),
    'downloaded_total': Math.formatBytes(statistics['cumulative-stats']['downloadedBytes']),
    'time_active': Math.formatSeconds(statistics['current-stats']['secondsActive']),
    'time_active_total': Math.formatSeconds(statistics['cumulative-stats']['secondsActive'])
  }
  
  return view;
}
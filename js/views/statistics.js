StatisticsView = function(statistics) {
  var view = {
    'number_of_torrents': statistics['torrentCount'],
    'uploaded': Math.formatBytes(statistics['current-stats']['uploadedBytes']),
    'downloaded': Math.formatBytes(statistics['current-stats']['downloadedBytes']),
    'time_active': Math.formatSeconds(statistics['current-stats']['secondsActive'])
  }
  
  return view;
}
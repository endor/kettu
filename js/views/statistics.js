kettu.StatisticsView = function(statistics) {
  var view = {
    'number_of_torrents': statistics.torrentCount,
    'uploaded': Math.formatBytes(statistics['current-stats'].uploadedBytes),
    'uploaded_total': Math.formatBytes(statistics['cumulative-stats'].uploadedBytes),
    'downloaded': Math.formatBytes(statistics['current-stats'].downloadedBytes),
    'downloaded_total': Math.formatBytes(statistics['cumulative-stats'].downloadedBytes),
    'time_active': Math.formatSeconds(statistics['current-stats'].secondsActive),
    'time_active_total': Math.formatSeconds(statistics['cumulative-stats'].secondsActive)
  };

  if(statistics['current-stats'].downloadedBytes === 0) {
    view.ratio = statistics['current-stats'].uploadedBytes === 0 ? 'N/A' : 'Infinity';
  } else {
    view.ratio = (statistics['current-stats'].uploadedBytes / statistics['current-stats'].downloadedBytes).toPrecision(3);
  }

  if(statistics['cumulative-stats'].downloadedBytes === 0) {
    view.ratio_total = statistics['cumulative-stats'].uploadedBytes === 0 ? 'N/A' : 'Infinity';
  } else {
    view.ratio_total = (statistics['cumulative-stats'].uploadedBytes /
      statistics['cumulative-stats'].downloadedBytes).toPrecision(3);
  }

  return view;
};

var TorrentHelpers = {
  globalUpAndDownload: function(torrents) {
    var uploadRate = 0.0, downloadRate = 0.0;
    $.each(torrents, function() {
      uploadRate += this['rateUpload'];
      downloadRate += this['rateDownload'];
    });
    return Torrent({}).downAndUpLoadRateString(downloadRate, uploadRate);
  },
  
  numberOfTorrents: function(torrents) {
    var len = torrents.length, numberOfTorrents; 
    if(len > 0) {
      numberOfTorrents = len === 1 ? "1 torrent" : len + " torrents";
    } else {
      numberOfTorrents = "No torrents";
    }      
    return numberOfTorrents;
  },
    
  updateViewElements: function(torrents) {
    $('#globalUpAndDownload').html(this.globalUpAndDownload(torrents));
    $('#numberOfTorrents').html(this.numberOfTorrents(torrents));
    this.updateTorrentInfoElements();
    
    if(torrents.length > 0) {
      $('#filterbar').show();
    }
  }
};
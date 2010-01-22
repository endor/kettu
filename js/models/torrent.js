Torrent = function(attributes) {
  var torrent = {};

  torrent['fields'] = [
    'id', 'name', 'status', 'totalSize', 'sizeWhenDone', 'haveValid', 'leftUntilDone', 
    'eta', 'uploadedEver', 'uploadRatio', 'rateDownload', 'rateUpload'
  ];
  torrent['id'] = attributes['id'];
  torrent['name'] = attributes['name'];
  torrent['created_at'] = attributes.created_at || Date();
  torrent['status'] = attributes['status'];
  torrent['totalSize'] = attributes['totalSize'];
  torrent['sizeWhenDone'] = attributes['sizeWhenDone'];
  torrent['haveValid'] = attributes['haveValid'];
  torrent['leftUntilDone'] = attributes['leftUntilDone'];
  torrent['eta'] = attributes['eta'];
  torrent['uploadedEver'] = attributes['uploadedEver'];
  torrent['uploadRatio'] = attributes['uploadRatio'];
  torrent['rateDownload'] = attributes['rateDownload'];
  torrent['rateUpload'] = attributes['rateUpload'];

  torrent.isActive = function() {
    return (torrent.status & (torrent.stati['downloading'] | torrent.stati['seeding'])) > 0;
  };
  torrent.isDoneDownloading = function() {
    return torrent.status === torrent.stati['seeding'] || torrent.leftUntilDone === 0;
  };
  torrent.percentDone = function() {
    if(!torrent.sizeWhenDone) { return 0; }
    if(!torrent.leftUntilDone && torrent.leftUntilDone != 0) { return 0; }
    
    return Math.floor( ((this['sizeWhenDone'] - this['leftUntilDone']) / this['sizeWhenDone']) * 10000 ) / 100;
  };
  torrent.progressDetails = function() {
    var progressDetails = (!torrent.isDoneDownloading()) ? torrent.downloadingProgress() : torrent.uploadingProgress();
    if(!torrent.isDoneDownloading() && torrent.isActive()) {
      progressDetails += ' - ' + torrent.etaString();
    }
    return progressDetails;
  };
  torrent.downloadingProgress = function() {
    var formattedSizeDownloaded = Math.formatBytes(torrent.sizeWhenDone - torrent.leftUntilDone);
    var formattedSizeWhenDone = Math.formatBytes(torrent.sizeWhenDone);

    return (formattedSizeDownloaded + " of " + formattedSizeWhenDone + " (" + torrent.percentDone() + "%)");
  };
  torrent.uploadingProgress = function() {
    var formattedSizeWhenDone = Math.formatBytes(torrent.sizeWhenDone);
    var formattedUploadedEver = Math.formatBytes(torrent.uploadedEver);

    var uploadingProgress = formattedSizeWhenDone + " selected, uploaded " + formattedUploadedEver;
    return uploadingProgress + " (Ratio: " + torrent.uploadRatio + ")";
  };
  torrent.progressBar = function() {
    var progressBar = $("<div></div>").progressbar({value: torrent.percentDone()}).html()
    var status = torrent.isActive() ? 'active' : 'paused';
    return progressBar.replace(/ui-widget-header/, 'ui-widget-header-' + status);
  };
  torrent.etaString = function() {
    if(torrent.eta < 0) {
      return "remaining time unknown";
    } else {
      return Math.formatSeconds(torrent.eta) + ' ' + 'remaining';
    }
  };
  torrent.statusStringLocalized = function(status) {
    var localized_stati = {};
    
    localized_stati[torrent.stati['waiting_to_check']] = 'Waiting to verify';
    localized_stati[torrent.stati['checking']] = 'Verifying local data';
    localized_stati[torrent.stati['downloading']] = 'Downloading';
    localized_stati[torrent.stati['seeding']] = 'Seeding';
    localized_stati[torrent.stati['paused']] = 'Paused';

    return localized_stati[this['status']] ? localized_stati[this['status']] : 'error';
  };
  torrent.statusString = function() {
    var currentStatus = torrent.statusStringLocalized(torrent.status);
    if(torrent.isActive()) {
      currentStatus += ' - ' + torrent.downAndUpLoadRateString(torrent.rateDownload, torrent.rateUpload);
    }
    return currentStatus;
  };
  torrent.statusWord = function() {
    for(var i in torrent.stati) {
      if(torrent.stati[i] == torrent.status) {
        return i;
      }
    }
  }
  torrent.downAndUpLoadRateString = function(downloadRate, uploadRate) {
    return 'DL: ' + (downloadRate / 1000).toFixed(1) + ' KB/s, UL: ' + (uploadRate / 1000).toFixed(1) + ' KB/s';
  };
  torrent['stati'] = {
    'waiting_to_check': 1,
    'checking': 2,
    'downloading': 4,
    'seeding': 8,
    'paused': 16
  };
  
  return torrent;
};

Torrent = function(attributes) {
  var torrent = {};

  torrent['fields'] = [
    'id', 'name', 'status', 'totalSize', 'sizeWhenDone', 'haveValid', 'leftUntilDone', 
    'eta', 'uploadedEver', 'uploadRatio', 'rateDownload', 'rateUpload', 'metadataPercentComplete',
    'addedDate', 'trackerStats', 'error', 'errorString', 'recheckProgress', 'bandwidthPriority',
    'seedRatioMode', 'seedRatioLimit'
  ];
  torrent['info_fields'] = [
    'downloadDir', 'creator', 'hashString', 'comment', 'isPrivate', 'downloadedEver',
    'haveString', 'errorString', 'peersGettingFromUs', 'peersSendingToUs', 'files',
    'pieceCount', 'pieceSize', 'peers', 'fileStats', 'peer-limit', 'downloadLimited',
    'uploadLimit', 'uploadLimited', 'downloadLimit'
  ];
  $.each(torrent.fields, function() {
    torrent[this] = attributes[this];
  });
  $.each(torrent.info_fields, function() {
    torrent[this] = attributes[this];
  });
  $.each(['totalSize', 'downloadedEver', 'uploadedEver', 'pieceSize'], function() {
    var attr = this;
    torrent[attr + 'String'] = function() {
      return Math.formatBytes(torrent[attr]);
    }
  });
  
  torrent.secure = function() {
    return (torrent.isPrivate) ? 'Private Torrent' : 'Public Torrent';
  };
  torrent.isActive = function() {
    return (torrent.status & (torrent.stati['downloading'] | torrent.stati['seeding'])) > 0;
  };
  torrent.isDoneDownloading = function() {
    return torrent.status === torrent.stati['seeding'] || torrent.leftUntilDone === 0;
  };
  torrent.isVerifying = function() {
    return torrent.status == 1 || torrent.status == 2;
  };
  torrent.hasError = function() {
    return torrent.error > 0;
  };
  torrent.needsMetaData = function() { 
    return torrent.metadataPercentComplete < 1 
  };
  torrent.percentDone = function() {
    return Math.formatPercent(torrent.sizeWhenDone, torrent.leftUntilDone);
  };
  torrent.progressDetails = function() {
    var progressDetails;
    if(torrent.needsMetaData()) {
      progressDetails = torrent.metaDataProgress();
    } else if(!torrent.isDoneDownloading()) {
      progressDetails = torrent.downloadingProgress();
      if(torrent.isActive()) { progressDetails += ' - ' + torrent.etaString(); }
    } else {
      progressDetails = torrent.uploadingProgress();
      if(torrent.seedRatioMode == 1) { progressDetails += ' - ' + torrent.etaString(); }
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

    var uploadingProgress = formattedSizeWhenDone + ", uploaded " + formattedUploadedEver;
    return uploadingProgress + " (Ratio: " + ViewHelpers.sanitizeNumber(torrent.uploadRatio) + ")";
  };
  torrent.metaDataProgress = function() {
    var percentRetrieved = (Math.floor(torrent.metadataPercentComplete * 10000) / 100).toFixed(1);
    return "Magnetized transfer - retrieving metadata (" + percentRetrieved + "%)";
  };
  torrent.progressBar = function() {
    var status, progressBar, value = torrent.percentDone();
    
    if(torrent.isActive() && torrent.needsMetaData()) {
      status = 'meta';
      value = 100;
      progressBar = $("<div></div>").progressbar({value: value}).html();
    } else if(torrent.isVerifying()) {
      status = 'verifying';
      progressBar = $("<div></div>").progressbar({value: value}).html();      
    } else if(torrent.isActive() && !torrent.isDoneDownloading()) {
      status = 'downloading';
      progressBar = $("<div></div>").progressbar({value: value}).html();
    } else if(torrent.isActive() && torrent.isDoneDownloading()) {
      if(torrent.seedRatioMode == 1) { value = torrent.uploadRatio/torrent.seedRatioLimit * 100; }
      status = 'uploading';
      progressBar = $("<div></div>").progressbar({value: value}).html();      
    } else {
      status = 'paused';
      progressBar = $("<div></div>").progressbar({value: value}).html();
    }
    
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

    return localized_stati[this['status']] ? localized_stati[this['status']] : 'Error';
  };
  torrent.statusString = function() {
    var currentStatus = torrent.statusStringLocalized(torrent.status);
    if(torrent.isActive()) {
      currentStatus += ' - ';
      if(torrent.isDoneDownloading()) {
        currentStatus += torrent.uploadRateString(torrent.rateUpload);
      } else {
        currentStatus += torrent.downAndUploadRateString(torrent.rateDownload, torrent.rateUpload);
      }
    }
    if(torrent.hasError()) {
      currentStatus = 'Tracker returned an error: ' + torrent.errorString + '.';
    }
    if(torrent.isVerifying()) {
      currentStatus += ' - ' + (torrent.recheckProgress * 100).toFixed(2) + '%';
    }
    return currentStatus;
  };
  torrent.statusWord = function() {
    for(var i in torrent.stati) {
      if(torrent.stati[i] == torrent.status) { return i; }
    }
  };
  torrent.uploadRateString = function(uploadRate) {
    return 'UL: ' + (uploadRate / 1000).toFixed(1) + ' KB/s';
  };
  torrent.downAndUploadRateString = function(downloadRate, uploadRate) {
    return 'DL: ' + (downloadRate / 1000).toFixed(1) + ' KB/s, ' + torrent.uploadRateString(uploadRate);
  };
  torrent.activity = function() {
    return torrent.rateDownload + torrent.rateUpload;
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
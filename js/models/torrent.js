kettu.Torrent = function(attributes) {
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

  _.each(_.union(torrent.fields, torrent.info_fields), function(field) {
    torrent[field] = attributes[field];
  });

  _.each(['totalSize', 'downloadedEver', 'uploadedEver', 'pieceSize'], function(attr) {
    torrent[attr + 'String'] = function() {
      return Math.formatBytes(torrent[attr]);
    };
  });
  
  torrent.secure = function() {
    return torrent.isPrivate ? 'Private Torrent' : 'Public Torrent';
  };
  torrent.isActive = function() {
    return [torrent.stati['downloading'], torrent.stati['seeding']].indexOf(torrent.status) >= 0;
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
    return torrent.metadataPercentComplete < 1; 
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
    return uploadingProgress + " (Ratio: " + kettu.ViewHelpers.sanitizeNumber(torrent.uploadRatio) + ")";
  };
  torrent.metaDataProgress = function() {
    var percentRetrieved = (Math.floor(torrent.metadataPercentComplete * 10000) / 100).toFixed(1);
    return "Magnetized transfer - retrieving metadata (" + percentRetrieved + "%)";
  };
  torrent.progressBar = function() {
    var status, value = torrent.percentDone();
    
    if(torrent.isActive() && torrent.needsMetaData()) {
      status = 'meta';
      value = 100;
    } else if(torrent.isVerifying()) {
      status = 'verifying';
    } else if(torrent.isActive() && !torrent.isDoneDownloading()) {
      status = 'downloading';
    } else if(torrent.isActive() && torrent.isDoneDownloading()) {
      if(torrent.seedRatioMode == 1) { value = torrent.uploadRatio/torrent.seedRatioLimit * 100; }
      status = 'uploading';
    } else {
      status = 'paused';
    }
    
    // NOTE: creating the progressbar via $('<div></div>').progressbar({}); seems to lead to a memory leak in safari
    
    var progressBar = '<div class="ui-progressbar-value ui-widget-header-' + status + ' ui-corner-left" style="width: ' + value + '%; "></div>';

    return progressBar;
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
    
    localized_stati[torrent.stati['paused']] = 'Paused';
    localized_stati[torrent.stati['waiting_to_check']] = 'Waiting to verify';
    localized_stati[torrent.stati['checking']] = 'Verifying local data';
    localized_stati[torrent.stati['downloading']] = 'Downloading';
    localized_stati[torrent.stati['waiting_to_download']] = 'Waiting to download';
    localized_stati[torrent.stati['waiting_to_seed']] = 'Waiting to seed';
    localized_stati[torrent.stati['seeding']] = 'Seeding';

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
    'paused': 0,
    'waiting_to_check': 1,
    'checking': 2,
    'waiting_to_download': 3,
    'downloading': 4,
    'waiting_to_seed': 5,
    'seeding': 6
  };
	
  return torrent;
};
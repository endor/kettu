/*global kettu, _*/

(function() {
  var capitalize = function(string) {
    return _.map(string.split('_'), function(substr) {
      return substr.charAt(0).toUpperCase() + substr.slice(1);
    }).join('');
  };

  kettu.Torrent = function(attributes) {
    var torrent = {},
        stati = kettu.Torrent.stati,
        byteFields = ['totalSize', 'downloadedEver', 'uploadedEver',
          'pieceSize', 'corruptEver', 'sizeWhenDone'];

    _.each(_.union(kettu.Torrent.fields, kettu.Torrent.infoFields), function(field) {
      torrent[field] = attributes[field];

      if(byteFields.indexOf(field) >= 0) {
        torrent[field + 'String'] = function() {
          return Math.formatBytes(torrent[field]);
        };
      }
    });

    _.each(stati, function(status, name) {
      torrent['is' + capitalize(name)] = function() {
        return torrent.status == status;
      };
    });

    torrent.secure = function() {
      return torrent.isPrivate ? 'Private Torrent' : 'Public Torrent';
    };
    torrent.isActive = function() {
      return torrent.isDownloading() || torrent.isSeeding();
    };
    torrent.isDoneDownloading = function() {
      return torrent.isSeeding() || torrent.leftUntilDone === 0;
    };
    torrent.isVerifying = function() {
      return torrent.isChecking() || torrent.isWaitingToCheck();
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
      var formattedSizeDownloaded = Math.formatBytes(torrent.sizeWhenDone - torrent.leftUntilDone),
          formattedSizeWhenDone = Math.formatBytes(torrent.sizeWhenDone);

      return (formattedSizeDownloaded + " of " + formattedSizeWhenDone + " (" + torrent.percentDone() + "%)");
    };
    torrent.uploadingProgress = function() {
      var formattedSizeWhenDone = Math.formatBytes(torrent.sizeWhenDone),
          formattedUploadedEver = Math.formatBytes(torrent.uploadedEver),
          uploadingProgress = formattedSizeWhenDone + ", uploaded " + formattedUploadedEver;

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

      localized_stati[stati['paused']] = 'Paused';
      localized_stati[stati['waiting_to_check']] = 'Waiting to verify';
      localized_stati[stati['checking']] = 'Verifying local data';
      localized_stati[stati['downloading']] = 'Downloading';
      localized_stati[stati['waiting_to_download']] = 'Waiting to download';
      localized_stati[stati['waiting_to_seed']] = 'Waiting to seed';
      localized_stati[stati['seeding']] = 'Seeding';

      return localized_stati[this['status']] ? localized_stati[this['status']] : 'Unknown status';
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
      if(kettu.app.mobile && currentStatus.match(/ - /)) {
        currentStatus = currentStatus.split(' - ')[1];
      }
      return currentStatus;
    };
    torrent.statusWord = function() {
      for(var i in stati) {
        if(stati[i] == torrent.status) { return i; }
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
    torrent.haveString = function() {
      return Math.formatBytes(torrent.haveValid + torrent.haveUnchecked) +
        ' (' + Math.formatBytes(torrent.haveValid) + ' verified)';
    };

    return torrent;
  };

  kettu.Torrent.stati = {
    'paused': 0,
    'waiting_to_check': 1,
    'checking': 2,
    'waiting_to_download': 3,
    'downloading': 4,
    'waiting_to_seed': 5,
    'seeding': 6
  };

  kettu.Torrent.fields = [
    'id', 'name', 'status', 'totalSize', 'sizeWhenDone', 'haveValid', 'leftUntilDone', 'haveUnchecked',
    'eta', 'uploadedEver', 'uploadRatio', 'rateDownload', 'rateUpload', 'metadataPercentComplete',
    'addedDate', 'trackerStats', 'error', 'errorString', 'recheckProgress', 'bandwidthPriority',
    'seedRatioMode', 'seedRatioLimit'
  ];

  kettu.Torrent.infoFields = [
    'downloadDir', 'creator', 'hashString', 'comment', 'isPrivate', 'downloadedEver',
    'errorString', 'peersGettingFromUs', 'peersSendingToUs', 'files', 'pieceCount',
    'pieceSize', 'peers', 'fileStats', 'peer-limit', 'downloadLimited',
    'uploadLimit', 'uploadLimited', 'downloadLimit', 'corruptEver'
  ];
})();

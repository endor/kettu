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
        return torrent.status === status;
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

    torrent.isFinished = function() {
      return !torrent.needsMetaData() && torrent.isDoneDownloading() && torrent.isPaused();
    };

    torrent.hasError = function() {
      return torrent.error > 0;
    };

    torrent.hasTrackerError = function() {
      return torrent.error > 0 && torrent.error < 3;
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
        if(torrent.isActive()) {
          if(torrent.seedRatioMode === 1 ||
            (torrent.seedRatioMode === 0 && kettu.app.settings.seedRatioLimited)) {
              progressDetails += ' - ' + torrent.etaString();
            }
        }
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
          uploadingProgress = "Downloaded " + formattedSizeWhenDone + ", uploaded " + formattedUploadedEver,
          formattedUploadRatio;

      if (torrent.uploadRatio > 0 && torrent.uploadRatio < 0.1) {
        formattedUploadRatio = torrent.uploadRatio.toFixed(3);
      } else if (torrent.uploadRatio >= 0) {
        formattedUploadRatio = torrent.uploadRatio.toPrecision(3);
      } else {
        formattedUploadRatio = kettu.ViewHelpers.sanitizeNumber(torrent.uploadRatio);
      }
      return uploadingProgress + " (Ratio: " + formattedUploadRatio + ")";
    };

    torrent.metaDataProgress = function() {
      var percentRetrieved = (torrent.metadataPercentComplete * 100).toFixed(1);
      return "Magnetized transfer - retrieving metadata (" + percentRetrieved + "%)";
    };

    torrent.progressBar = function() {
      var status = torrent.statusWord(),
        value = torrent.percentDone();

      if(status === 'meta') {
        value = torrent.metadataPercentComplete * 100;
      } else if(status === 'seeding' || status === 'finished') {
        if(torrent.seedRatioMode === 0) {
          if(kettu.app.settings.seedRatioLimited) {
            value = torrent.uploadRatio/kettu.app.settings.seedRatioLimit * 100;
          }
        } else if(torrent.seedRatioMode === 1) {
          value = torrent.uploadRatio/torrent.seedRatioLimit * 100;
        }
      } else if(status === 'verifying') {
        value = torrent.recheckProgress * 100;
      }

      // value can be greater than 100 e.g. if the torrent has an
      // upload ratio greater than the limit
      if(value > 100) { value = 100; }

      // NOTE: creating the progressbar via $('<div></div>').progressbar({});
      // seems to lead to a memory leak in safari
      var progressBar = '<div class="ui-progressbar-value ui-widget-header-' + status + ' ui-corner-all" style="width: ' + value + '%; "></div>';

      return progressBar;
    };

    torrent.etaString = function() {
      if(torrent.eta < 0) {
        return "remaining time unknown";
      } else {
        return Math.formatSeconds(torrent.eta) + ' remaining';
      }
    };

    torrent.statusStringLocalized = function(status) {
      var localized_stati = {};

      localized_stati[stati.paused] = 'Paused';
      localized_stati[stati.waiting_to_check] = 'Waiting to verify';
      localized_stati[stati.checking] = 'Verifying local data';
      localized_stati[stati.downloading] = 'Downloading';
      localized_stati[stati.waiting_to_download] = 'Waiting to download';
      localized_stati[stati.waiting_to_seed] = 'Waiting to seed';
      localized_stati[stati.seeding] = 'Seeding';

      return localized_stati[status] ? localized_stati[status] : 'Unknown status';
    };

    torrent.statusString = function() {
      var currentStatus = torrent.statusStringLocalized(torrent.status);
      if(torrent.isActive() && !torrent.needsMetaData()) {
        currentStatus += ' - ';
        if(torrent.isDoneDownloading()) {
          currentStatus += torrent.uploadRateString(torrent.rateUpload);
        } else {
          currentStatus += torrent.downAndUploadRateString(torrent.rateDownload, torrent.rateUpload);
        }
      } else if (torrent.isFinished()) {
        currentStatus = 'Finished';
      }
      if(torrent.hasError()) {
        currentStatus = torrent.errorString + '.';
        if(torrent.hasTrackerError()) { currentStatus = 'Tracker returned error: ' + currentStatus; }
      }
      if(torrent.isVerifying()) {
        currentStatus += ' - ' + (torrent.recheckProgress * 100).toFixed(2) + '% verified';
        if(kettu.app.mobile && currentStatus.match(/ - /)) {
          currentStatus = currentStatus.split(' - ')[1];
        }
      }
      return currentStatus;
    };

    torrent.statusWord = function() {
      if(torrent.isActive() && torrent.needsMetaData()) {
        return 'meta';
      } else if(torrent.isVerifying()) {
        return 'verifying';
      } else if(torrent.isDownloading()) {
        return 'downloading';
      } else if(torrent.isSeeding()) {
        return 'seeding';
      } else if(torrent.isFinished()) {
        return 'finished';
      } else {
        return 'paused';
      }
    };

    torrent.uploadRateString = function(uploadRate) {
      return 'UL: ' + Math.formatBytes(uploadRate) + '/s';
    };

    torrent.downAndUploadRateString = function(downloadRate, uploadRate) {
      return 'DL: ' + Math.formatBytes(downloadRate) + '/s, ' + torrent.uploadRateString(uploadRate);
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

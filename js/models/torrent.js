Torrent = function(attributes) {
  var torrent = {};

  torrent['fields'] = [
    'id', 'name', 'status', 'totalSize', 'sizeWhenDone', 'haveValid', 'leftUntilDone', 
    'eta', 'uploadedEver', 'uploadRatio', 'rateDownload', 'rateUpload'
  ];
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

  torrent.id = function() {
    return this['name'].toLowerCase().replace(/\W+/g, '_');
  };
  torrent.percentDone = function() {
    if(!this['sizeWhenDone']) { return 0; }
    if(!this['leftUntilDone'] && this['leftUntilDone'] != 0) { return 0; }
    
    return Math.floor( ((this['sizeWhenDone'] - this['leftUntilDone']) / this['sizeWhenDone']) * 10000 ) / 100;
  };
  torrent.progressDetails = function() {
    var progressDetails = (!this.isDoneDownloading()) ? this.downloadingProgress() : this.uploadingProgress();
    if(!this.isDoneDownloading() && this.isActive()) {
      progressDetails += ' - ' + this.etaString();
    }
    return progressDetails;
  };
  torrent.downloadingProgress = function() {
    var formattedSizeDownloaded = Math.formatBytes(this['sizeWhenDone'] - this['leftUntilDone']);
    var formattedSizeWhenDone = Math.formatBytes(this['sizeWhenDone']);

    return (formattedSizeDownloaded + " of " + formattedSizeWhenDone + " (" + this.percentDone() + "%)");
  };
  torrent.uploadingProgress = function() {
    var formattedSizeWhenDone = Math.formatBytes(this['sizeWhenDone']);
    var formattedUploadedEver = Math.formatBytes(this['uploadedEver']);

    var uploadingProgress = formattedSizeWhenDone + " selected, uploaded " + formattedUploadedEver;
    return uploadingProgress + " (Ratio: " + this['uploadRatio'] + ")";
  };
  torrent.progressBar = function() {
    return $("<div></div>").progressbar({value: this.percentDone()}).html();
  };
  torrent.etaString = function() {
    if(this['eta'] < 0) {
      return "remaining time unknown";
    } else {
      return Math.formatSeconds(this['eta']) + ' ' + 'remaining';
    }
  };
  torrent.isActive = function() {
    return (this['status'] & (this.stati['downloading'] | this.stati['seeding'])) > 0;
  };
  torrent.isDoneDownloading = function() {
    return this['status'] === this.stati['seeding'] || this['leftUntilDone'] === 0;
  };
  torrent.statusStringLocalized = function(status) {
    var localized_stati = {};
    
    localized_stati[this.stati['waiting_to_check']] = 'Waiting to verify';
    localized_stati[this.stati['checking']] = 'Verifying local data';
    localized_stati[this.stati['downloading']] = 'Downloading';
    localized_stati[this.stati['seeding']] = 'Seeding';
    localized_stati[this.stati['paused']] = 'Paused';

    return localized_stati[this['status']] ? localized_stati[this['status']] : 'error';
  };
  torrent.statusString = function() {
    var currentStatus = this.statusStringLocalized(this['status']);
    if(this.isActive()) {
      currentStatus += ' - ' + this.downAndUpLoadRateString(this['rateDownload'], this['rateUpload']);
    }
    return currentStatus;
  };
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

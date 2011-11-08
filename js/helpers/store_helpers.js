kettu.StoreHelpers = {
  addUpAndDownToStore: function(torrents) {
    var data, rates = _.reduce(torrents, function(rates, torrent) {
      rates.upload += torrent.rateUpload;
      rates.download += torrent.rateDownload;
      return rates;
    }, {upload: 0.0, download: 0.0});

    if(this.store.exists('up_and_download_rate')) {
      var store_data = this.store.get('up_and_download_rate');
      if(store_data.length > 99) { store_data.shift(); }
      store_data.push({"up": rates.upload, "down": rates.download});
      data = store_data;
    } else {
      data = [{"up": rates.upload, "down": rates.download}];
    }

    this.store.set('up_and_download_rate', data);
  }
};


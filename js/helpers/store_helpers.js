kettu.StoreHelpers = {
  addUpAndDownToStore: function(torrents) {
    var uploadRate = 0.0, downloadRate = 0.0;
    $.each(torrents, function() {
      uploadRate += this.rateUpload;
      downloadRate += this.rateDownload;
    });

    if(this.store.exists('up_and_download_rate')) {
      store_data = this.store.get('up_and_download_rate');
      if(store_data.length > 99) { store_data.shift(); }
      store_data.push({"up": uploadRate, "down": downloadRate});
      data = store_data;
    } else {
      data = [{"up": uploadRate, "down": downloadRate}];
    }

    this.store.set('up_and_download_rate', data);
  }
};


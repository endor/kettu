kettu.StoreHelpers = {
  addUpAndDownToStore: function(torrents) {
    var uploadRate = 0.0, downloadRate = 0.0;
    $.each(torrents, function() {
      uploadRate += this.rateUpload;
      downloadRate += this.rateDownload;
    });

    if(kettu.app.store.exists('up_and_download_rate')) {
      store_data = kettu.app.store.get('up_and_download_rate');
      if(store_data.length > 99) { store_data.shift(); }
      store_data.push({"up": uploadRate, "down": downloadRate});
      data = store_data;
    } else {
      data = [{"up": uploadRate, "down": downloadRate}];
    }

    kettu.app.store.set('up_and_download_rate', data);
  }
};


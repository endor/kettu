var StoreHelpers = {
  addUpAndDownToStore: function(data) {
    if(transmission.store.exists('up_and_download_rate')) {
      store_data = transmission.store.get('up_and_download_rate');
      if(store_data.length > 29) {
        store_data.shift();
      }
      store_data.push(data);
      data = store_data;
    } else {
      data = [data];
    }
    transmission.store.set('up_and_download_rate', data);
  }
};


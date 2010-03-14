var StoreHelpers = {
  initializeStore: function() {
    transmission.store = new Sammy.Store({name: 'data', type: 'local'});
    if(!transmission.store.isAvailable()) {
      transmission.store = new Sammy.Store({name: 'data', type: 'cookie'});
    }
  },
  
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


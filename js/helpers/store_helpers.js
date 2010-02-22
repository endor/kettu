var StoreHelpers = {
  initializeStore: function() {
    transmission.store = new Sammy.Store({name: 'data', type: 'local'});
    if(!transmission.store.isAvailable()) {
      transmission.store = new Sammy.Store({name: 'data', type: 'cookie'});
    }
  }
};


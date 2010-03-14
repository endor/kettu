describe 'StoreHelpers'
  before_each
    store_helpers = StoreHelpers
  end

  describe 'addUpAndDownToStore'
    before_each
      transmission = {}
      transmission.store = {"set": function() {}, "get": function() {}}
    end
  
    it 'should store the global up and download'
      stub(transmission.store, 'exists').and_return(false)
      transmission.store.should.receive("set").with_args('up_and_download_rate', [{"up": 20, "down": 10}])
      store_helpers.addUpAndDownToStore({"up": 20, "down": 10})
    end
  
    it 'should add to the global up and download if it already exists'
      stub(transmission.store, 'exists').and_return(true)
      transmission.store.get = function() { return [{"up": 20, "down": 10}]; }
      transmission.store.should.receive("set").with_args('up_and_download_rate', [{"up": 20, "down": 10}, {"up": 10, "down": 5}])
      store_helpers.addUpAndDownToStore({"up": 10, "down": 5})
    end
  
    it 'should remove an item if there are more than 30'
      stub(transmission.store, 'exists').and_return(true)
      items = []
      for(var i = 0; i < 30; i += 1) {
        items.push({"up": 10, "down": 20})
      }
      transmission.store.get = function() { return items; }
      items.should.receive("shift")
      store_helpers.addUpAndDownToStore({"up": 10, "down": 5})
    end
  end
end
describe 'ApplicationHelpers'
  before_each
    application_helpers = ApplicationHelpers;
  end
  
  describe 'hash_diff'
    it 'should return the differences between two hashes'
      differences = application_helpers.hash_diff({a: 1, b: 'string', c: false}, {a: 2, b: 'blub', c: true})
      differences['a'].should.eql(2)
      differences['b'].should.eql('blub')
      differences['c'].should.be_true
    end
    
    it 'should return an empty hash if there are no differences'
      application_helpers.hash_diff({a: 1, b: 'string', c: false}, {a: 1, b: 'string', c: false}).should.be_false
    end
  end
end
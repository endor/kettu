describe 'Validator'
  before_each
    validator = new kettu.Validator()
  end
  
  it 'should have no errors on a valid object'
    torrent = {'name': 'coffee', 'totalSize': 160, 'status': 8, 'rateUpload': 20}
    validator.schema = {
      'presence_of': ['name', 'status'],
      'numericality_of': ['totalSize', {'field': 'rateUpload', 'max': 20}],
      'inclusion_of': {'field': 'status', 'in': [1, 2, 4, 8, 16]}
    }
    validator.validate(torrent)
    validator.errors.should.be_empty
  end
  
  it 'should validate the presence of a single field'
    torrent = {}
    validator.schema = {
      'presence_of': 'name'
    }
    validator.validate(torrent)
    validator.errors[0]['field'].should.eql('name')
    validator.errors[0]['message'].should.eql('should not be empty')
  end
  
  it 'should validate the presence of multiple fields'
    torrent = {}
    validator.schema = {
      'presence_of': ['name', 'status']
    }
    validator.validate(torrent)
    validator.errors[0]['field'].should.eql('name')
    validator.errors[1]['field'].should.eql('status')
  end
  
  it 'should validate the numericality of a field'
    torrent = {'totalSize': 'abc'}
    validator.schema = {
      'numericality_of': 'totalSize'
    }
    validator.validate(torrent)
    validator.errors[0]['field'].should.eql('totalSize')
    validator.errors[0]['message'].should.eql('is not a valid number')
  end
  
  it 'should validate the max value of a numeric field'
    torrent = {'totalSize': 100}
    validator.schema = {
      'numericality_of': {'field': 'totalSize', 'max': 99}
    }
    validator.validate(torrent)
    validator.errors[0]['field'].should.eql('totalSize')
    validator.errors[0]['message'].should.eql('is not a valid number')    
  end
  
  it 'should validate the numericality of multiple fields'
    torrent = {'totalSize': 'abc', 'status': 'def'}
    validator.schema = {
      'numericality_of': ['totalSize', 'status']
    }
    validator.validate(torrent)
    validator.errors[0]['field'].should.eql('totalSize')
    validator.errors[1]['field'].should.eql('status')
  end
  
  it 'should validate the numericality of a missing field and throw an error'
    torrent = {}
    validator.schema = {
      'numericality_of': 'totalSize'
    }
    validator.validate(torrent)
    validator.errors[0]['field'].should.eql('totalSize')
    validator.errors[0]['message'].should.eql('is not a valid number')    
  end

  it 'should validate the numericality of null and throw an error'
    torrent = {'totalSize': null}
    validator.schema = {
      'numericality_of': 'totalSize'
    }
    validator.validate(torrent)
    validator.errors[0]['field'].should.eql('totalSize')
    validator.errors[0]['message'].should.eql('is not a valid number')    
  end
  
  it 'should validate the inclusion of a field'
    torrent = {'encryption': 'strong'}
    validator.schema = {
      'inclusion_of': {'field': 'encryption', 'in': ['required', 'preferred', 'tolerated']}
    }
    validator.validate(torrent)
    validator.errors[0]['field'].should.eql('encryption')
    validator.errors[0]['message'].should.eql('is not in the list of a valid values')
  end
end
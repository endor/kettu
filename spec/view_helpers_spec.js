describe 'ViewHelpers'
  before_each
    view_helpers = ViewHelpers
  end

  describe 'sanitizeNumber'  
    it 'should return 0 if ratio is 0'
      view_helpers.sanitizeNumber(0).should.eql(0)
    end
    
    it 'should return the number if ratio is bigger than 0'
      view_helpers.sanitizeNumber(2.2).should.eql(2.2)
    end
    
    it 'should return N/A if ratio is -1'
      view_helpers.sanitizeNumber(-1).should.eql('N/A')
    end
    
    it 'should return Infinity if ratio is -2'
      view_helpers.sanitizeNumber(-2).should.eql('Infinity')
    end
  end
end
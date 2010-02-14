describe 'SettingHelpers'
  before_each
    $('body').append(elements(fixture('settings')).get(0));
    setting_helpers = SettingHelpers;
  end
  
  after_each
    $('body #info').remove();
  end
  
  describe 'updateSettingsCheckboxes'
    it 'should add a checked="checked" to checkboxes if setting is enabled'
      settings = {'pex-enabled': true, 'dht-enabled': true};
      setting_helpers.updateSettingsCheckboxes(settings);
      $('input[type=checkbox]:checked').length.should.eql(2);
    end
    
    it 'should not add a checked="checked" to checkboxes if setting is disabled'
      settings = {'pex-enabled': false, 'dht-enabled': true};
      setting_helpers.updateSettingsCheckboxes(settings);
      $('input[type=checkbox]:checked').length.should.eql(1);
    end
  end
  
  describe 'turtle_mode_hash'
    it 'should return a hash with alt-speed-enabled set to true if given parameter is string true'
      setting_helpers.turtle_mode_hash("true")['alt-speed-enabled'].should.be_true;
    end
    
    it 'should return a hash with alt-speed-enabled set to false if given parameter is string false'
      setting_helpers.turtle_mode_hash("false")['alt-speed-enabled'].should.be_false;
    end    
  end
  
  describe 'arguments_hash'
    before_each
      updatable_settings = ['dht-enabled', 'pex-enabled', 'download-dir', 'peer-port'];
      params = {'dht-enabled': 'on', 'download-dir': '/downloads', 'peer-port': '5327'};
    end
    
    it 'should set setting to false if it\'s not in the parameters'
      hash = setting_helpers.arguments_hash(updatable_settings, params);
      hash['pex-enabled'].should.be_false;
    end
    
    it 'should set setting to true if it\'s "on"'
      hash = setting_helpers.arguments_hash(updatable_settings, params);
      hash['dht-enabled'].should.be_true;
    end
    
    it 'should set setting to a number if parameter is a string with only a number in it'
      hash = setting_helpers.arguments_hash(updatable_settings, params);
      hash['peer-port'].should.eql(5327);
    end
    
    it 'should set setting to a string if it is a string'
      hash = setting_helpers.arguments_hash(updatable_settings, params);
      hash['download-dir'].should.eql('/downloads');
    end
  end
end
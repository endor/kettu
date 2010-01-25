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
end
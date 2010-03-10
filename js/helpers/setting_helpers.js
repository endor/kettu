var SettingHelpers = {
  validator: new SettingsValidator(),
  
  updateSettingsCheckboxes: function(settings) {
    $.each($('#info').find('input[type=checkbox]'), function() {
      var name = $(this).attr('name');
      if(settings[name]) {
        $(this).attr('checked', 'checked');
      }
    });
    $('#info input').change(function(event) {
      $(this).parents('form').trigger('submit');
      return false;
    });
  },
  
  updateSettingsSelects: function(settings) {
    $.each($('#info').find('select'), function() {
      var name = $(this).attr('name');
      var value = settings[name];
      $.each($(this).find('option'), function() {
        if($(this).val() == value) {
          $(this).attr('selected', 'selected');
        } 
      });
    });
  },

  setting_arguments_valid: function(context, setting_arguments) {
    context.validator.validate(setting_arguments);
    return ! context.validator.has_errors();
  },
  
  setting_arguments_errors: function(context) {
    return context.validator.errors;
  },
  
  prepare_arguments: function(context, params) {
    if(params['alt-speed-enabled']) {
      return context.turtle_mode_hash(params['alt-speed-enabled']);
    } else {
      return context.arguments_hash(updatable_settings, params);
    }
  },
  
  turtle_mode_hash: function(turtle_mode) {
    return {'alt-speed-enabled': (turtle_mode == "true") ? true : false};
  },
  
  arguments_hash: function(updatable_settings, params) {
    var hash = {};

    $.each(updatable_settings, function() {
      var setting = this;
      hash[setting] = params[setting] ? true : false;
      if(params[setting] && params[setting].match(/^\d+$/)) {
        hash[setting] = parseInt(params[setting], 10);
      } else if(params[setting] && params[setting] != "on") {
        hash[setting] = params[setting];
      }
    });
    
    return hash;
  },
  
  update_reload_interval: function(context, new_reload_interval) {
    new_reload_interval = parseInt(new_reload_interval, 10);
    if(new_reload_interval != (transmission.reload_interval/1000)) {
      transmission.reload_interval = new_reload_interval * 1000;
      clearInterval(transmission.interval_id);
      context.closeInfo();
    }
  }
};
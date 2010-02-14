var SettingHelpers = {
  activateSettingsLink: function() {
    var context = this;
    $('#settings').click(function() {
      if(context.infoIsOpen()) {
        context.closeInfo();
      } else {
        context.redirect('#/settings');
      }
      return false;
    });
  },
  
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
  
  prepare_arguments: function(context, params) {
    if(params['alt-speed-enabled']) {
      return context.turtle_mode_hash(params['alt-speed-enabled']);
    } else {
      return context.arguments_hash(updatable_settings, params);
    };
  },
  
  turtle_mode_hash: function(turtle_mode) {
    return {'alt-speed-enabled': (turtle_mode == "true") ? true : false};
  },
  
  arguments_hash: function(updatable_settings, params) {
    var hash = {};

    $.each(updatable_settings, function() {
      var setting = this;
      hash[setting] = (params[setting]) ? true : false;
      if(params[setting] && params[setting].match(/^\d+$/)) {
        hash[setting] = parseInt(params[setting]);
      } else if(params[setting] && params[setting] != "on") {
        hash[setting] = params[setting];
      }
    });
    
    return hash;
  },
  
  update_reload_interval: function(context, new_reload_interval) {
    new_reload_interval = parseInt(new_reload_interval);
    if(new_reload_interval != (sammy.reload_interval/1000)) {
      sammy.reload_interval = new_reload_interval * 1000;
      clearInterval(sammy.interval_id);
      context.closeInfo();
    }
  }
  
}
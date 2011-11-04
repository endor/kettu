kettu.Settings = function(transmission) {
  var original_settings;
  
  transmission.get('#/settings', function(context) {
    original_settings = kettu.app.settings || {};
    
    var hours_partial = 'templates/settings/hours.mustache',
        minutes_partial = 'templates/settings/minutes.mustache';
    
    context.render('templates/settings/index.mustache', original_settings, function(rendered_view) {
      context.openInfo(rendered_view);      
      kettu.app.trigger('settings-refreshed');
    }, {hours: hours_partial, minutes: minutes_partial});
  });
  
  updateSettings = function(context) {
    var differences = context.hash_diff(original_settings, kettu.app.settings || {}) || [];

    for(var difference in differences) {
      if(typeof differences[difference] === 'boolean') {
        $('.' + difference).attr('checked', differences[difference]);
      } else {
        $('.' + difference).val(differences[difference]);
      }
    }

    original_settings = kettu.app.settings;
  };
  
  transmission.put('#/settings', function(context) {
    var request = { method: 'session-set', arguments: this.prepare_arguments(context, this.params) };

    this.manage_handlers(context, this.params);
    
    if(this.is_speed_limit_mode_update(request['arguments']) || this.setting_arguments_valid(context, request['arguments'])) {
      context.remote_query(request, function(response) {
        kettu.app.trigger('flash', context.params.settingsFlash);
        if(context.params['peer-port']) { updatePeerPortDiv(context); }
      });      
    } else {
      kettu.app.trigger('flash', 'Settings could not be updated.');
      kettu.app.trigger('errors', this.setting_arguments_errors(context));
    }
  });

  updatePeerPortDiv = function(context) {
    $('#port-open').addClass('waiting').show();
    var request = { 'method': 'port-test', 'arguments': {} };
    context.remote_query(request, function(response) {
      $('#port-open').removeClass('waiting');
      if(response['port-is-open']) {
        $('#port-open').addClass('active');
      } else {
        $('#port-open').removeClass('active');
      }
    });
  };
  
  transmission.bind('settings-refreshed', function() {
    this.updateSettingsCheckboxes(original_settings);
    this.updateSettingsSelects(original_settings);
    this.menuizeInfo();
    
    if(this.update_settings_interval_id) { clearInterval(this.update_settings_interval_id); }
    this.update_settings_interval_id = setInterval(updateSettings, (kettu.app.reloadInterval * 2), this);
  });
};
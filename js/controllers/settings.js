Settings = function(transmission) {
  var original_settings;
  
  transmission.get('#/settings', function(context) {
    var request = { method: 'session-get', arguments: {} };

    original_settings = transmission.settings || {};
    original_settings['reload-interval'] = context.reload_interval/1000;
    
    context.render('templates/settings/index.mustache', original_settings, function(rendered_view) {
      context.openInfo(rendered_view);
      transmission.trigger('settings-refreshed');
    });
  });
  
  updateSettings = function() {
    // TODO: there has to be a nicer way than transmission.context_prototype.prototype
    var request = { method: 'session-get', arguments: {} },
      differences = transmission.context_prototype.prototype.hash_diff(original_settings, transmission.settings || {}) || [];

    for(difference in differences) {
      if(typeof(differences[difference]) == 'boolean') {
        $('.' + difference).attr('checked', differences[difference]);
      } else {
        $('.' + difference).val(differences[difference]);
      }
    }
    original_settings = transmission.settings;
  }
  
  transmission.put('#/settings', function(context) {
    var request = { method: 'session-set', arguments: this.prepare_arguments(context, this.params) };

    this.manage_handlers(context, this.params);
    
    if(this.is_speed_limit_mode_update(request['arguments']) || this.setting_arguments_valid(context, $.extend(request['arguments'], {'reload-interval': this.params['reload-interval']}))) {
      delete(request['arguments']['reload-interval']);
      context.remote_query(request, function(response) {
        transmission.trigger('flash', 'Settings updated successfully.');
        if(context.params['peer-port']) { updatePeerPortDiv(context); }
        if(context.params['reload-interval']) { context.update_reload_interval(context, context.params['reload-interval']); }
      });      
    } else {
      transmission.trigger('flash', 'Settings could not be updated.');
      transmission.trigger('errors', this.setting_arguments_errors(context));
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
    this.update_settings_interval_id = setInterval('updateSettings()', (this.reload_interval * 2));
  });
};
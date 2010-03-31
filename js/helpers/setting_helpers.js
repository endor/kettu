var SettingHelpers = {
  validator: new SettingsValidator(),
  
  updateSettingsCheckboxes: function(settings) {
    $.each($('#info').find('input[type=checkbox]'), function() {
      var checkbox = $(this);
      var name = checkbox.attr('name');
      if(settings[name]) {
        checkbox.attr('checked', 'checked');
      }
      $.each(['protocol-handler-enabled', 'content-handler-enabled'], function() {
        if(name == this && transmission.store.exists(this)) {
          checkbox.attr('disabled', 'disabled');
          checkbox.attr('checked', 'checked');
        }
      });
    });
    
    $('#info input').change(function(event) {
      if($(this).attr('name') == 'protocol-handler-enabled' || $(this).attr('name') == 'content-handler-enabled') {
        $(this).attr('disabled', 'disabled');
        $(this).attr('checked', 'checked');
      }
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
  
  is_turtle_mode_update: function(params) {
    return (params['alt-speed-enabled'] !== undefined);
  },
  
  prepare_arguments: function(context, params) {    
    if(params['alt-speed-enabled']) {
      transmission.store.set('turtle_mode', (params['alt-speed-enabled'] == "true") ? 'enabled' : 'disabled');
      return context.turtle_mode_hash(params['alt-speed-enabled']);
    } else {
      return context.arguments_hash(params);
    }
  },
  
  turtle_mode_hash: function(turtle_mode) {
    return {'alt-speed-enabled': (turtle_mode == "true") ? true : false};
  },
  
  arguments_hash: function(params, updatable_settings) {
    updatable_settings = updatable_settings || [
      'dht-enabled', 'pex-enabled', 'speed-limit-up', 'speed-limit-up-enabled', 'speed-limit-down',
      'speed-limit-down-enabled', 'peer-port', 'download-dir', 'alt-speed-down', 'alt-speed-up',
      'encryption'
    ];
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
  },
  
  manage_handlers: function(context, params) {
    if(params['protocol-handler-enabled'] && !transmission.store.exists('protocol-handler-enabled')) {
      transmission.store.set('protocol-handler-enabled', true);
      window.navigator.registerProtocolHandler('magnet', context.base_url() + '#/torrents/add?url=%s', "Transmission Web");
    }
    
    if(params['content-handler-enabled'] && !transmission.store.exists('content-handler-enabled')) {
      transmission.store.set('content-handler-enabled', true);
      window.navigator.registerContentHandler("application/x-bittorrent", context.base_url() + '#/torrents/add?url=%s', "Transmission Web");
    }
  },
  
  base_url: function() { 
    return window.location.href.match(/^([^#]+)#.+$/)[1];
  }
};
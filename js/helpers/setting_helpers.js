var SettingHelpers = {
  validator: new SettingsValidator(),
  
  updateSettingsCheckboxes: function(settings) {
    $.each($('#info').find('input[type=checkbox]'), function() {
      var checkbox = $(this);
      var name = checkbox.attr('name');
      if(settings[name]) {
        checkbox.attr('checked', true);
      }
      $.each(['protocol-handler-enabled', 'content-handler-enabled'], function() {
        if(name == this && transmission.store.exists(this)) {
          checkbox.attr('disabled', true);
          checkbox.attr('checked', true);
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
  
  is_speed_limit_mode_update: function(params) {
    return (params['alt-speed-enabled'] !== undefined);
  },
  
  prepare_arguments: function(context, params) {
    if(params['alt-speed-enabled']) {
      var speedLimitModeEnabled = params['alt-speed-enabled'] == "true";
      params.settingsFlash = 'Speed Limit Mode ' + (speedLimitModeEnabled ? 'enabled.' : 'disabled.');
      transmission.store.set('speed_limit_mode', (speedLimitModeEnabled ? 'enabled' : 'disabled'));
      return context.speed_limit_mode_hash(params['alt-speed-enabled']);
    } else {
      params.settingsFlash = 'Settings updated successfully.';
      return context.arguments_hash(params);
    }
  },
  
  speed_limit_mode_hash: function(speed_limit_mode) {
    return { 'alt-speed-enabled': (speed_limit_mode == "true") ? true : false };
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
  },
  
  get_settings: function() {
    var request = { method: 'session-get', arguments: {} };
    this.remote_query(request, function(new_settings) { transmission.settings = new_settings; });
  }
};
kettu.SettingHelpers = {
  validator: new kettu.SettingsValidator(),
  
  updateSettingsCheckboxes: function(settings) {
    $.each($('#info').find('input[type=checkbox]'), function() {
      var checkbox = $(this),
        name = checkbox.attr('name');

      if(settings[name]) { checkbox.attr('checked', true); }
      
      ['protocol-handler-enabled', 'content-handler-enabled'].forEach(function(element) {
        if(name == element && kettu.app.store.exists(element)) {
          checkbox.attr('disabled', true);
          checkbox.attr('checked', true);
        }
      });
    });
    
    $('#info input, #info select').change(function(event) {
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
    
    var scheduled_times = {
      "alt-speed-time-begin-hours": Math.floor(settings['alt-speed-time-begin'] / 60),
      "alt-speed-time-begin-minutes": (settings['alt-speed-time-begin'] % 60),
      "alt-speed-time-end-hours": Math.floor(settings['alt-speed-time-end'] / 60),
      "alt-speed-time-end-minutes": (settings['alt-speed-time-end'] % 60)
    };

    for(key in scheduled_times) {
      $.each($('#info select[name="' + key + '"]').find('option'), function() {
        if($(this).val() == scheduled_times[key]) {
          $(this).attr('selected', 'selected');
        }
      });
    }
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
      kettu.app.store.set('speed_limit_mode', (speedLimitModeEnabled ? 'enabled' : 'disabled'));
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
      'encryption', 'utp-enabled', 'peer-port-random-on-start', 'port-forwarding-enabled',
      'lpd-enabled', 'alt-speed-time-enabled', 'alt-speed-time-day', 'seedRatioLimited',
      'seedRatioLimit', 'idle-seeding-limit-enabled', 'idle-seeding-limit',
      'download-queue-enabled', 'download-queue-size', 'seed-queue-enabled', 'seed-queue-size',
      'queue-stalled-enabled', 'queue-stalled-minutes'
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
    
    if (hash['alt-speed-time-enabled']) {
        hash['alt-speed-time-begin'] = this.calculateAltSpeedTime(params, 'alt-speed-time-begin');
        hash['alt-speed-time-end'] = this.calculateAltSpeedTime(params, 'alt-speed-time-end');
    }
    
    return hash;
  },
  
  calculateAltSpeedTime: function(params, key) {
    var hours = parseInt(params[key + '-hours'], 10);
    var minutes = parseInt(params[key + '-minutes'], 10);
    return hours * 60 + minutes;
  },
  
  manage_handlers: function(context, params) {
    if(params['protocol-handler-enabled'] && !kettu.app.store.exists('protocol-handler-enabled')) {
      kettu.app.store.set('protocol-handler-enabled', true);
      window.navigator.registerProtocolHandler('magnet', context.base_url() + '#/torrents/add?url=%s', "Transmission Web");
    }
    
    if(params['content-handler-enabled'] && !kettu.app.store.exists('content-handler-enabled')) {
      kettu.app.store.set('content-handler-enabled', true);
      window.navigator.registerContentHandler("application/x-bittorrent", context.base_url() + '#/torrents/add?url=%s', "Transmission Web");
    }
  },
  
  base_url: function() { 
    return window.location.href.match(/^([^#]+)#.+$/)[1];
  },
  
  get_settings: function() {
    var request = { method: 'session-get', arguments: {} };
    this.remote_query(request, function(new_settings) { kettu.app.settings = new_settings; });
  }
};
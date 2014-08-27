kettu.SettingHelpers = {
  validator: new kettu.SettingsValidator(),

  updatePeerPortDiv: function() {
    $('#port-open').addClass('waiting').show();

    var request = { 'method': 'port-test', 'arguments': {} };
    this.remoteQuery(request, function(response) {
      $('#port-open').removeClass('waiting');
      $('#port-open').toggleClass('active', !!response['port-is-open']);
    });
  },

  updateSettings: function() {
    var differences = this.hashDiff(kettu.app.originalSettings, kettu.app.settings || {}) || [];

    for(var difference in differences) {
      if(typeof differences[difference] === 'boolean') {
        $('.' + difference).attr('checked', differences[difference]);
      } else {
        $('.' + difference).val(differences[difference]);
      }
    }

    kettu.app.originalSettings = kettu.app.settings;
  },

  extendWithLocalSettings: function(settings) {
    return $.extend(settings, {
      torrentReloadInterval: this.store.get('torrentReloadInterval') / 1000,
      protocolHandlerEnabled: this.store.get('protocolHandlerEnabled'),
      contentHandlerEnabled: this.store.get('contentHandlerEnabled')
    });
  },

  updateSettingsCheckboxes: function(settings) {
    var handlers = ['protocolHandlerEnabled', 'contentHandlerEnabled'];

    $.each($('#info input[type=checkbox]'), function() {
      var $checkbox = $(this),
          name = $checkbox.attr('name');

      if(settings[name]) { $checkbox.attr('checked', true); }
    });

    $('#info input, #info select').change(function() {
      $(this).parents('form').trigger('submit');

      if(handlers.indexOf($(this).attr('name')) >= 0) {
        $(this).attr('disabled', 'disabled');
      }

      return false;
    });
  },

  updateSettingsSelects: function(settings) {
    $.each($('#info select'), function() {
      var $select = $(this),
          value = settings[$select.attr('name')];

      $.each($select.find('option'), function() {
        var $option = $(this);

        if($option.val() === value) {
          $option.attr('selected', 'selected');
        }
      });
    });

    var scheduled_times = {
      "alt-speed-time-begin-hours": Math.floor(settings['alt-speed-time-begin'] / 60),
      "alt-speed-time-begin-minutes": (settings['alt-speed-time-begin'] % 60),
      "alt-speed-time-end-hours": Math.floor(settings['alt-speed-time-end'] / 60),
      "alt-speed-time-end-minutes": (settings['alt-speed-time-end'] % 60)
    };

    _.each(scheduled_times, function(value, key) {
      $.each($('#info select[name="' + key + '"]').find('option'), function() {
        var $option = $(this);

        if($option.val() === scheduled_times[key]) {
          $option.attr('selected', 'selected');
        }
      });
    });
  },

  settingArgumentsValid: function(context, setting_arguments) {
    context.validator.validate(setting_arguments);
    return ! context.validator.has_errors();
  },

  settingArgumentsErrors: function(context) {
    return context.validator.errors;
  },

  isSpeedLimitModeUpdate: function(params) {
    return (params['alt-speed-enabled'] !== undefined);
  },

  prepareArguments: function(context, params) {
    if(params['alt-speed-enabled']) {
      var speedLimitModeEnabled = params['alt-speed-enabled'] === "true";
      params.settingsFlash = 'Speed Limit Mode ' + (speedLimitModeEnabled ? 'enabled.' : 'disabled.');
      this.store.set('speed_limit_mode', (speedLimitModeEnabled ? 'enabled' : 'disabled'));
      return context.speedLimitModeHash(params['alt-speed-enabled']);
    } else {
      params.settingsFlash = 'Settings updated successfully.';
      return context.argumentsHash(params);
    }
  },

  speedLimitModeHash: function(speed_limit_mode) {
    return { 'alt-speed-enabled': speed_limit_mode === "true" };
  },

  argumentsHash: function(params, updatable_settings) {
    updatable_settings = updatable_settings || [
      'dht-enabled', 'pex-enabled', 'speed-limit-up', 'speed-limit-up-enabled', 'speed-limit-down',
      'speed-limit-down-enabled', 'peer-port', 'download-dir', 'alt-speed-down', 'alt-speed-up',
      'encryption', 'utp-enabled', 'peer-port-random-on-start', 'port-forwarding-enabled',
      'lpd-enabled', 'alt-speed-time-enabled', 'alt-speed-time-day', 'seedRatioLimited',
      'seedRatioLimit', 'idle-seeding-limit-enabled', 'idle-seeding-limit',
      'download-queue-enabled', 'download-queue-size', 'seed-queue-enabled', 'seed-queue-size',
      'queue-stalled-enabled', 'queue-stalled-minutes', 'blocklist-enabled', 'blocklist-url'
    ];
    var hash = {};

    _.each(updatable_settings, function(setting) {
      hash[setting] = params[setting] ? true : false;
      if(params[setting] && params[setting].match(/^\d+$/)) {
        hash[setting] = parseInt(params[setting], 10);
      } else if(params[setting] && params[setting] !== "on") {
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

  manageHandlers: function(params) {
    var baseUrl = window.location.href.match(/^([^#]+)#.+$/)[1];

    if(params.protocolHandlerEnabled && !this.store.exists('protocolHandlerEnabled')) {
      this.store.set('protocolHandlerEnabled', true);
      window.navigator.registerProtocolHandler('magnet', baseUrl + '#/torrents/add?url=%s', "Transmission Web");
    }

    if(params.contentHandlerEnabled && !this.store.exists('contentHandlerEnabled')) {
      this.store.set('contentHandlerEnabled', true);
      window.navigator.registerContentHandler("application/x-bittorrent", baseUrl + '#/torrents/add?url=%s', "Transmission Web");
    }
  },

  manageReloadInterval: function(params) {
    if(params.torrentReloadInterval) {
      kettu.app.reloadInterval = parseInt(params.torrentReloadInterval, 10) * 1000;
      this.store.set('torrentReloadInterval', kettu.app.reloadInterval);

      clearInterval(kettu.app.torrents_interval_id);
      kettu.app.torrents_interval_id = setInterval(function() {
        kettu.app.trigger('get-torrents');
      }, kettu.app.reloadInterval);
    }
  }
};

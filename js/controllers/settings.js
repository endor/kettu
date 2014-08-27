kettu.Settings = function(transmission) {
  transmission.get('#/settings', function(context) {
    kettu.app.originalSettings = kettu.app.settings || {};

    var allSettings = context.extendWithLocalSettings(kettu.app.originalSettings),
        hoursPartial = 'templates/settings/hours.mustache',
        minutesPartial = 'templates/settings/minutes.mustache';

    context.render('templates/settings/index.mustache', allSettings, function(rendered_view) {
      context.openInfo(rendered_view, 'settings');
      context.updateSettingsCheckboxes(kettu.app.originalSettings);
      context.updateSettingsSelects(kettu.app.originalSettings);
      context.menuizeInfo();
    }, {hours: hoursPartial, minutes: minutesPartial});
  });

  transmission.put('#/settings', function(context) {
    var request = { method: 'session-set', arguments: context.prepareArguments(context, context.params) };

    context.manageHandlers(context.params);
    context.manageReloadInterval(context.params);

    if(context.isSpeedLimitModeUpdate(request['arguments']) || context.settingArgumentsValid(context, request['arguments'])) {
      context.remoteQuery(request, function() {
        kettu.app.trigger('flash', context.params.settingsFlash);
        if(context.params['peer-port']) { context.updatePeerPortDiv(); }
      });
    } else {
      kettu.app.trigger('flash', 'Settings could not be updated.');
      kettu.app.trigger('errors', context.settingArgumentsErrors(context));
    }
  });

  transmission.bind('get-settings', function() {
    var request = { method: 'session-get', arguments: {} };
    this.remoteQuery(request, function(new_settings) {
      kettu.app.settings = new_settings;
      kettu.app.trigger('refreshed-settings');
    });
  });

  transmission.bind('refreshed-settings', function() {
    if(this.infoIsOpen() && this.infoDisplaysSettings()) {
      this.updateSettings();
    }
  });
};

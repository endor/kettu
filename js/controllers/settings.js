Settings = function(sammy) { with(sammy) {
  get('#/settings', function() {
    var context = this;
    var request = {
      'method': 'session-get',
      'arguments': {}
    };
    rpc.query(request, function(response) {
      view = response;
      view['reload_interval'] = reload_interval / 1000;
      context.partial('./templates/settings/index.mustache', view, function(rendered_view) {
        context.openInfo(rendered_view);
        trigger('settings-refreshed', view);
      });
    });
  });
  
  bind('settings-refreshed', function(e, settings){ with(this) {
    this.updateSettingsCheckboxes(settings);
  }});
}};
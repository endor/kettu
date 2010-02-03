Settings = function(sammy) { with(sammy) {
  updatable_settings = [
    'dht-enabled', 'pex-enabled', 'speed-limit-up', 'speed-limit-up-enabled', 'speed-limit-down',
    'speed-limit-down-enabled', 'peer-port', 'download-dir'
  ];
  
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
        updatePeerPortDiv();
      });
    });
  });
  
  put('#/settings', function() {
    var context = this;
    var request = { 'method': 'session-set' };
    if(this.params['alt-speed-enabled']) {
      request['arguments'] = this.turtle_mode_hash(this.params['alt-speed-enabled']);
    } else {
      request['arguments'] = this.arguments_hash(updatable_settings, this.params);
    };
    rpc.query(request, function(response) {
      trigger('flash', 'Settings updated successfully');
      if(context.params['peer-port']) { updatePeerPortDiv(); }
    });
  });
    
  function updatePeerPortDiv() {
    var request = { 'method': 'port-test', 'arguments': {} };
    rpc.query(request, function(response) {
      if(response['port-is-open']) {
        $('#port-open').addClass('active');
      } else {
        $('#port-open').removeClass('active');
      }
    });
  };
  
  bind('settings-refreshed', function(e, settings){ with(this) {
    this.updateSettingsCheckboxes(settings);
    this.menuizeInfo();
  }});
}};
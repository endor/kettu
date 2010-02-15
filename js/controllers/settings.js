Settings = function(transmission) { with(transmission) {
  updatable_settings = [
    'dht-enabled', 'pex-enabled', 'speed-limit-up', 'speed-limit-up-enabled', 'speed-limit-down',
    'speed-limit-down-enabled', 'peer-port', 'download-dir', 'alt-speed-down', 'alt-speed-up',
    'encryption'
  ];

  get('#/settings', function() {
    var context = this;
    var request = {
      'method': 'session-get',
      'arguments': {}
    };
    rpc.query(request, function(response) {
      view = response;
      view['reload-interval'] = transmission.reload_interval/1000;
      context.partial('./templates/settings/index.mustache', view, function(rendered_view) {
        context.openInfo(rendered_view);
        trigger('settings-refreshed', view);
      });
    });
  });
  
  put('#/settings', function() {
    var context = this;
    var request = { 'method': 'session-set', 'arguments': this.prepare_arguments(context, this.params) };
    delete(request['arguments']['reload-interval']);

    rpc.query(request, function(response) {
      trigger('flash', 'Settings updated successfully');
      if(context.params['peer-port']) { updatePeerPortDiv(); }
      if(context.params['reload-interval']) { this.update_reload_interval(context, context.params['reload-interval']); }
    });
  });

  function updatePeerPortDiv() {
    $('#port-open').addClass('waiting');
    $('#port-open').show();
    
    var request = { 'method': 'port-test', 'arguments': {} };
    rpc.query(request, function(response) {
      $('#port-open').removeClass('waiting');
      if(response['port-is-open']) {
        $('#port-open').addClass('active');
      } else {
        $('#port-open').removeClass('active');
      }
    });
  };

  bind('settings-refreshed', function(e, settings){ with(this) {
    this.updateSettingsCheckboxes(settings);
    this.updateSettingsSelects(settings);
    this.menuizeInfo();
  }});
}};
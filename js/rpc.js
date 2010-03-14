(function($) {
  
  Sammy = Sammy || {};

  Sammy.TransmissionRPC = function(app) {

    app.rpc = {
      'base_url': 'http://localhost:9091',
      'url': 'http://localhost:9091/transmission/rpc',
      'session_id': ''
    };
    
    app.helpers({
      remote_url: function() {
        return this.app.rpc.base_url;
      },
      remote_session_id: function() {
        return this.app.rpc.session_id;
      },
      remote_query: function(params, callback) {
        var context = this.app.rpc;
        var that = this;
        $.ajax({
          type: 'POST',
          url: context.url,
          dataType: 'json',
          data: JSON.stringify(params),
          processData: false,
          beforeSend: function(xhr) {
            xhr.setRequestHeader('X-Transmission-Session-Id', context.session_id);
          },
          success: function(response) {
            if(callback) {
              callback(response['arguments']);
            }
          },
          error: function(xhr, ajaxOptions, thrownError) {
            context.session_id = xhr.getResponseHeader('X-Transmission-Session-Id');
            if(xhr.status === 409 && context.session_id.length > 0) {
              that.remote_query(params, callback);
            } else {
              if(window.console) {
                console.log('RPC Connection Failure');
                console.log(xhr.responseText);            
              }
            }
          }
        });        
      }
    });
  };
  
})(jQuery);
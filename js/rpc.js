(function($) {
  
  Sammy.TransmissionRPC = function(app) {

    app.rpc = {
      'url': '/transmission/rpc',
      'session_id': ''
    };
    
    app.helpers({
      remote_session_id: function() {
        return kettu.app.rpc.session_id;
      },

      remote_query: function(params, callback) {
        var context = this,
          rpc = context.app.rpc;
        $.ajax({
          type: 'POST',
          url: rpc.url,
          dataType: 'json',
          data: JSON.stringify(params),
          processData: false,
          beforeSend: function(xhr) {
            xhr.setRequestHeader('X-Transmission-Session-Id', rpc.session_id);
          },
          success: function(response) {
            if(!response) {
              Sammy.log('RPC Connection Failure.');
              Sammy.log('You need to run this web client within the Transmission web server.');
            }
            if(callback) { callback(response['arguments']); }
          },
          error: function(xhr, ajaxOptions, thrownError) {
            rpc.session_id = xhr.getResponseHeader('X-Transmission-Session-Id');
            if(xhr.status === 409 && rpc.session_id.length > 0) {
              context.remote_query(params, callback);
            } else {
              Sammy.log('RPC Connection Failure.');
              Sammy.log(xhr.responseText);            
            }
          }
        });
      }
    });

  };
  
})(jQuery);
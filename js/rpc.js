(function($) {

  Sammy.TransmissionRPC = function(app) {

    var rpc = {
      url: '../rpc',
      session_id: ''
    };

    app.helpers({
      remoteSessionId: function() {
        return rpc.session_id;
      },

      remoteQuery: function(params, callback) {
        var context = this;

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
          error: function(xhr) {
            rpc.session_id = xhr.getResponseHeader('X-Transmission-Session-Id');
            if(xhr.status === 409 && rpc.session_id.length > 0) {
              context.remoteQuery(params, callback);
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

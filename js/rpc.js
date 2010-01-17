RPC = function() {
  this.url = 'http://localhost:9091/transmission/rpc';
  this.session_id = '';
};

RPC.prototype = {  
  query: function(params, callback) {
    var context = this;
    $.ajax({
      type: 'POST',
      url: this.url,
      dataType: 'json',
      data: JSON.stringify(params),
      processData: false,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-Transmission-Session-Id', context.session_id);
      },
      success: function(response) {
        callback(response['arguments']);
      },
      error: function(xhr, ajaxOptions, thrownError) {
        context.session_id = xhr.getResponseHeader('X-Transmission-Session-Id');
        if(xhr.status === 409 && context.session_id.length > 0) {
          context.query(params, callback);
        } else {
          alert('RPC Connection Failure');
          console.log(xhr.responseText);
        }
      }
    });
  }
}
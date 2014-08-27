kettu.Blocklist = function(transmission) {
  transmission.put('#/blocklist', function(context) {
    var request = { method: 'blocklist-update', arguments: {} };

    context.remoteQuery(request, function(response) {
      kettu.app.trigger('flash', 'Number of blocklist rules updated.');
      $('#info .blocklist td.number').text(response['blocklist-size']);
    });
  });
};

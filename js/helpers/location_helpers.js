kettu.LocationHelpers = {
    initLocations: function(torrent) {
      var $locationSelect = $('#facebox .locationSelect');

      if ($locationSelect.length > 0) {
        $locationSelect.val(torrent.downloadDir);
        $locationSelect.change(function() {
          $('#facebox .location input').val($locationSelect.val());
        });
      }
    }
};

describe('context menu', function() {
  describe('reannounce torrent', function() {
    it('reannounces the torrent', function(done) {
      $('#torrents').trigger('contextmenu');

      setTimeout(function() {
        $('[value="Ask tracker for more peers"]').click();

        setTimeout(function() {
          var data = JSON.parse(window.lastRequest.data);
          expect(data.method).to.eql('torrent-reannounce');
          done();
        }, 100);
      }, 100);
    });
  });
});
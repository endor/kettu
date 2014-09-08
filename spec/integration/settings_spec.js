describe('settings', function() {
  it('lets me toggle the speed limit mode', function(done) {
    $('.speed_limit_mode').click();
    setTimeout(function() {
      var data = JSON.parse(window.lastRequest.data);
      expect(data["arguments"]["alt-speed-enabled"]).to.be(true);

      $('.speed_limit_mode').click();
      setTimeout(function() {
        var data = JSON.parse(window.lastRequest.data);
        expect(data["arguments"]["alt-speed-enabled"]).to.be(false);

        done();
      }, 50);
    }, 50);
  });
});

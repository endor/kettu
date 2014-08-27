describe("TorrentHelpers", function() {
  var torrent_helpers = kettu.TorrentHelpers;

  describe("formatNextAnnounceTime", function() {
    it("should return a formatted time for the given nextAnnounceTime", function() {
      var in_fifteen_minutes = new Date().getTime() + 900000;
      var timestamp = (new Date(in_fifteen_minutes).getTime()/1000).toFixed(0);
      expect(torrent_helpers.formatNextAnnounceTime(timestamp)).to.match(/(15|14) min, (0|59) sec/);
    });
  });
});

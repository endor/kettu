describe("TorrentHelpers", function() {
  kettu.app = {}
  var torrent_helpers = kettu.TorrentHelpers
  
  describe("formatNextAnnounceTime", function() {
    it("should return a formatted time for the given nextAnnounceTime", function() {
      in_fifteen_minutes = new Date().getTime() + 900000
      timestamp = (new Date(in_fifteen_minutes).getTime()/1000).toFixed(0)
      expect(torrent_helpers.formatNextAnnounceTime(timestamp)).toEqual("15 min, 0 sec")
    });
  });
});
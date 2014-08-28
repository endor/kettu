describe("TorrentView", function() {
  var ctx,
      torrent_view,
      timestamp,
      day;

  beforeEach(function() {
    ctx = {sanitizeNumber: function() {}};
    ctx.formatNextAnnounceTime = function() {};
    ctx.shorten = kettu.ApplicationHelpers.shorten;
    torrent_view = kettu.TorrentView({trackerStats: [], files: [], peers: [], fileStats: [], name: '', comment: ''}, ctx);
    timestamp = "1265737984";
    day = (new Date()).getTimezoneOffset()/60 < -6 ? 10 : 9;
  });

  describe("addFormattedTimes", function() {
    it("should add a formatted time for lastAnnounceTime", function() {
      torrent_view.trackerStats[0] = {};
      torrent_view.trackerStats[0].lastAnnounceTime = timestamp;
      torrent_view.addFormattedTimes();
      expect(torrent_view.trackerStats[0].lastAnnounceTimeFormatted).to.match(new RegExp("2/" + day + "/2010 \\d+:53"));
    });

    it("should add a formatted time for lastScrapeTime", function() {
      torrent_view.trackerStats[0] = {};
      torrent_view.trackerStats[0].lastScrapeTime = timestamp;
      torrent_view.addFormattedTimes();
      expect(torrent_view.trackerStats[0].lastScrapeTimeFormatted).to.match(new RegExp("2/" + day + "/2010 \\d+:53"));
    });
  });

  describe("addFormattedSizes", function() {
    describe("files", function() {
      it("should add a formatted size for length", function() {
        torrent_view.files[0] = {};
        torrent_view.files[0].length = 2048;
        torrent_view.addFormattedSizes();
        expect(torrent_view.files[0].lengthFormatted).to.equal('2.05 KB');
      });

      it("should add a percent done value", function() {
        torrent_view.files[0] = {'length': 2048, 'bytesCompleted': 512};
        torrent_view.addFormattedSizes();
        expect(torrent_view.files[0].percentDone).to.equal(25);
      });
    });

    describe("peers", function() {
      it("should add a percent done value", function() {
        torrent_view.peers[0] = {'progress': 0.7};
        torrent_view.addFormattedSizes();
        expect(torrent_view.peers[0].percentDone).to.equal(70);
      });

      it("should add a formatted upload value", function() {
        torrent_view.peers[0] = {'rateToPeer': 20};
        torrent_view.addFormattedSizes();
        expect(torrent_view.peers[0].uploadFormatted).to.equal('20.0 B');
      });

      it("should add an empty string if upload value is 0", function() {
        torrent_view.peers[0] = {'rateToPeer': 0};
        torrent_view.addFormattedSizes();
        expect(torrent_view.peers[0].uploadFormatted).to.equal('');
      });

      it("should add a formatted download value", function() {
        torrent_view.peers[0] = {'rateToClient': 20};
        torrent_view.addFormattedSizes();
        expect(torrent_view.peers[0].downloadFormatted).to.equal('20.0 B');
      });
    });
  });

  describe("sort peers", function() {
    beforeEach(function() {
      torrent_view.peers = [
        {'ip': '1.2.3.4', 'clientName': 'Transmission', 'percentDone': 10, 'rateToPeer': 10, 'rateToClient': 50},
        {'ip': '2.2.3.4', 'clientName': 'Beluge', 'percentDone': 30, 'rateToPeer': 50, 'rateToClient': 40},
        {'ip': '4.2.3.4', 'clientName': 'Vuze', 'percentDone': 20, 'rateToPeer': 40, 'rateToClient': 30},
        {'ip': '3.2.3.4', 'clientName': 'rtorrent', 'percentDone': 40, 'rateToPeer': 30, 'rateToClient': 20},
        {'ip': '5.2.3.4', 'clientName': 'BitComet', 'percentDone': 50, 'rateToPeer': 20, 'rateToClient': 10}
      ];
    });

    it("should sort by client", function() {
      torrent_view.sort_peers = 'client';
      torrent_view.sortPeers();
      expect(torrent_view.peers[0].clientName).to.equal('Beluge');
      expect(torrent_view.peers[1].clientName).to.equal('BitComet');
      expect(torrent_view.peers[2].clientName).to.equal('rtorrent');
      expect(torrent_view.peers[3].clientName).to.equal('Transmission');
      expect(torrent_view.peers[4].clientName).to.equal('Vuze');
    });

    it("should sort by percent", function() {
      torrent_view.sort_peers = 'percent';
      torrent_view.sortPeers();
      expect(torrent_view.peers[0].clientName).to.equal('BitComet');
      expect(torrent_view.peers[1].clientName).to.equal('rtorrent');
      expect(torrent_view.peers[2].clientName).to.equal('Beluge');
      expect(torrent_view.peers[3].clientName).to.equal('Vuze');
      expect(torrent_view.peers[4].clientName).to.equal('Transmission');
    });

    it("should sort by upload", function() {
      torrent_view.sort_peers = 'upload';
      torrent_view.sortPeers();
      expect(torrent_view.peers[0].clientName).to.equal('Beluge');
      expect(torrent_view.peers[1].clientName).to.equal('Vuze');
      expect(torrent_view.peers[2].clientName).to.equal('rtorrent');
      expect(torrent_view.peers[3].clientName).to.equal('BitComet');
      expect(torrent_view.peers[4].clientName).to.equal('Transmission');
    });

    it("should sort by download", function() {
      torrent_view.sort_peers = 'download';
      torrent_view.sortPeers();
      expect(torrent_view.peers[0].clientName).to.equal('Transmission');
      expect(torrent_view.peers[1].clientName).to.equal('Beluge');
      expect(torrent_view.peers[2].clientName).to.equal('Vuze');
      expect(torrent_view.peers[3].clientName).to.equal('rtorrent');
      expect(torrent_view.peers[4].clientName).to.equal('BitComet');
    });
  });

  describe("folderizeFiles", function() {
    it("should sort the files", function() {
      torrent_view.files = [
        {name: 'b'},
        {name: 'c/b'},
        {name: 'c/a'},
        {name: 'a'}
      ];

      torrent_view.folderizeFiles();
      expect(torrent_view.files[0].name).to.equal('a');
      expect(torrent_view.files[1].name).to.equal('b');
      expect(torrent_view.files[2].name).to.equal('a');
      expect(torrent_view.files[3].name).to.equal('b');
    });
  });

  describe("addIdsToFiles", function() {
    it("should add an id to the file", function() {
      torrent_view.files[0] = {};
      torrent_view.fileStats[0] = {};
      torrent_view.addIdsToFiles();
      expect(torrent_view.files[0].id).to.equal('file_0');
    });

    it("should add wanted if the file is wanted", function() {
      torrent_view.files = [{}, {}];
      torrent_view.fileStats = [{'wanted': true}, {}];
      torrent_view.addIdsToFiles();
      expect(torrent_view.files[0].wanted).to.equal(' checked="checked"');
    });

    it("should not add wanted if the file is not wanted", function() {
      torrent_view.files = [{}, {}];
      torrent_view.fileStats = [{'wanted': false}, {}];
      torrent_view.addIdsToFiles();
      expect(torrent_view.files[0].wanted).not.to.equal(' checked="checked"');
    });

    it("should add disabled if the file is done downloading", function() {
      torrent_view.files[0] = {'length': 200, 'bytesCompleted': 200};
      torrent_view.fileStats[0] = {};
      torrent_view.addIdsToFiles();
      expect(torrent_view.files[0].disabled).to.equal(' disabled="disabled"');
    });

    it("should not add disabled if the file is not done downloading", function() {
      torrent_view.files[0] = {'length': 200, 'bytesCompleted': 100};
      torrent_view.files[1] = {};
      torrent_view.fileStats = [{}, {}];
      torrent_view.addIdsToFiles();
      expect(torrent_view.files[0].disabled).not.to.equal(' disabled="disabled"');
    });

    it("should add disabled if there is only one file", function() {
      torrent_view.files[0] = {'length': 200, 'bytesCompleted': 100};
      torrent_view.fileStats = [{}];
      torrent_view.addIdsToFiles();
      expect(torrent_view.files[0].disabled).to.equal(' disabled="disabled"');
    });

    it("should add wanted if the file is wanted", function() {
      torrent_view.files[0] = {};
      torrent_view.fileStats[0] = {'wanted': false};
      torrent_view.addIdsToFiles();
      expect(torrent_view.files[0].wanted).to.equal(' checked="checked"');
    });
  });

  describe("make strings shorter so they work in the mobile version", function() {
    it("should make the strings shorter if it's the mobile version and the string is too long", function() {
      kettu.app.mobile = true;
      torrent_view = kettu.TorrentView({comment: '1234567890123456789012345678901234567890',
                                        trackerStats: [], files: [], name: 'abc',
                                        peers: [], fileStats: []}, ctx);
      expect(torrent_view.comment).to.equal('123456789012345678901234567890123…');
    });

    it("should not make the strings shorter if it's not the mobile version", function() {
      kettu.app.mobile = false;
      torrent_view = kettu.TorrentView({comment: '1234567890123456789012345678901234567890',
                                        trackerStats: [], files: [], name: 'abc',
                                        peers: [], fileStats: []}, ctx);
      expect(torrent_view.comment).to.equal('1234567890123456789012345678901234567890');
    });

    it("should not make the strings shorter if they aren't too long", function() {
      kettu.app.mobile = true;
      torrent_view = kettu.TorrentView({comment: '1234567890',
                                        trackerStats: [], files: [], name: 'abc',
                                        peers: [], fileStats: []}, ctx);
      expect(torrent_view.comment).to.equal('1234567890');
    });
  });

  describe("configured locations", function() {
    var originalLocations;

    describe("locations are configured", function() {
      beforeEach(function() {
        originalLocations = kettu.config.locations;
        kettu.config.locations = [
          {name: "ABC", path: "/Users/endor/ABC"},
          {name: "DEF", path: "/Users/endor/DEF"}
        ];
      });

      afterEach(function() {
        kettu.config.locations = originalLocations;
      });

      it("shows locations", function() {
        torrent_view = kettu.TorrentView({
          trackerStats: [], files: [], name: 'abc',
          peers: [], fileStats: [], comment: ''
        }, ctx);
        expect(torrent_view.showLocations).to.be(true);
      });

      it("collects the locations from the configuration and adds a default location", function() {
        kettu.app.settings['download-dir'] = "/Users/endor/XYZ";

        torrent_view = kettu.TorrentView({
          trackerStats: [], files: [], name: 'abc',
          peers: [], fileStats: [], comment: ''
        }, ctx);
        expect(torrent_view.locations).to.eql([
          {name: "Default", path: "/Users/endor/XYZ"},
          {name: "ABC", path: "/Users/endor/ABC"},
          {name: "DEF", path: "/Users/endor/DEF"}
        ]);
      });
    });

    describe("locations are not configured", function() {
      it("does not show locations", function() {
        originalLocations = kettu.config.locations;
        delete kettu.config.locations;
        torrent_view = kettu.TorrentView({
          trackerStats: [], files: [], name: 'abc',
          peers: [], fileStats: [], comment: ''
        }, ctx);
        expect(torrent_view.showLocations).to.be(false);
        kettu.config.locations = originalLocations;
      });
    });
  });
});

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
      torrent_view.trackerStats[0]['lastAnnounceTime'] = timestamp;
      torrent_view.addFormattedTimes();
      expect(torrent_view.trackerStats[0].lastAnnounceTimeFormatted).toMatch(new RegExp("2/" + day + "/2010 \\d+:53"));
    });
    
    it("should add a formatted time for lastScrapeTime", function() {
      torrent_view.trackerStats[0] = {};
      torrent_view.trackerStats[0]['lastScrapeTime'] = timestamp;
      torrent_view.addFormattedTimes();
      expect(torrent_view.trackerStats[0].lastScrapeTimeFormatted).toMatch(new RegExp("2/" + day + "/2010 \\d+:53"));
    });
  });
  
  describe("addFormattedSizes", function() {
    describe("files", function() {
      it("should add a formatted size for length", function() {
        torrent_view.files[0] = {};
        torrent_view.files[0]['length'] = 2048;
        torrent_view.addFormattedSizes();
        expect(torrent_view.files[0].lengthFormatted).toEqual('2.0 KB');
      });
    
      it("should add a percent done value", function() {
        torrent_view.files[0] = {'length': 2048, 'bytesCompleted': 512};
        torrent_view.addFormattedSizes();
        expect(torrent_view.files[0].percentDone).toEqual(25);
      });
    });
    
    describe("peers", function() {
      it("should add a percent done value", function() {
        torrent_view.peers[0] = {'progress': 0.7};
        torrent_view.addFormattedSizes();
        expect(torrent_view.peers[0].percentDone).toEqual(70);
      });
      
      it("should add a formatted upload value", function() {
        torrent_view.peers[0] = {'rateToPeer': 20};
        torrent_view.addFormattedSizes();
        expect(torrent_view.peers[0].uploadFormatted).toEqual('20 bytes');
      });
      
      it("should add an empty string if upload value is 0", function() {
        torrent_view.peers[0] = {'rateToPeer': 0};
        torrent_view.addFormattedSizes();
        expect(torrent_view.peers[0].uploadFormatted).toEqual('');
      });
      
      it("should add a formatted download value", function() {
        torrent_view.peers[0] = {'rateToClient': 20};
        torrent_view.addFormattedSizes();
        expect(torrent_view.peers[0].downloadFormatted).toEqual('20 bytes');
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
      expect(torrent_view.peers[0].clientName).toEqual('Beluge');
      expect(torrent_view.peers[1].clientName).toEqual('BitComet');
      expect(torrent_view.peers[2].clientName).toEqual('rtorrent');
      expect(torrent_view.peers[3].clientName).toEqual('Transmission');
      expect(torrent_view.peers[4].clientName).toEqual('Vuze');
    });
    
    it("should sort by percent", function() {
      torrent_view.sort_peers = 'percent';
      torrent_view.sortPeers();
      expect(torrent_view.peers[0].clientName).toEqual('BitComet');
      expect(torrent_view.peers[1].clientName).toEqual('rtorrent');
      expect(torrent_view.peers[2].clientName).toEqual('Beluge');
      expect(torrent_view.peers[3].clientName).toEqual('Vuze');
      expect(torrent_view.peers[4].clientName).toEqual('Transmission');
    });
    
    it("should sort by upload", function() {
      torrent_view.sort_peers = 'upload';
      torrent_view.sortPeers();
      expect(torrent_view.peers[0].clientName).toEqual('Beluge');
      expect(torrent_view.peers[1].clientName).toEqual('Vuze');
      expect(torrent_view.peers[2].clientName).toEqual('rtorrent');
      expect(torrent_view.peers[3].clientName).toEqual('BitComet');
      expect(torrent_view.peers[4].clientName).toEqual('Transmission');
    });
    
    it("should sort by download", function() {
      torrent_view.sort_peers = 'download';
      torrent_view.sortPeers();
      expect(torrent_view.peers[0].clientName).toEqual('Transmission');
      expect(torrent_view.peers[1].clientName).toEqual('Beluge');
      expect(torrent_view.peers[2].clientName).toEqual('Vuze');
      expect(torrent_view.peers[3].clientName).toEqual('rtorrent');
      expect(torrent_view.peers[4].clientName).toEqual('BitComet');
    });
  });

  describe("addIdsToFiles", function() {
    it("should add an id to the file", function() {
      torrent_view.files[0] = {};
      torrent_view.fileStats[0] = {};
      torrent_view.addIdsToFiles();
      expect(torrent_view.files[0].id).toEqual('file_0');
    });
    
    it("should add wanted if the file is wanted", function() {
      torrent_view.files = [{}, {}];
      torrent_view.fileStats = [{'wanted': true}, {}];
      torrent_view.addIdsToFiles();
      expect(torrent_view.files[0].wanted).toEqual(' checked="checked"');
    });
    
    it("should not add wanted if the file is not wanted", function() {
      torrent_view.files = [{}, {}];
      torrent_view.fileStats = [{'wanted': false}, {}];
      torrent_view.addIdsToFiles();
      expect(torrent_view.files[0].wanted).toNotEqual(' checked="checked"');
    });
    
    it("should add disabled if the file is done downloading", function() {
      torrent_view.files[0] = {'length': 200, 'bytesCompleted': 200};
      torrent_view.fileStats[0] = {};
      torrent_view.addIdsToFiles();
      expect(torrent_view.files[0].disabled).toEqual(' disabled="disabled"');
    });
    
    it("should not add disabled if the file is not done downloading", function() {
      torrent_view.files[0] = {'length': 200, 'bytesCompleted': 100};
      torrent_view.files[1] = {};
      torrent_view.fileStats = [{}, {}];
      torrent_view.addIdsToFiles();
      expect(torrent_view.files[0].disabled).toNotEqual(' disabled="disabled"');
    });
    
    it("should add disabled if there is only one file", function() {
      torrent_view.files[0] = {'length': 200, 'bytesCompleted': 100};
      torrent_view.fileStats = [{}];
      torrent_view.addIdsToFiles();
      expect(torrent_view.files[0].disabled).toEqual(' disabled="disabled"');
    });
    
    it("should add wanted if the file is wanted", function() {
      torrent_view.files[0] = {};
      torrent_view.fileStats[0] = {'wanted': false};
      torrent_view.addIdsToFiles();
      expect(torrent_view.files[0].wanted).toEqual(' checked="checked"');
    });
  });
  
  describe("make strings shorter so they work in the mobile version", function() {
    it("should make the strings shorter if it's the mobile version and the string is too long", function() {
      kettu.app.mobile = true
      torrent_view = kettu.TorrentView({comment: '1234567890123456789012345678901234567890',
                                        trackerStats: [], files: [], name: 'abc',
                                        peers: [], fileStats: []}, ctx)
      expect(torrent_view.comment).toEqual('123456789012345678901234567890123&hellip;')
    });
    
    it("should not make the strings shorter if it's not the mobile version", function() {
      kettu.app.mobile = false
      torrent_view = kettu.TorrentView({comment: '1234567890123456789012345678901234567890',
                                        trackerStats: [], files: [], name: 'abc',
                                        peers: [], fileStats: []}, ctx)
      expect(torrent_view.comment).toEqual('1234567890123456789012345678901234567890')
    });
    
    it("should not make the strings shorter if they aren't too long", function() {
      kettu.app.mobile = true
      torrent_view = kettu.TorrentView({comment: '1234567890',
                                        trackerStats: [], files: [], name: 'abc',
                                        peers: [], fileStats: []}, ctx)
      expect(torrent_view.comment).toEqual('1234567890')
    });
  });
});
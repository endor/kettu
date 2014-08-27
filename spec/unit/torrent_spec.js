describe("Torrent", function() {
  describe("isActive", function() {
    it("should be true when the torrent is seeding", function() {
      var seeding = kettu.Torrent.stati.seeding;
      expect(kettu.Torrent({status: seeding}).isActive()).to.be(true);
    });

    it("should be true when the torrent is downloading", function() {
      var downloading = kettu.Torrent.stati.downloading;
      expect(kettu.Torrent({status: downloading}).isActive()).to.be(true);
    });

    it("should be false when the torrent is waiting for check", function() {
      var waiting_for_check = kettu.Torrent.stati.waiting_to_check;
      expect(kettu.Torrent({status: waiting_for_check}).isActive()).to.be(false);
    });

    it("should be false when the torrent is checking", function() {
      var checking = kettu.Torrent.stati.checking;
      expect(kettu.Torrent({status: checking}).isActive()).to.be(false);
    });

    it("should be false when the torrent is paused", function() {
      var paused = kettu.Torrent.stati.paused;
      expect(kettu.Torrent({status: paused}).isActive()).to.be(false);
    });
  });

  describe("isDoneDownloading", function() {
    it("should be true when the status is seeding even if leftUntilDone is great than 0", function() {
      var seeding = kettu.Torrent.stati.seeding;
      expect(kettu.Torrent({status: seeding, leftUntilDone: 1000}).isDoneDownloading()).to.be(true);
    });

    it("should be true when leftUntilDone is 0", function() {
      var paused = kettu.Torrent.stati.paused;
      expect(kettu.Torrent({status: paused, leftUntilDone: 0}).isDoneDownloading()).to.be(true);
    });

    it("should be true when leftUntilDone is 0", function() {
      var paused = kettu.Torrent.stati.paused;
      expect(kettu.Torrent({status: paused, leftUntilDone: 1000}).isDoneDownloading()).to.be(false);
    });
  });

  describe("percentDone", function() {
    it("should return 0 when sizeWhenDone is null", function() {
      expect(kettu.Torrent({sizeWhenDone: null}).percentDone()).to.equal(0);
    });

    it("should return 0 when leftUntilDone is null", function() {
      expect(kettu.Torrent({leftUntilDone: null}).percentDone()).to.equal(0);
    });

    it("should truncate to 2 decimals", function() {
      expect(kettu.Torrent({sizeWhenDone: 100000, leftUntilDone: 50666}).percentDone()).to.equal(49.33);
    });

    it("should always round done so that 100% isn't premature", function() {
      expect(kettu.Torrent({sizeWhenDone: 100000, leftUntilDone: 1}).percentDone()).to.equal(99.99);
    });

    it("should return 100 when all is downloaded", function() {
      expect(kettu.Torrent({sizeWhenDone: 100000, leftUntilDone: 0}).percentDone()).to.equal(100.00);
    });
  });

  describe("etaString", function() {
    it("should be unknown when less than 0", function() {
      expect(kettu.Torrent({eta: -1}).etaString()).to.equal('remaining time unknown');
    });

    it("should format the time correctly", function() {
      expect(kettu.Torrent({eta: 3660}).etaString()).to.equal('1 hr 1 min remaining');
    });
  });

  describe("downloadingProgress", function() {
    it("should create a human readable string from sizeWhenDone and leftUntilDone", function() {
      var torrent = kettu.Torrent({sizeWhenDone: 100000, leftUntilDone: 50666});
      expect(torrent.downloadingProgress()).to.equal('49.3 KB of 100 KB (49.33%)');
    });
  });

  describe("uploadingProgress", function() {
    it("should create a human readable string from sizeWhenDone, uploadRatio and uploadedEver", function() {
      var torrent = kettu.Torrent({sizeWhenDone: 100000, uploadedEver: 50666, uploadRatio: 0.52});
      expect(torrent.uploadingProgress()).to.equal('Downloaded 100 KB, uploaded 50.7 KB (Ratio: 0.520)');
    });
  });

  describe("statusString", function() {
    it("should contain a human readable status", function() {
      expect(kettu.Torrent({status: kettu.Torrent.stati.checking}).statusString()).to.match(/Verifying local data/);
    });

    it("should contain the up and download speed", function() {
      var torrent = kettu.Torrent({status: kettu.Torrent.stati.downloading, rateUpload: 10000, rateDownload: 10000, leftUntilDone: 10});
      expect(torrent.statusString()).to.match(/DL: 10.0 KB\/s, UL: 10.0 KB\/s/);
    });

    it("should not contain the download speed when torrent is seeding", function() {
      var torrent = kettu.Torrent({status: kettu.Torrent.stati.seeding, rateUpload: 10000, rateDownload: 10000});
      expect(torrent.statusString()).not.to.match(/DL: 10.0 KB\/s/);
    });

    it("should not contain up and download speed when torrent is not active", function() {
      var torrent = kettu.Torrent({status: kettu.Torrent.stati.paused, rateUpload: 10000, rateDownload: 10000});
     expect( torrent.statusString()).not.to.match(/DL: 10.0 KB\/s, UL: 10.0 KB\/s/);
    });
  });

  describe("progressBar", function() {
    it("should add class downloading if it's a downloading torrent", function() {
      var torrent = kettu.Torrent({status: kettu.Torrent.stati.downloading, metadataPercentComplete: 1});
      expect(torrent.progressBar()).to.match(/downloading/);
    });

    it("should add class uploading if it's a seeding torrent", function() {
      var torrent = kettu.Torrent({status: kettu.Torrent.stati.seeding, metadataPercentComplete: 1});
      expect(torrent.progressBar()).to.match(/seeding/);
    });

    it("should add class paused if it's a paused torrent", function() {
      var torrent = kettu.Torrent({status: kettu.Torrent.stati.paused, metadataPercentComplete: 1});
      expect(torrent.progressBar()).to.match(/paused/);
    });

    it("should add class meta if it's a torrent retrieving meta data", function() {
      var torrent = kettu.Torrent({status: kettu.Torrent.stati.downloading, metadataPercentComplete: 0});
      expect(torrent.progressBar()).to.match(/meta/);
    });

    it("should fill the progressbar the same percentage as the metadata retrieved", function() {
      var torrent = kettu.Torrent({status: kettu.Torrent.stati.downloading, metadataPercentComplete: 0.32});
      expect(torrent.progressBar()).to.match(/32%/);
    });
  });
});

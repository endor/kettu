describe('torrent info', function() {
  it('opens the torrent info on double clicking', function(done) {
    kettu.helpers.createTorrent('Mutant Ninja Turtles', {downloadDir: "/downloads"});

    kettu.helpers.waitForReload(function() {
      $('.torrent:first').click();
      $('.torrent:first').dblclick();
      setTimeout(function() {
        $('#menu-item-preferences').click();
        setTimeout(function() {
          expect($('[name="location"]').val()).to.equal('/downloads');
          $('.torrent:first').dblclick();
          setTimeout(function() {
            expect($('#info:visible')).to.have.length(0);
            done();
          }, 50);
        }, 50);
      }, 50);
    });
  });

  it('opens the torrent info on clicking on inspector', function(done) {
    kettu.helpers.createTorrent('Mutant Ninja Turtles', {downloadDir: "/downloads"});

    kettu.helpers.waitForReload(function() {
      $('.torrent:first').click();
      $('.inspector').click();
      setTimeout(function() {
        $('#menu-item-preferences').click();
        setTimeout(function() {
          expect($('[name="location"]').val()).to.equal('/downloads');
          $('.inspector').click();
          setTimeout(function() {
            expect($('#info:visible')).to.have.length(0);
            done();
          }, 50);
        }, 50);
      }, 50);
    });
  });

  it('shows a warning when opening the inspector without any torrents selected', function(done) {
    kettu.helpers.createTorrent('Mutant Ninja Turtles', {downloadDir: "/downloads"});

    kettu.helpers.waitForReload(function() {
      $('.inspector').click();
      setTimeout(function() {
        expect($('#info').text()).to.match(/You have not selected any torrents to inspect/);
        $('.inspector').click();
        setTimeout(function() {
          done();
        }, 50);
      }, 50);
    });
  });

  it('updates the info when double clicking on one torrent and then clicking on another', function(done) {
    kettu.helpers.createTorrents([
      ["Mutant Ninja Turtles", {id: 1, downloadDir: "/downloads"}],
      ["Donald Duck", {id: 2}],
      ["Saber Riders", {id: 3, downloadDir: "/my_torrents"}]
    ]);

    kettu.helpers.waitForReload(function() {
      $('.torrent:first').click();
      $('.torrent:first').dblclick();
      setTimeout(function() {
        $('#menu-item-preferences').click();
        setTimeout(function() {
          expect($('[name="location"]').val()).to.equal('/downloads');
          $('.torrent:last').click();
          setTimeout(function() {
            expect($('[name="location"]').val()).to.equal('/my_torrents');
            $('.torrent:last').dblclick();
            setTimeout(function() {
              done();
            }, 50);
          }, 100);
        }, 50);
      }, 50);
    });
  });

  it('displays tracker information', function(done) {
    var in_thirty_minutes = new Date().getTime() + 1800000;

    kettu.helpers.createTorrent('Mutant Ninja Turtles', {"trackerStats": [
      {
        "lastAnnounceTime": "1266830556",
        "host": "my.tracker.com:1234",
        "nextAnnounceTime": (new Date(in_thirty_minutes).getTime() / 1000).toFixed(0),
        "lastScrapeTime": "12345678",
        "seederCount": 0,
        "leecherCount": 0,
        "downloadCount": 1
      }
    ]});

    kettu.helpers.waitForReload(function() {
      $('.torrent:first').click();
      $('.inspector').click();
      setTimeout(function() {
        $('#menu-item-trackers').click();
        setTimeout(function() {
          expect($('.trackers').html()).to.match(/my\.tracker\.com\:1234/);
          expect($('.trackers').html()).to.match(/2\/22\/2010\ (\d+)\:22/);
          expect($('.trackers').html()).to.match(/(29|30) min, (\d+) sec/);

          $('.inspector').click();
          setTimeout(function() {
            done();
          }, 50);
        }, 50);
      }, 50);
    });
  });

  it('displays file information', function(done) {
    kettu.helpers.createTorrent('Mutant Ninja Turtles', {
      "files": [
        {"key": "1", "bytesCompleted": "6", "length": "12", "name": "README.md"},
        {"key": "2", "bytesCompleted": "0", "length": "0", "name": "INSTALL.md"}
      ],
      "fileStats": [
        {"wanted": false, "priority": 0},
        {"priority": 0}
      ]
    });

    kettu.helpers.waitForReload(function() {
      $('.torrent:first').click();
      $('.inspector').click();
      setTimeout(function() {
        $('#menu-item-files').click();
        setTimeout(function() {
          expect($('.files').html()).to.match(/12.0 B/);
          expect($('.files').html()).to.match(/50\%/);
          expect($('#file_0').is(':checked')).to.be(false);
          expect($('#file_1').is(':checked')).to.be(true);

          $('.inspector').click();
          setTimeout(function() {
            done();
          }, 50);
        }, 50);
      }, 50);
    });
  });

  it('displays peer information', function(done) {
    kettu.helpers.createTorrent('Mutant Ninja Turtles', {
      "peers": [
        {"address": "1.2.3.4", "clientName": "Transmission Rocks", "rateToClient": 0, "rateToPeer": 0, "progress": 0}
      ]
    });

    kettu.helpers.waitForReload(function() {
      $('.torrent:first').click();
      $('.inspector').click();
      setTimeout(function() {
        $('#menu-item-peers').click();
        setTimeout(function() {
          expect($('.peers').html()).to.match(/1\.2\.3\.4/);
          expect($('.peers').html()).to.match(/Transmission Rocks/);

          $('.inspector').click();
          setTimeout(function() {
            done();
          }, 50);
        }, 50);
      }, 50);
    });
  });

  it('updates itself', function(done) {
    kettu.helpers.createTorrent('Mutant Ninja Turtles', {
      "peers": [
        {"address": "1.2.3.4", "clientName": "Transmission Rocks", "rateToClient": 0, "rateToPeer": 0, "progress": 0}
      ]
    });

    kettu.helpers.waitForReload(function() {
      $('.torrent:first').click();
      $('.inspector').click();
      setTimeout(function() {
        $('#menu-item-peers').click();
        setTimeout(function() {
          expect($('.peers').html()).to.match(/1\.2\.3\.4/);

          kettu.helpers.updateTorrent({
            "peers": [
              {"address": "6.7.8.9", "clientName": "Elephant", "rateToClient": 0, "rateToPeer": 0, "progress": 0}
            ]
          });

          kettu.helpers.waitForReload(function() {
            expect($('.peers').html()).to.match(/6\.7\.8\.9/);
            expect($('.peers').html()).to.match(/Elephant/);

            $('.inspector').click();
            setTimeout(function() {
              done();
            }, 50);
          });
        }, 50);
      }, 50);
    });
  });

  it('displays corrupt download data', function(done) {
    kettu.helpers.createTorrent('Mutant Ninja Turtles', {
      "downloadedEver": 2048,
      "corruptEver": 1024
    });

    kettu.helpers.waitForReload(function() {
      $('.torrent:first').click();
      $('.inspector').click();
      setTimeout(function() {
        $('#menu-item-activity').click();
        setTimeout(function() {
          expect($('#info .item.activity').html()).to.match(/2\.05 KB\s+\(1\.02 KB corrupt\)/);

          $('.inspector').click();
          setTimeout(function() {
            done();
          }, 50);
        }, 50);
      }, 50);
    });
  });
});

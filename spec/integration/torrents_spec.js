describe('torrents', function() {
  var $torrents = $('#torrents');

  beforeEach(function() {
    $torrents.html('');
  });

  it('shows a list of torrents', function(done) {
    kettu.helpers.createTorrent('Mutant Ninja Turtles');

    kettu.helpers.waitForReload(function() {
      var name = $.trim($torrents.find('.name').text());
      expect(name).to.equal('Mutant Ninja Turtles');
      done();
    });
  });

  it('lets me click on a torrent', function(done) {
    kettu.helpers.createTorrent('Mutant Ninja Turtles');

    kettu.helpers.waitForReload(function() {
      var firstTorrent = $torrents.find('.torrent:first');
      firstTorrent.click();
      expect(firstTorrent.hasClass('active')).to.be(true);
      done();
    });
  });

  it('switches to compact mode', function(done) {
    kettu.helpers.createTorrent('Mutant Ninja Turtles');

    kettu.helpers.waitForReload(function() {
      expect($torrents.find('.progressDetails')).to.have.length(1);
      $('.compact_view').click();
      setTimeout(function() {
        expect($torrents.find('.progressDetails')).to.have.length(0);
        $('.compact_view').click();
        setTimeout(function() {
          expect($torrents.find('.progressDetails')).to.have.length(1);
          done();
        }, 50);
      }, 50);
    });
  });

  it('shows errors in the torrent list', function(done) {
    kettu.helpers.createTorrent('Mutant Ninja Turtles', {"error": 2, "errorString": "torrent not registered with this tracker"});

    kettu.helpers.waitForReload(function() {
      expect($torrents.html()).to.match(/torrent not registered with this tracker/);
      done();
    });
  });
});

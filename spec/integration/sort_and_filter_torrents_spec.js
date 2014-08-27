describe('sort and filter torrents', function() {
  it('filters torrents', function(done) {
    kettu.helpers.createTorrents([
      ["Mutant Ninja Turtles", {id: 1, status: 4}],
      ["Donald Duck", {id: 2, status: 6}],
      ["Saber Riders", {id: 3, status: 0}]
    ]);

    kettu.helpers.waitForReload(function() {
      window.location.href = $('#filters .downloading').attr('href');
      setTimeout(function() {
        expect($('#torrents').html()).to.contain("Mutant Ninja Turtles");
        expect($('#torrents').html()).not.to.contain("Donald Duck");
        expect($('#torrents').html()).not.to.contain("Saber Riders");
        window.location.href = $('#filters .seeding').attr('href');

        setTimeout(function() {
          expect($('#torrents').html()).not.to.contain("Mutant Ninja Turtles");
          expect($('#torrents').html()).to.contain("Donald Duck");
          expect($('#torrents').html()).not.to.contain("Saber Riders");
          window.location.href = $('#filters .paused').attr('href');

          setTimeout(function() {
            expect($('#torrents').html()).not.to.contain("Mutant Ninja Turtles");
            expect($('#torrents').html()).not.to.contain("Donald Duck");
            expect($('#torrents').html()).to.contain("Saber Riders");
            window.location.href = $('#filters .all').attr('href');

            setTimeout(function() {
              expect($('#torrents').html()).to.contain("Mutant Ninja Turtles");
              expect($('#torrents').html()).to.contain("Donald Duck");
              expect($('#torrents').html()).to.contain("Saber Riders");
              done();
            }, 50);
          }, 50);
        }, 50);
      }, 50);
    });
  });

  it('sorts torrents by name', function(done) {
    kettu.helpers.createTorrents([
      ["Mutant Ninja Turtles", {id: 1}],
      ["Donald Duck", {id: 2}],
      ["Saber Riders", {id: 3}]
    ]);

    kettu.helpers.waitForReload(function() {
      window.location.href = $('#sorts .name').attr('href');

      setTimeout(function() {
        expect($('#torrents').html()).to.match(/Donald Duck[\s|\S]*Mutant Ninja Turtles[\s|\S]*Saber Riders/);
        done();
      }, 50);
    });
  });

  it('sorts torrents by state', function(done) {
    kettu.helpers.createTorrents([
      ["Mutant Ninja Turtles", {id: 1, status: 4}],
      ["Donald Duck", {id: 2, status: 6}],
      ["Saber Riders", {id: 3, status: 0}]
    ]);

    kettu.helpers.waitForReload(function() {
      window.location.href = $('#sorts .state').attr('href');

      setTimeout(function() {
        expect($('#torrents').html()).to.match(/Saber Riders[\s|\S]*Mutant Ninja Turtles[\s|\S]*Donald Duck/);
        done();
      }, 50);
    });
  });

  it('sorts torrents by activity', function(done) {
    kettu.helpers.createTorrents([
      ["Mutant Ninja Turtles", {id: 1, rateDownload: 16000}],
      ["Donald Duck", {id: 2, rateDownload: 8000}],
      ["Saber Riders", {id: 3, rateDownload: 4000}]
    ]);

    kettu.helpers.waitForReload(function() {
      window.location.href = $('#sorts .activity').attr('href');

      setTimeout(function() {
        expect($('#torrents').html()).to.match(/Saber Riders[\s|\S]*Donald Duck[\s|\S]*Mutant Ninja Turtles/);
        done();
      }, 50);
    });
  });

  it('sorts torrents by age', function(done) {
    kettu.helpers.createTorrents([
      ["Mutant Ninja Turtles", {id: 1, addedDate: 87742}],
      ["Donald Duck", {id: 2, addedDate: 84253}],
      ["Saber Riders", {id: 3, addedDate: 81181}]
    ]);

    kettu.helpers.waitForReload(function() {
      window.location.href = $('#sorts .age').attr('href');

      setTimeout(function() {
        expect($('#torrents').html()).to.match(/Mutant Ninja Turtles[\s|\S]*Donald Duck[\s|\S]*Saber Riders/);
        done();
      }, 50);
    });
  });

  it('sorts torrents by progress', function(done) {
    kettu.helpers.createTorrents([
      ["Mutant Ninja Turtles", {id: 1, leftUntilDone: 6}],
      ["Donald Duck", {id: 2, leftUntilDone: 4}],
      ["Saber Riders", {id: 3, leftUntilDone: 0}]
    ]);

    kettu.helpers.waitForReload(function() {
      window.location.href = $('#sorts .progress').attr('href');

      setTimeout(function() {
        expect($('#torrents').html()).to.match(/Mutant Ninja Turtles[\s|\S]*Donald Duck[\s|\S]*Saber Riders/);
        done();
      }, 50);
    });
  });

  it('sorts torrents by queue', function(done) {
    kettu.helpers.createTorrents([
      ["Mutant Ninja Turtles", {id: 3, status: 4}],
      ["Donald Duck", {id: 2, status: 6}],
      ["Saber Riders", {id: 1, status: 0}]
    ]);

    kettu.helpers.waitForReload(function() {
      window.location.href = $('#sorts .queue').attr('href');

      setTimeout(function() {
        expect($('#torrents').html()).to.match(/Saber Riders[\s|\S]*Donald Duck[\s|\S]*Mutant Ninja Turtles/);
        done();
      }, 50);
    });
  });

  it('filter and sort at the same time', function(done) {
    kettu.helpers.createTorrents([
      ["Mutant Ninja Turtles", {id: 1, status: 4}],
      ["Donald Duck", {id: 2, status: 4}],
      ["Saber Riders", {id: 3, status: 0}]
    ]);

    kettu.helpers.waitForReload(function() {
      window.location.href = $('#sorts .name').attr('href');

      setTimeout(function() {
        window.location.href = $('#filters .downloading').attr('href');

        setTimeout(function() {
          expect($('#torrents').html()).not.to.contain("Saber Riders");
          expect($('#torrents').html()).to.match(/Donald Duck[\s|\S]*Mutant Ninja Turtles/);
          done();
        }, 50);
      }, 50);
    });
  });
});

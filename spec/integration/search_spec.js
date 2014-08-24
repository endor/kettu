describe('search torrents', function() {
  it('lets me search by name', function(done) {
    kettu.helpers.createTorrents([
      ["Mutant Ninja Turtles", {id: 1}],
      ["Donald Duck", {id: 2}],
      ["Saber Riders", {id: 3}]
    ]);

    kettu.helpers.waitForReload(function() {
      $('#search').val('Mu').trigger('keyup');

      setTimeout(function() {
        expect($('#1').css('display')).not.to.equal('none');
        expect($('#2').css('display')).to.equal('none');
        expect($('#3').css('display')).to.equal('none');
        done();
      }, 100);
    });
  });

  it('lets me search by trackers', function(done) {
    kettu.helpers.createTorrents([
      ["Mutant Ninja Turtles", {id: 4, trackerStats: [{"host": "MyFirstTracker"}]}],
      ["Donald Duck", {id: 5, trackerStats: [{"host": "MySecondTracker"}]}],
      ["Saber Riders", {id: 6, trackerStats: [{"host": "MyThirdTracker"}]}]
    ]);

    kettu.helpers.waitForReload(function() {
      $('#search').val('Second').trigger('keyup');

      setTimeout(function() {
        expect($('#4').css('display')).to.equal('none');
        expect($('#5').css('display')).not.to.equal('none');
        expect($('#6').css('display')).to.equal('none');
        done();
      }, 50);
    });
  });
});

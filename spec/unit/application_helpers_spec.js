describe("ApplicationHelpers", function() {
  var application_helpers = kettu.ApplicationHelpers;

  describe("hashDiff", function() {
    it("should return the differences between two hashes", function() {
      var differences = application_helpers.hashDiff({a: 1, b: 'string', c: false}, {a: 2, b: 'blub', c: true});
      expect(differences.a).to.equal(2);
      expect(differences.b).to.equal('blub');
      expect(differences.c).to.be(true);
    });

    it("should return an empty hash if there are no differences", function() {
      var differences = application_helpers.hashDiff({a: 1, b: 'string', c: false}, {a: 1, b: 'string', c: false});
      expect(differences).to.be(false);
    });
  });

  describe("inPixel", function() {
    it("returns 0 for strings not representing numbers", function() {
      expect(application_helpers.inPixel('')).to.equal(0);
    });

    it("returns 0 for units that are neither px nor em", function() {
      expect(application_helpers.inPixel('2%')).to.equal(0);
    });

    it("returns the correct pixels for a string representing px", function() {
      expect(application_helpers.inPixel('20.2px')).to.equal(20);
    });

    it("returns the correct pixels for a string representing em", function() {
      var originalFontSize = $('body').css('font-size');
      $('body').css('font-size', '10px');
      expect(application_helpers.inPixel('12em')).to.equal(120);
      $('body').css('font-size', originalFontSize);
    });
  });
});

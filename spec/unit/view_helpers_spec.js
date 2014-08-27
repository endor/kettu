describe("ViewHelpers", function() {
  var view_helpers = kettu.ViewHelpers;

  describe("sanitizeNumber'", function() {
    it("should return 0 if ratio is 0", function() {
      expect(view_helpers.sanitizeNumber(0)).to.equal(0);
    });

    it("should return the number if ratio is bigger than 0", function() {
      expect(view_helpers.sanitizeNumber(2.2)).to.equal(2.2);
    });

    it("should return N/A if ratio is -1", function() {
      expect(view_helpers.sanitizeNumber(-1)).to.equal('N/A');
    });

    it("should return Infinity if ratio is -2", function() {
      expect(view_helpers.sanitizeNumber(-2)).to.equal('Infinity');
    });
  });
});

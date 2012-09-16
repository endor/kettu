/*global describe, it, kettu*/

describe("ApplicationHelpers", function() {
  var application_helpers = kettu.ApplicationHelpers;

  describe("hashDiff", function() {
    it("should return the differences between two hashes", function() {
      var differences = application_helpers.hashDiff({a: 1, b: 'string', c: false}, {a: 2, b: 'blub', c: true});
      expect(differences['a']).to.equal(2);
      expect(differences['b']).to.equal('blub');
      expect(differences['c']).to.be(true);
    });
    
    it("should return an empty hash if there are no differences", function() {
      var differences = application_helpers.hashDiff({a: 1, b: 'string', c: false}, {a: 1, b: 'string', c: false});
      expect(differences).to.be(false);
    });
  });
});

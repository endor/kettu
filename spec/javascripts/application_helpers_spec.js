describe("ApplicationHelpers", function() {
  var application_helpers = kettu.ApplicationHelpers;

  describe("hashDiff", function() {
    it("should return the differences between two hashes", function() {
      differences = application_helpers.hashDiff({a: 1, b: 'string', c: false}, {a: 2, b: 'blub', c: true});
      expect(differences['a']).toEqual(2);
      expect(differences['b']).toEqual('blub');
      expect(differences['c']).toBe(true);
    });
    
    it("should return an empty hash if there are no differences", function() {
      differences = application_helpers.hashDiff({a: 1, b: 'string', c: false}, {a: 1, b: 'string', c: false});
      expect(differences).toBe(false);
    });
  });
});

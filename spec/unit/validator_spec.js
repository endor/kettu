describe("Validator", function() {
  var validator;

  beforeEach(function() {
    validator = new kettu.Validator();
  });

  it("should have no errors on a valid object", function() {
    var torrent = {'name': 'coffee', 'totalSize': 160, 'status': 8, 'rateUpload': 20};
    validator.schema = {
      'presence_of': ['name', 'status'],
      'numericality_of': ['totalSize', {'field': 'rateUpload', 'max': 20}],
      'inclusion_of': {'field': 'status', 'in': [1, 2, 4, 8, 16]}
    };
    validator.validate(torrent);
    expect(validator.errors).to.have.length(0);
  });

  it("should validate the presence of a single field", function() {
    var torrent = {};
    validator.schema = {
      'presence_of': 'name'
    };
    validator.validate(torrent);
    expect(validator.errors[0].field).to.equal('name');
    expect(validator.errors[0].message).to.equal('should not be empty');
  });

  it("should validate the presence of multiple fields", function() {
    var torrent = {};
    validator.schema = {
      'presence_of': ['name', 'status']
    };
    validator.validate(torrent);
    expect(validator.errors[0].field).to.equal('name');
    expect(validator.errors[1].field).to.equal('status');
  });

  it("should validate the numericality of a field", function() {
    var torrent = {'totalSize': 'abc'};
    validator.schema = {
      'numericality_of': 'totalSize'
    };
    validator.validate(torrent);
    expect(validator.errors[0].field).to.equal('totalSize');
    expect(validator.errors[0].message).to.equal('is not a valid number');
  });

  it("should validate the max value of a numeric field", function() {
    var torrent = {'totalSize': 100};
    validator.schema = {
      'numericality_of': {'field': 'totalSize', 'max': 99}
    };
    validator.validate(torrent);
    expect(validator.errors[0].field).to.equal('totalSize');
    expect(validator.errors[0].message).to.equal('is not a valid number');
  });

  it("should validate the numericality of multiple fields", function() {
    var torrent = {'totalSize': 'abc', 'status': 'def'};
    validator.schema = {
      'numericality_of': ['totalSize', 'status']
    };
    validator.validate(torrent);
    expect(validator.errors[0].field).to.equal('totalSize');
    expect(validator.errors[1].field).to.equal('status');
  });

  it("should validate the numericality of a missing field and throw an error", function() {
    var torrent = {};
    validator.schema = {
      'numericality_of': 'totalSize'
    };
    validator.validate(torrent);
    expect(validator.errors[0].field).to.equal('totalSize');
    expect(validator.errors[0].message).to.equal('is not a valid number');
  });

  it("should validate the numericality of null and throw an error", function() {
    var torrent = {'totalSize': null};
    validator.schema = {
      'numericality_of': 'totalSize'
    };
    validator.validate(torrent);
    expect(validator.errors[0].field).to.equal('totalSize');
    expect(validator.errors[0].message).to.equal('is not a valid number');
  });

  it("should validate the inclusion of a field", function() {
    var torrent = {'encryption': 'strong'};
    validator.schema = {
      'inclusion_of': {'field': 'encryption', 'in': ['required', 'preferred', 'tolerated']}
    };
    validator.validate(torrent);
    expect(validator.errors[0].field).to.equal('encryption');
    expect(validator.errors[0].message).to.equal('is not in the list of a valid values');
  });
});

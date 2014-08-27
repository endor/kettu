describe("SettingHelpers", function() {
  var setting_helpers = kettu.SettingHelpers,
      updatable_settings,
      params,
      hash;

  describe("speedLimitModeHash", function() {
    it("should return a hash with alt-speed-enabled set to true if given parameter is string true", function() {
      expect(setting_helpers.speedLimitModeHash("true")['alt-speed-enabled']).to.be(true);
    });

    it("should return a hash with alt-speed-enabled set to false if given parameter is string false", function() {
      expect(setting_helpers.speedLimitModeHash("false")['alt-speed-enabled']).to.be(false);
    });
  });

  describe("argumentsHash", function() {
    beforeEach(function() {
      updatable_settings = ['dht-enabled', 'pex-enabled', 'download-dir', 'peer-port'];
      params = {'dht-enabled': 'on', 'download-dir': '/downloads', 'peer-port': '5327'};
    });

    it("should set setting to false if it's not in the parameters", function() {
      hash = setting_helpers.argumentsHash(params, updatable_settings);
      expect(hash['pex-enabled']).to.be(false);
    });

    it("should set setting to true if it's 'on'", function() {
      hash = setting_helpers.argumentsHash(params, updatable_settings);
      expect(hash['dht-enabled']).to.be(true);
    });

    it("should set setting to a number if parameter is a string with only a number in it", function() {
      hash = setting_helpers.argumentsHash(params, updatable_settings);
      expect(hash['peer-port']).to.equal(5327);
    });

    it("should set setting to a string if it is a string", function() {
      hash = setting_helpers.argumentsHash(params, updatable_settings);
      expect(hash['download-dir']).to.equal('/downloads');
    });
  });
});

kettu.SettingsValidator = function() {
  this.schema = {
    'presence_of': [
      'peer-port', 'alt-speed-down','alt-speed-up', 'dht-enabled', 'download-dir',
      'encryption', 'peer-port', 'pex-enabled', 'speed-limit-down', 'speed-limit-down-enabled',
      'speed-limit-up', 'speed-limit-up-enabled', 'utp-enabled', 'peer-port-random-on-start',
      'port-forwarding-enabled', 'lpd-enabled', 'alt-speed-time-enabled', 'blocklist-enabled',
      'blocklist-url'
    ],
    'numericality_of': [
      {'field': 'peer-port', 'max': 65535},
      'speed-limit-down', 'speed-limit-up', 'alt-speed-down', 'alt-speed-up'
    ],
    'inclusion_of': {'field': 'encryption', 'in': ['required', 'preferred', 'tolerated']}
  };
};

kettu.SettingsValidator.prototype = kettu.Validator.prototype;

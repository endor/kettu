var SettingsValidator = function() {
  this.schema = {
    'presence_of': [
      'peer-port', 'alt-speed-down','alt-speed-up', 'dht-enabled', 'download-dir', 
      'encryption', 'peer-port', 'pex-enabled', 'speed-limit-down', 'speed-limit-down-enabled',
      'speed-limit-up', 'speed-limit-up-enabled'
    ],
    'numericality_of': [
      {'field': 'peer-port', 'max': 65535},
      'reload-interval', 'speed-limit-down', 'speed-limit-up', 'alt-speed-down', 'alt-speed-up'
    ],
    'inclusion_of': {'field': 'encryption', 'in': ['required', 'preferred', 'tolerated']}    
  }
};

SettingsValidator.prototype = Validator.prototype;
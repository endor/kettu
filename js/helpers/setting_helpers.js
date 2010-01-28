var SettingHelpers = {
  activateSettingsLink: function() {
    var context = this;
    $('#settings').click(function() {
      if(context.infoIsOpen()) {
        context.closeInfo();
      } else {
        window.location.hash = '/settings';
      }
      return false;
    });
  },
  
  updateSettingsCheckboxes: function(settings) {
    $.each($('#info').find('input[type=checkbox]'), function() {
      var name = $(this).attr('name');
      if(settings[name]) {
        $(this).attr('checked', 'checked');
      }
    });
    $('#info input').change(function(event) {
      $(this).parents('form').trigger('submit');
      return false;
    });
  },
  
  arguments_hash: function(updatable_settings, params) {
    var hash = {};

    $.each(updatable_settings, function() {
      var setting = this;
      hash[setting] = (params[setting]) ? true : false;
      if(params[setting] && params[setting].match(/^\d+$/)) {
        hash[setting] = parseInt(params[setting]);
      } else if(params[setting] && params[setting] != "on") {
        hash[setting] = params[setting];
      }
    });
    
    return hash;
  }
  
}
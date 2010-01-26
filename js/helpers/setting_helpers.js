var SettingHelpers = {
  updateSettings: function() {
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
    $('#info input').change(function() {
      $(this).parents('form').trigger('submit');
    });
  }
}
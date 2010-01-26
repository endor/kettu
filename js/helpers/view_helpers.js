var ViewHelpers = {
  highlightLink: function(menu_id, element_class) {
    $(menu_id + ' a').removeClass('active');
    $(menu_id + ' ' + element_class).addClass('active');
  },
  
  highlightLi: function(menu_id, li) {
    $(menu_id + ' li').removeClass('active');
    $(li).addClass('active');
  },
  
  showAndHideFlash: function(message) {
    $('#flash').html(message);
    $('#flash').show();
    setTimeout("$('#flash').fadeOut('slow')", 3000);    
  }
};
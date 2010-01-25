var InfoHelpers = {
  closeInfo: function() {
    $('#torrents').css('width', '100%');
    var info = $('#info');
    info.html('');
    info.hide();
    window.location.hash = '/torrents'; 
    return false;
  },

  openInfo: function(view) {
    var info = $('#info');
    info.html(view);
    info.show();
    this.menuize($('#info .header'));
  },

  menuize: function(menu_elements) {
    menu_elements.click(function() {
      $(this).parent().next().toggle('slow');
      $(this).toggleClass('active');
  		return false;
    }).parent().next().hide();    
  },
  
  infoIsOpen: function() {
    return $('#info').is(':visible');
  },

  rebindForms: function() {
    var context = this;
    var forms = context.$element().find('form:not(.' + context.app.eventNamespace() + ')')
    forms.bind('submit', function() {
      return context.app._checkFormSubmission(this);
    }).addClass(context.app.eventNamespace());
  },
  
  updateInfo: function(torrent) {
    var context = this;
    context.rebindForms();
    
    $('#' + torrent.id).click(function(event) {
      context.highlightLi('#torrents', this);
      if(context.infoIsOpen()) {
        window.location.hash = '/torrents/' + $(this).attr('id');
      }
    });
    // TODO: triple double clicking doesnt work
    $('#' + torrent.id).dblclick(function() {
      if(context.infoIsOpen()) {
        context.closeInfo();
      } else {
        var active_torrent = $('.torrent.active');
        if(active_torrent.get(0)) {
          window.location.hash = '/torrents/' + active_torrent.attr('id');
        }        
      }
      return false;
    });
  }
};
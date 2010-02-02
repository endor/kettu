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
  },

  menuizeInfo: function() {
    $('#info .menu-item').click(function() {
      $('#info .menu-item').removeClass('active');
      $(this).addClass('active');
      var item = $(this).attr('data-item');
      $('#info .item').hide();
      $('#info .' + item).show();
    });
    $('#info .item').hide();
    $('#info .item:first').show();
    $('#info .menu-item:first').addClass('active');    
  },
  
  drawPie: function(id, data) {
    var bluffGraph = new Bluff.Pie(id, 300);
    bluffGraph.set_theme({
      colors: ['#B2DFEE', '#FFEC8B', '#BCEE68'],
      marker_color: '#aea9a9',
      font_color: '#555555',
      background_colors: ['#F8F8F8', '#FFFFFF']
    });
    for(label in data) {
      bluffGraph.data(label, data[label]);      
    }
    bluffGraph.draw();    
  },
  
  activateLinks: function() {
    this.activateAddTorrentLink();
    this.activateSettingsLink();
    this.activateStatisticsLink();
    this.activateTurtleModeLink();
  }
};
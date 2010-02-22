var StatisticHelpers = {
  activateStatisticsLink: function() {
    var context = this;
    $('#statistics').click(function() {
      if(context.infoIsOpen()) {
        context.closeInfo();
      } else {
        context.redirect('#/statistics');
      }
      return false;
    });
  },
  
  drawGraphs: function() {
    this.drawPie('torrents_by_status', {
      'Downloading': ($('.downloading').length - 1),
      'Seeding': ($('.seeding').length - 1),
      'Paused': ($('.paused').length - 1)
    });
    this.drawLines('up_and_download_stats', {
      'Upload': $.map(transmission.store.get('up_and_download_rate'), function(item) { return (item.up / 1024); }),
      'Download': $.map(transmission.store.get('up_and_download_rate'), function(item) { return (item.down / 1024); })
    });
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
  
  drawLines: function(id, data) {
    var bluffGraph = new Bluff.Line(id, 300);
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
  }
}
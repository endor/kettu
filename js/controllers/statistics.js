Statistics = function(sammy) { with(sammy) {
  get('#/statistics', function() {
    var context = this;    
    var view = {
      'numberOfTorrents': $('.torrent').length
    }
    
    context.partial('./templates/statistics/index.mustache', view, function(rendered_view) {
      context.openInfo(rendered_view);
    });
  });
}};
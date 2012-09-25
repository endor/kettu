/*global kettu*/

kettu.DraggingHelpers = {
  handleDragging: function() {
    var context = this,
      torrents = $('#torrents');

    torrents.mousedown(function(event) {
      var closest_torrent = $(event.target).closest('.torrent');
      context.original_position = closest_torrent.position().top;
      context.closest_torrent = closest_torrent;

  		// NOTE: this might be slow for lots of torrents
  		//       maybe there's a faster way to do this?
      torrents.mousemove(function(event) {
        context.closest_torrent.addClass('active');
        
        var y1 = context.original_position;
        var y2 = $(event.target).closest('.torrent').position().top;

    		if(y2 < y1) { var tmp = y1; y1 = y2; y2 = tmp; }
        
        $('.torrent:visible').each(function() {
          var position = $(this).position();          
          if(position.top < y2 && position.top > y1) {
            $(this).addClass('active');
          }
        });
      });
      
      event.preventDefault();
    });

    var unbindMouseMove = function() {
      torrents.unbind('mousemove');
      context.closest_torrent = null;
      context.original_position = null;
    };
    
    $('body').mouseup(unbindMouseMove);
    torrents.mouseup(unbindMouseMove);
  }
};
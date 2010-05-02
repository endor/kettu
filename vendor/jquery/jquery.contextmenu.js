(function($) {
  $.fn.contextMenu = function(options) {
    var menu = $(options.menu);
    menu.click(function(event) {
     event.stopPropagation();
    });

    $(this).bind('contextmenu', function(event) {
      if(options.onContextMenu) { options.onContextMenu(event); }

      menu.find('li').hover(
        function() { $(this).addClass('hover'); },
        function(){ $(this).removeClass('hover'); }
      );

      menu.find('form').submit(function() {
        menu.hide();
        return true;
      });
      
      menu.find('a').click(function() {
        menu.hide();
        return true;
      });

      $(document).keyup(function(event) {
        switch(event.keyCode) {
          case 27:
            menu.hide();
            break;
        }
      });
			
      menu.css({
        left: event.pageX - 170,
        top: event.pageY - 150
      }).show();
      $(document).one('click', function() { menu.hide(); })      
      
      return false;
    });
      
    return this;
  };
})(jQuery);
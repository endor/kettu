(function($) {
  $.fn.contextMenu = function(options) {
    var menu = $(options.menu);
    menu.click(function(e) {
     e.stopPropagation();
    });

    $(this).bind('contextmenu', function(e) {
      if(options.onContextMenu) {
        options.onContextMenu(e);
      }

      menu.find('li').hover(
        function() { $(this).addClass('hover'); },
        function(){ $(this).removeClass('hover'); }
      );

      menu.find('form').submit(function() {
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
        left: e.pageX - 170,
        top: e.pageY - 150
      }).show();
      $(document).one('click', function() { menu.hide(); })			

      return false;
    });
      
    return this;
  };
})(jQuery);
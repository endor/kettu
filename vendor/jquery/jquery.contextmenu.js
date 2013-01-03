(function($) {
  $.fn.contextMenu = function(options) {
    var menu = $(options.menu);

    $(this).bind('contextmenu', function(event) {
      if(options.onContextMenu) { options.onContextMenu(event); }

      var callback = function() {
          menu.hide();
          return true;
      };

      menu.find('form').submit(callback);
      menu.find('a').click(callback);

      $(document).keyup(function(event) {
        if(event.keyCode === 27) {
            callback();
        }
      });

      menu.css({
        left: event.pageX,
        top: event.pageY
      }).show();

      $(document).one('click', callback);

      return false;
    });

    return this;
  };
})(jQuery);

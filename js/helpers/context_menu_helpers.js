var ContextMenuHelpers = {
  activateContextMenu: function() {
    var context = this;
    
    $('#torrents').contextMenu({
      menu: '#context_menu',
      onContextMenu: function(event) {
        highlight_closest_torrent(event);
        put_selected_ids_into_form();
        add_names_to_delete_form();
        
        function highlight_closest_torrent(event) {
          var closest_torrent = $(event.target).closest('.torrent');
          if($('.torrent.active').length == 0 || !closest_torrent.hasClass('active')) {
            context.highlightTorrents(closest_torrent);
          }
        };
        
        function put_selected_ids_into_form() {
          var selected_ids = $.map($('.torrent.active'), function(torrent) {return $(torrent).attr('id')}).join(',');
          $('#context_menu form .ids').val(selected_ids);
        };
        
        function add_names_to_delete_form() {
          var selected_names = $.map($('.torrent.active'), function(torrent) { return $(torrent).find('.name').text(); }).join('<br />');
          $('#context_menu #delete_form .message').html("Are you sure, you want to delete the following torrents?<br /><br />" + selected_names);
        };
      }
    });
  }
}
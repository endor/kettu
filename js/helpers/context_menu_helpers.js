var ContextMenuHelpers = {
  hideContextMenu: function() {
    $('#context_menu').hide();
  },
  
  activateContextMenu: function() {
    var context = this;
    
    $('#torrents').contextMenu({
      menu: '#context_menu',
      onContextMenu: function(event) {
        $('#context_menu .pause').show();
        $('#context_menu .activate').show();
        
        highlight_closest_torrent(event);
        put_selected_ids_into_form();
        add_names_to_delete_form();
        if($('.torrent').length == $('.torrent.active').length) {
          $('#context_menu .select_all a').removeClass('select_all_link').addClass('deselect_all_link').text('Deselect All');
        } else {
          $('#context_menu .select_all a').removeClass('deselect_all_link').addClass('select_all_link').text('Select All');
        }
        activate_select_all_link();
        hide_pause_or_delete_form();
        
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
        
        function activate_select_all_link() {
          $('#context_menu .select_all_link').click(function() {
            $('.torrent').addClass('active');
          });
          $('#context_menu .deselect_all_link').click(function() {
            $('.torrent').removeClass('active');
          });
        };
        
        function hide_pause_or_delete_form() {
          if($('.torrent.active').length == $('.torrent.active.paused').length) {
            $('#context_menu .pause').hide();
          }
          
          var not_paused = $('.torrent.active.downloading').length + $('.torrent.active.seeding').length;
          if($('.torrent.active').length == not_paused) {
            $('#context_menu .activate').hide();
          }
        };
      }
    });
  }
}
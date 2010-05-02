var TorrentDetailsHelpers = {
  render_torrent_details_in_view: function(context, rendered_view, torrent) {
    context.openInfo(rendered_view);
    context.startCountDownOnNextAnnounce();
    context.activateInfoInputs(torrent);
    context.activateFileInputs();
    if(context.params['sort_peers']) { $('#menu-item-peers').click(); }
  },
  
  update_torrent_details_in_view: function(context, rendered_view) {
    rendered_view = $('<div>' + rendered_view + '</div>');
    $.each(['.activity', '.trackers', '.peers'], function() {
      $('#info ' + this.toString()).html(rendered_view.find(this.toString()).html());
    });
    $.each(rendered_view.find('.file'), function() {
      $('#info #' + $(this).attr('id')).siblings('.percent_done').html($(this).siblings('.percent_done').html());
    });
    context.startCountDownOnNextAnnounce();
    if(context.params['sort_peers']) { $('#menu-item-peers').click(); }
  }
}
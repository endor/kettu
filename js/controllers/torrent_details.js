TorrentDetails = function(transmission) { with(transmission) {
  var context;
  
  before(function() {
    context = this;
  });
  
  get('#/torrent_details', function() {
    var active_torrents = $('.torrent.active');
    switch(active_torrents.length) {
      case 0:
        context.partial('./templates/torrent_details/no_torrents_selected.mustache', {}, function(view) {
          context.openInfo(view);
        });
        break;
      case 1:
        context.redirect('#/torrents/' + active_torrents.attr('id'));
        break;
      default:
        var ids = $.map(active_torrents, function(torrent) { return parseInt($(torrent).attr('id'), 10); });
        var accumulation = {number_of_torrents: 0, size: 0, status_words: [],
                            downloaded: 0, uploaded: 0, ratio: 0};
        accumulate_torrents_and_render_result(ids, accumulation);
        break;
    }    
  });
  
  function accumulate_torrents_and_render_result(torrents, accumulation) {
    if(torrents.length == 0) {
      var view = TorrentDetailsView(accumulation);
      context.partial('./templates/torrent_details/index.mustache', view, function(rendered_view) {
        context.openInfo(rendered_view);
      });      
    } else {
      var fields = Torrent({})['fields'].concat(Torrent({})['info_fields']);
      var request = context.build_request('torrent-get', {'ids': torrents.shift(), 'fields': fields});
      context.remote_query(request, function(response) {
        var torrent = response['torrents'].map( function(row) {return Torrent(row);} )[0];
        accumulation.number_of_torrents += 1;
        accumulation.size += torrent.sizeWhenDone;
        accumulation.status_words.push(torrent.statusStringLocalized());
        accumulation.downloaded += (torrent.sizeWhenDone - torrent.leftUntilDone);
        accumulation.uploaded += torrent.uploadedEver;
        accumulate_torrents_and_render_result(torrents, accumulation);
      });
    }
  };
}};
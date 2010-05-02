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
        context.redirect('#/torrent_details/' + active_torrents.attr('id'));
        break;
      default:
        var ids = $.map(active_torrents, function(torrent) { return parseInt($(torrent).attr('id'), 10); });
        var accumulation = {number_of_torrents: 0, size: 0, status_words: [],
                            downloaded: 0, uploaded: 0, ratio: 0, secure: [],
                            left_until_done: 0, rate_download: 0, rate_upload: 0,
                            peers_upload: 0, peers_download: 0};
        accumulate_torrents_and_render_result(ids, accumulation);
        break;
    }    
  });
  
  function accumulate_torrents_and_render_result(torrents, accumulation) {
    if(torrents.length == 0) {
      var view = TorrentDetailsView(accumulation);
      context.partial('./templates/torrent_details/index.mustache', view, function(rendered_view) {
        context.openInfo(rendered_view);
        if(transmission.last_menu_item) { $('#' + transmission.last_menu_item).click(); }
      });      
    } else {
      var fields = Torrent({})['fields'].concat(Torrent({})['info_fields']);
      var request = context.build_request('torrent-get', {'ids': torrents.shift(), 'fields': fields});
      context.remote_query(request, function(response) {
        var torrent = response['torrents'].map( function(row) {return Torrent(row);} )[0];
        accumulation.number_of_torrents += 1;
        accumulation.size += torrent.sizeWhenDone;
        accumulation.status_words.push(torrent.statusStringLocalized());
        accumulation.secure.push(torrent.secure());
        accumulation.downloaded += (torrent.sizeWhenDone - torrent.leftUntilDone);
        accumulation.uploaded += torrent.uploadedEver;
        accumulation.left_until_done += torrent.leftUntilDone;
        accumulation.rate_download += torrent.rateDownload;
        accumulation.rate_upload += torrent.rateUpload;
        accumulation.peers_upload += torrent.peersGettingFromUs;
        accumulation.peers_download += torrent.peersSendingToUs;
        accumulate_torrents_and_render_result(torrents, accumulation);
      });
    }
  };

  get('#/torrent_details/:id', function() {
    var id = parseInt(context.params['id'], 10);
    
    get_and_render_torrent_details(id, 'render_torrent_details_in_view');
    if(transmission.info_interval_id) { clearInterval(transmission.info_interval_id); }
    transmission.info_interval_id = setInterval("get_and_render_torrent_details(" + id + ", 'update_torrent_details_in_view')", context.reload_interval);
  });
  
  get_and_render_torrent_details = function(id, callback) {
    var fields = Torrent({})['fields'].concat(Torrent({})['info_fields']);
    var request = context.build_request('torrent-get', {'ids': id, 'fields': fields});

    context.remote_query(request, function(response) {
      var torrent = response['torrents'].map( function(row) {return Torrent(row);} )[0];
      var view = TorrentView(torrent, context, context.params['sort_peers']);
      var template = torrent.hasError() ? 'show_with_errors' : 'show';
      var partial = './templates/torrent_details/file.mustache';
      
      context.partial('./templates/torrent_details/' + template + '.mustache', view, function(rendered_view) {
        context[callback].call(this, context, rendered_view, torrent);
      }, {file: partial});      
    });
  };
}};
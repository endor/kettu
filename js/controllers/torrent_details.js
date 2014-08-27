kettu.TorrentDetails = function(transmission) {
  transmission.get('#/torrent_details', function(context) {
    var active_torrents = $('.torrent.active');

    switch(active_torrents.length) {
      case 0:
        context.render('templates/torrent_details/no_torrents_selected.mustache', {}, function(view) {
          context.openInfo(view, 'details');
        });
        break;
      case 1:
        context.redirect('#/torrent_details/' + active_torrents.attr('id'));
        break;
      default:
        kettu.app.trigger('refresh-torrent-details');
        break;
    }
  });

  transmission.get('#/torrent_details/:id', function(context) {
    var id = parseInt(context.params.id, 10);

    kettu.app.trigger('get-torrent-details', {id: id, callback: 'renderTorrentDetailsInView'});

    if(kettu.app.info_interval_id) { clearInterval(kettu.app.info_interval_id); }
    kettu.app.info_interval_id = setInterval(
      "kettu.app.trigger('get-torrent-details', {id: " + id + ", callback: 'updateTorrentDetailsInView'})",
      kettu.app.reloadInterval
    );
  });

  transmission.bind('get-torrent-details', function(e, params) {
    var context = this,
        fields = _.union(kettu.Torrent.fields, kettu.Torrent.infoFields),
        request = context.buildRequest('torrent-get', {ids: params.id, fields: fields});

    context.remoteQuery(request, function(response) {
      var torrent = _.map(response.torrents, function(row) {return kettu.Torrent(row);})[0];
      kettu.app.trigger('refresh-torrent-details', {torrent: torrent, callback: params.callback});
    });
  });

  transmission.bind('refresh-torrent-details', function(e, params) {
    var context = this,
      active_torrents = $('.torrent.active');

    if(active_torrents.length > 1) {
      if(context.infoIsOpen() && context.infoDisplaysInspector()) {
        var ids = $.map(active_torrents, function(torrent) {
          return parseInt($(torrent).attr('id'), 10);
        });

        if(kettu.app.info_interval_id) { clearInterval(kettu.app.info_interval_id); }
        context.saveLastMenuItem($('.menu-item.active'));
        context.accumulateTorrentsAndRenderResult(ids, context.emptyAccumulationHash());
      }
    } else {
      var view = kettu.TorrentView(params.torrent, context, context.params.sort_peers),
          template = params.torrent.hasError() ? 'show_with_errors' : 'show',
          file_partial = 'templates/torrent_details/file.mustache';

      context.render('templates/torrent_details/' + template + '.mustache', view, function(rendered_view) {
        context[params.callback].call(context, rendered_view, params.torrent);
      }, {file: file_partial});
    }
  });
};

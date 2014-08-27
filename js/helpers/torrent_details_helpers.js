kettu.TorrentDetailsHelpers = {
  emptyAccumulationHash: function() {
    return {number_of_torrents: 0, size: 0, status_words: [], downloaded: 0, uploaded: 0, ratio: 0, secure: [],
            left_until_done: 0, rate_download: 0, rate_upload: 0, peers_upload: 0, peers_download: 0};
  },

  renderTorrentDetailsInView: function(rendered_view, torrent) {
    this.openInfo(rendered_view, 'details');
    this.startCountDownOnNextAnnounce();
    this.activateInfoInputs(torrent);
    this.activateFileInputs();
    this.activatePrioritySelects();
    if(this.params.sort_peers) { $('#menu-item-peers').click(); }
  },

  updateTorrentDetailsInView: function(rendered_view) {
    rendered_view = $('<div>' + rendered_view + '</div>');

    _.each(['.activity', '.trackers', '.peers'], function(clazz) {
      $('#info ' + clazz).html(rendered_view.find(clazz).html());
    });

    var updateFields = function(checkbox, field) {
      checkbox.siblings('.percent_done').html($(field).siblings('.percent_done').html());
      checkbox.siblings('.priority_hidden').replaceWith($(field).siblings('.priority_hidden'));
      checkbox.siblings('img.priority').attr('src', $(field).siblings('img.priority').attr('src'));
      checkbox.attr('checked', $(field).attr('checked'));
    };

    $.each(rendered_view.find('.file'), function(idx, file) {
      var checkbox = $('#info #' + $(file).attr('id'));
      updateFields(checkbox, file);
    });

    $.each(rendered_view.find('.folder-check'), function(idx, folder) {
      var checkbox = $('#info .folder-check[name="' + $(folder).attr('name') + '"]');
      updateFields(checkbox, folder);
    });

    this.startCountDownOnNextAnnounce();

    if(this.params.sort_peers) { $('#menu-item-peers').click(); }
  },

  accumulateTorrentsAndRenderResult: function(torrents, accumulation) {
    var context = this;

    if(torrents.length === 0) {
      var view = kettu.TorrentDetailsView(accumulation);

      context.render('templates/torrent_details/index.mustache', view, function(rendered_view) {
        context.openInfo(rendered_view, 'details');
        if(kettu.app.last_menu_item) {
          var contextMenuWasOpen = context.contextMenuIsOpen();
          $('#' + kettu.app.last_menu_item).click();

          if(contextMenuWasOpen) {
            context.reactivateContextMenu();
          }
        }
      });
    } else {
      var fields = kettu.Torrent.fields.concat(kettu.Torrent.infoFields),
        request = context.buildRequest('torrent-get', {ids: torrents.shift(), fields: fields});
      context.remoteQuery(request, function(response) {
        var torrent = response.torrents.map( function(row) {return kettu.Torrent(row);} )[0];
        accumulation.number_of_torrents += 1;
        accumulation.size += torrent.sizeWhenDone;
        accumulation.status_words.push(torrent.statusWord());
        accumulation.secure.push(torrent.secure());
        accumulation.downloaded += (torrent.sizeWhenDone - torrent.leftUntilDone);
        accumulation.uploaded += torrent.uploadedEver;
        accumulation.left_until_done += torrent.leftUntilDone;
        accumulation.rate_download += torrent.rateDownload;
        accumulation.rate_upload += torrent.rateUpload;
        accumulation.peers_upload += torrent.peersGettingFromUs;
        accumulation.peers_download += torrent.peersSendingToUs;
        context.accumulateTorrentsAndRenderResult(torrents, accumulation);
      });
    }
  }
};

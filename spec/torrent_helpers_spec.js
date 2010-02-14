describe 'TorrentHelpers'
  before_each
    $('body').append(elements(fixture('torrents')).get(0))
    old_torrents = $('.torrent')
    torrent_helpers = TorrentHelpers
  end

  after_each
    $('body').find('#torrents').remove()
  end

  describe 'updateTorrents'
    before_each
      var templates = {}
      templates['torrent_show'] = fixture('../templates/torrents/show.mustache')
      templates['pause_and_activate_button'] = fixture('../templates/torrents/pause_and_activate_button.mustache')
      torrent_helpers.cache = function(partial) { return templates[partial]; }
      torrent_helpers.updateInfo = function() {}
      statusWord = function() {return 'seeding';}
    end
    
    it 'should add a new torrent if it came in with the update and is not on the site yet'
      updated_torrents = [
        {'id': 1, 'statusWord': statusWord},
        {'id': 2, 'statusWord': statusWord},
        {'id': 3, 'statusWord': statusWord},
        {'id': 4, 'statusWord': statusWord}
      ]
      torrent_helpers.updateTorrents(updated_torrents)
      $('#4').get(0).should_not.be_undefined
    end
    
    it 'should remove an old torrent that did not come in with the update but is still on the site'
      updated_torrents = [{'id': 2, 'statusWord': statusWord}]
      torrent_helpers.updateTorrents(updated_torrents)
      $('#1').get(0).should.be_undefined
    end
    
    it 'should update the torrents\' data'
      updated_torrents = [
        {'id': 1, 'statusWord': statusWord, 'statusString': 'Seeding - DL: 0.0 KB/s, UL: 20.0 KB/s'},
        {'id': 2, 'statusWord': statusWord}
      ]
      torrent_helpers.updateTorrents(updated_torrents)
      $('.statusString:first').html().should.match(/20\.0 KB\/s/)
    end
    
    it 'should remove the meta status if downloading started'
      updated_torrents = [
        Torrent({'id': 3, 'status': 4, 'metadataPercentComplete': 1})
      ]
      torrent_helpers.updateTorrents(updated_torrents)
      $('#3').find('.progressDetails').html().should_not.match(/metadata/)
      $('#3').find('.progressbar').find('.ui-widget-header-meta').get(0).should.be_undefined
    end
  end
end

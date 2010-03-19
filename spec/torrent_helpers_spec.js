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
      torrent_helpers.templates = {}
      torrent_helpers.templates['show'] = fixture('show.mustache')
      torrent_helpers.templates['pause_and_activate_button'] = fixture('pause_and_activate_button.mustache')
      torrent_helpers.cache = function(partial) { return this.templates[partial]; }
      torrent_helpers.cache_partial = function() {}
      torrent_helpers.updateInfo = function() {}
      torrent_helpers.clearCache = function() {}
      torrent_helpers.mustache = function(template, view) {return Mustache.to_html(template, view);}
      statusWord = function() {return 'seeding';}
      transmission = {'view_mode': 'normal'}
    end
    
    it 'should add a new torrent if it came in with the update and is not on the site yet'
      updated_torrents = [
        Torrent({'id': 1, 'status': 8}),
        Torrent({'id': 2, 'status': 8}),
        Torrent({'id': 3, 'status': 8}),
        Torrent({'id': 4, 'status': 8})
      ]
      torrent_helpers.updateTorrents(updated_torrents)
      $('#4').get(0).should_not.be_undefined
    end
    
    it 'should remove an old torrent that did not come in with the update but is still on the site'
      updated_torrents = [Torrent({'id': 2, 'status': 8})]
      torrent_helpers.updateTorrents(updated_torrents)
      $('#1').get(0).should.be_undefined
    end
    
    it 'should update the torrents\' data'
      updated_torrents = [
        Torrent({'id': 2, 'status': 8, 'rateUpload': 20000, 'rateDownload': 0})
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
  
  describe 'formatNextAnnounceTime'
    it 'should return a formatted time for the given nextAnnounceTime'
      in_fifteen_minutes = new Date().getTime() + 900000
      timestamp = (new Date(in_fifteen_minutes).getTime()/1000).toFixed(0)
      torrent_helpers.formatNextAnnounceTime(timestamp).should.eql("15 min, 0 sec")
    end
  end
  
end
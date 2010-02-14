describe 'TorrentView'
  describe 'pauseAndActivateButton'
    before_each
      forms                 = elements(fixture('torrents_view_forms')).find('form')
      stop_form             = $(forms.get(0))
      start_form            = $(forms.get(1))
      context               = {}
      context.cache_partial = function() {}
      context.cache         = function() { return fixture('../templates/torrents/pause_and_activate_button.mustache'); }
      torrent_view          = TorrentView({}, context)
    end
    
    it 'should return a form to pause the torrent if the torrent is active'
      torrent_view.id = 567;
      torrent_view.status = Torrent({}).stati['downloading'];
      torrent_view.pauseAndActivateButton().should.match(new RegExp(stop_form));
    end

    it 'should return a form to start the torrent if the torrent is paused and not done downloading'
      torrent_view.id = 567;
      torrent_view.status = Torrent({}).stati['paused'];
      torrent_view.pauseAndActivateButton().should.match(new RegExp(start_form));
    end
    
    it 'should return a form to start the torrent if the torrent is paused and done downloading'
      torrent_view.id = 567;
      torrent_view.status = Torrent({}).stati['paused'];
      torrent_view.leftUntilDone = 0;
      torrent_view.pauseAndActivateButton().should.match(new RegExp(start_form));
    end
  end
  
  describe 'addFormattedTimes'
    before_each
      context               = {}
      context.cache_partial = function() {}
      context.cache         = function() { return fixture('../templates/torrents/pause_and_activate_button.mustache'); }
      torrent_view          = TorrentView({'trackerStats': []}, context)
    end
    
    it 'should add a formatted time for lastAnnounceTime'
      torrent_view.trackerStats[0] = {}
      torrent_view.trackerStats[0]['lastAnnounceTime'] = "1265737984"
      torrent_view.addFormattedTimes()
      torrent_view.trackerStats[0].lastAnnounceTimeFormatted.should.eql("2/9/2010 19:53")
    end
    
    it 'should add a formatted time for nextAnnounceTime'
      torrent_view.trackerStats[0] = {}
      torrent_view.trackerStats[0]['nextAnnounceTime'] = "1265737984"
      torrent_view.addFormattedTimes()
      torrent_view.trackerStats[0].nextAnnounceTimeFormatted.should.eql("2/9/2010 19:53")
    end
    
    it 'should add a formatted time for lastScrapeTime'
      torrent_view.trackerStats[0] = {}
      torrent_view.trackerStats[0]['lastScrapeTime'] = "1265737984"
      torrent_view.addFormattedTimes()
      torrent_view.trackerStats[0].lastScrapeTimeFormatted.should.eql("2/9/2010 19:53")
    end
  end
end
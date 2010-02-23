describe 'TorrentView'
  before_each
    context               = {}
    context.formatNextAnnounceTime = function() {}
    torrent_view          = TorrentView({'trackerStats': [], 'files': [], 'peers': []}, context)
    timestamp             = "1265737984"
    hours                 = 17 - (new Date).getTimezoneOffset()/60
    if(hours > 23) { hours -= 24; }
    day                   = (new Date).getTimezoneOffset()/60 < -6 ? 10 : 9
  end

  describe 'addFormattedTimes'
    it 'should add a formatted time for lastAnnounceTime'
      torrent_view.trackerStats[0] = {}
      torrent_view.trackerStats[0]['lastAnnounceTime'] = timestamp
      torrent_view.addFormattedTimes()
      torrent_view.trackerStats[0].lastAnnounceTimeFormatted.should.eql("2/" + day + "/2010 " + hours + ":53")
    end
    
    it 'should add a formatted time for lastScrapeTime'
      torrent_view.trackerStats[0] = {}
      torrent_view.trackerStats[0]['lastScrapeTime'] = timestamp
      torrent_view.addFormattedTimes()
      torrent_view.trackerStats[0].lastScrapeTimeFormatted.should.eql("2/" + day + "/2010 " + hours + ":53")
    end
  end
  
  describe 'addFormattedSizes'
    describe 'files'
      it 'should add a formatted size for length'
        torrent_view.files[0] = {}
        torrent_view.files[0]['length'] = 2048
        torrent_view.addFormattedSizes()
        torrent_view.files[0].lengthFormatted.should.eql('2.0 KB')
      end
    
      it 'should add a percent done value'
        torrent_view.files[0] = {'length': 2048, 'bytesCompleted': 512}
        torrent_view.addFormattedSizes()
        torrent_view.files[0].percentDone.should.eql('25')
      end
    end
    
    describe 'peers'
      it 'should add a percent done value'
        torrent_view.peers[0] = {'progress': 0.7}
        torrent_view.addFormattedSizes()
        torrent_view.peers[0].percentDone.should.eql('70')
      end
      
      it 'should add a formatted upload value'
        torrent_view.peers[0] = {'rateToPeer': 20}
        torrent_view.addFormattedSizes()
        torrent_view.peers[0].uploadFormatted.should.eql('20 bytes')
      end
      
      it 'should add an empty string if upload value is 0'
        torrent_view.peers[0] = {'rateToPeer': 0}
        torrent_view.addFormattedSizes()
        torrent_view.peers[0].uploadFormatted.should.eql('')
      end
      
      it 'should add a formatted download value'
        torrent_view.peers[0] = {'rateToClient': 20}
        torrent_view.addFormattedSizes()
        torrent_view.peers[0].downloadFormatted.should.eql('20 bytes')
      end
    end
  end
end
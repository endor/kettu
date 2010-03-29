describe 'TorrentView'
  before_each
    context               = {}
    context.formatNextAnnounceTime = function() {}
    torrent_view          = TorrentView({'trackerStats': [], 'files': [], 'peers': [], 'fileStats': []}, context)
    timestamp             = "1265737984"
    day                   = (new Date).getTimezoneOffset()/60 < -6 ? 10 : 9
  end

  describe 'addFormattedTimes'
    it 'should add a formatted time for lastAnnounceTime'
      torrent_view.trackerStats[0] = {}
      torrent_view.trackerStats[0]['lastAnnounceTime'] = timestamp
      torrent_view.addFormattedTimes()
      torrent_view.trackerStats[0].lastAnnounceTimeFormatted.should.match(new RegExp("2/" + day + "/2010 \\d+:53"))
    end
    
    it 'should add a formatted time for lastScrapeTime'
      torrent_view.trackerStats[0] = {}
      torrent_view.trackerStats[0]['lastScrapeTime'] = timestamp
      torrent_view.addFormattedTimes()
      torrent_view.trackerStats[0].lastScrapeTimeFormatted.should.match(new RegExp("2/" + day + "/2010 \\d+:53"))
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
  
  describe 'sort peers'
    before_each
      torrent_view.peers = [
        {'ip': '1.2.3.4', 'clientName': 'Transmission', 'percentDone': 10, 'rateToPeer': 10, 'rateToClient': 50},
        {'ip': '2.2.3.4', 'clientName': 'Beluge', 'percentDone': 30, 'rateToPeer': 50, 'rateToClient': 40},
        {'ip': '4.2.3.4', 'clientName': 'Vuze', 'percentDone': 20, 'rateToPeer': 40, 'rateToClient': 30},
        {'ip': '3.2.3.4', 'clientName': 'rtorrent', 'percentDone': 40, 'rateToPeer': 30, 'rateToClient': 20},
        {'ip': '5.2.3.4', 'clientName': 'BitComet', 'percentDone': 50, 'rateToPeer': 20, 'rateToClient': 10}
      ]
    end
    
    it 'should sort by client'
      torrent_view.sort_peers = 'client'
      torrent_view.sortPeers()
      torrent_view.peers[0].clientName.should.eql('Beluge')
      torrent_view.peers[1].clientName.should.eql('BitComet')
      torrent_view.peers[2].clientName.should.eql('rtorrent')
      torrent_view.peers[3].clientName.should.eql('Transmission')
      torrent_view.peers[4].clientName.should.eql('Vuze')
    end
    
    it 'should sort by percent'
      torrent_view.sort_peers = 'percent'
      torrent_view.sortPeers()
      torrent_view.peers[0].clientName.should.eql('BitComet')
      torrent_view.peers[1].clientName.should.eql('rtorrent')
      torrent_view.peers[2].clientName.should.eql('Beluge')
      torrent_view.peers[3].clientName.should.eql('Vuze')
      torrent_view.peers[4].clientName.should.eql('Transmission')
    end
    
    it 'should sort by upload'
      torrent_view.sort_peers = 'upload'
      torrent_view.sortPeers()
      torrent_view.peers[0].clientName.should.eql('Beluge')
      torrent_view.peers[1].clientName.should.eql('Vuze')
      torrent_view.peers[2].clientName.should.eql('rtorrent')
      torrent_view.peers[3].clientName.should.eql('BitComet')
      torrent_view.peers[4].clientName.should.eql('Transmission')
    end
    
    it 'should sort by download'
      torrent_view.sort_peers = 'download'
      torrent_view.sortPeers()
      torrent_view.peers[0].clientName.should.eql('Transmission')
      torrent_view.peers[1].clientName.should.eql('Beluge')
      torrent_view.peers[2].clientName.should.eql('Vuze')
      torrent_view.peers[3].clientName.should.eql('rtorrent')
      torrent_view.peers[4].clientName.should.eql('BitComet')
    end
  end

  describe 'addIdsToFiles'
    it 'should add an id to the file'
      torrent_view.files[0] = {}
      torrent_view.fileStats[0] = {}
      torrent_view.addIdsToFiles()
      torrent_view.files[0].id.should.eql('file_0')
    end
    
    it 'should add wanted if the file is wanted'
      torrent_view.files[0] = {}
      torrent_view.fileStats[0] = {'wanted': true}
      torrent_view.addIdsToFiles()
      torrent_view.files[0].wanted.should.eql(' checked="checked"')
    end
    
    it 'should not add wanted if the file is not wanted'
      torrent_view.files[0] = {}
      torrent_view.fileStats[0] = {'wanted': false}
      torrent_view.addIdsToFiles()
      torrent_view.files[0].wanted.should_not.eql(' checked="checked"')      
    end
    
    it 'should add disabled if the file is done downloading'
      torrent_view.files[0] = {'length': 200, 'bytesCompleted': 200}
      torrent_view.fileStats[0] = {}
      torrent_view.addIdsToFiles()
      torrent_view.files[0].disabled.should.eql(' disabled="disabled"')
    end
    
    it 'should not add disabled if the file is not done downloading'
      torrent_view.files[0] = {'length': 200, 'bytesCompleted': 100}
      torrent_view.files[1] = {}
      torrent_view.fileStats = [{}, {}]
      torrent_view.addIdsToFiles()
      torrent_view.files[0].disabled.should_not.eql(' disabled="disabled"')      
    end
    
    it 'should add disabled if there is only one file'
      torrent_view.files[0] = {'length': 200, 'bytesCompleted': 100}
      torrent_view.fileStats = [{}]
      torrent_view.addIdsToFiles()
      torrent_view.files[0].disabled.should.eql(' disabled="disabled"')
    end
  end
end
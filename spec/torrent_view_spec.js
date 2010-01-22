describe 'TorrentView'
  describe 'pauseAndActivateButton'
    before_each
      forms         = elements(fixture('torrents_view_forms')).find('form')
      stop_form     = $(forms.get(0))
      start_form    = $(forms.get(1))
      torrent_view = TorrentView()
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
end
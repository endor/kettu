describe 'TorrentsView'
  describe 'pauseAndActivateButton'
    it 'should return a form to pause the torrent if the torrent is active'
      var form_start = '<form action="#/torrents/567" method="PUT">';
      var status = '<input type="hidden" name="method" value="torrent-stop"/>';
      var form_end = '<input type="submit" value="Pause"/></form>';
      var torrents_view = TorrentsView();
      torrents_view.id = 567;
      torrents_view.status = Torrent({}).stati['downloading'];
      torrents_view.pauseAndActivateButton().should.match(new RegExp(form_start + status + form_end));
    end

    it 'should return a form to start the torrent if the torrent is paused and not done downloading'
      var form_start = '<form action="#/torrents/567" method="PUT">';
      var status = '<input type="hidden" name="method" value="torrent-start"/>';
      var form_end = '<input type="submit" value="Activate"/></form>';
      var torrents_view = TorrentsView();
      torrents_view.id = 567;
      torrents_view.status = Torrent({}).stati['paused'];
      torrents_view.pauseAndActivateButton().should.match(new RegExp(form_start + status + form_end));
    end
    
    it 'should return a form to start the torrent if the torrent is paused and done downloading'
      var form_start = '<form action="#/torrents/567" method="PUT">';
      var status = '<input type="hidden" name="method" value="torrent-start"/>';
      var form_end = '<input type="submit" value="Activate"/></form>';
      var torrents_view = TorrentsView();
      torrents_view.id = 567;
      torrents_view.status = Torrent({}).stati['paused'];
      torrents_view.leftUntilDone = 0;
      torrents_view.pauseAndActivateButton().should.match(new RegExp(form_start + status + form_end));
    end
  end
end
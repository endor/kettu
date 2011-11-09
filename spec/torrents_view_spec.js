describe 'TorrentsView'
  describe 'pauseAndActivateButton'
    before_each
      forms                 = elements(fixture('torrents_view_forms')).find('form')
      stop_form             = $(forms.get(0))
      start_form            = $(forms.get(1))
      context               = {}
      context.cachePartial  = function() {}
      context.cache         = function() { return fixture('pause_and_activate_button.mustache'); }
      context.mustache      = function(template, view) {return Sammy.MustacheOriginal.to_html(template, view);}
      torrents_view         = kettu.TorrentsView({}, context)
    end
    
    it 'should return a form to pause the torrent if the torrent is active'
      torrents_view.id = 567;
      torrents_view.status = kettu.Torrent({}).stati['downloading'];
      torrents_view.pauseAndActivateButton().should.match(new RegExp(stop_form));
    end

    it 'should return a form to start the torrent if the torrent is paused and not done downloading'
      torrents_view.id = 567;
      torrents_view.status = kettu.Torrent({}).stati['paused'];
      torrents_view.pauseAndActivateButton().should.match(new RegExp(start_form));
    end
    
    it 'should return a form to start the torrent if the torrent is paused and done downloading'
      torrents_view.id = 567;
      torrents_view.status = kettu.Torrent({}).stati['paused'];
      torrents_view.leftUntilDone = 0;
      torrents_view.pauseAndActivateButton().should.match(new RegExp(start_form));
    end
  end
end
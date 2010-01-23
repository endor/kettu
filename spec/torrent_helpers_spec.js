describe 'TorrentHelpers'
  before_each
    $('body').append(elements(fixture('torrents')).get(0));
    old_torrents = $('.torrent');
    torrent_helpers = TorrentHelpers;
  end

  after_each
    $('body').find('#torrents').remove();
  end

  describe 'removeOldTorrents'    
    it 'should not remove torrents that came in with the update'
      updated_torrents = [Torrent({id:1}), Torrent({id:2})];
      torrent_helpers.removeOldTorrents(updated_torrents, old_torrents);
      $('.torrent').length.should.eql(2);
    end
    
    it 'should remove torrents that did not come in with the update'
      updated_torrents = [Torrent({id:2})];
      torrent_helpers.removeOldTorrents(updated_torrents, old_torrents);
      $('.torrent').length.should.eql(1);
      $('.torrent').attr('id').should.eql('2');
    end
  end
  
  describe 'updateTorrents'
    before_each
      template = fixture('../templates/torrents/show.mustache')
      // stub functions from other parts of the code
      torrent_helpers.cache = function() { return template; };
      torrent_helpers.updateTorrentInfo = function() {};
      statusWord = function() {return 'seeding';};
    end
    
    it 'should add a new torrent if it came in with the update and is not on the site yet'
      updated_torrents = [
        {'id':1, 'statusWord': statusWord},
        {'id':2, 'statusWord': statusWord},
        {'id':3, 'statusWord': statusWord}
      ];
      torrent_helpers.updateTorrents(updated_torrents);
      $('#3').get(0).should_not.be_undefined;
    end
    
    it 'should remove an old torrent that did not come in with the update but is still on the site'
      updated_torrents = [{'id':2, 'statusWord': statusWord}];
      torrent_helpers.updateTorrents(updated_torrents);
      $('#1').get(0).should.be_undefined;
    end
    
    it 'should update the torrents\' data'
      updated_torrents = [
        {'id':1, 'statusWord': statusWord, 'statusString': 'Seeding - DL: 0.0 KB/s, UL: 20.0 KB/s'},
        {'id':2, 'statusWord': statusWord}
      ];
      torrent_helpers.updateTorrents(updated_torrents);
      $('#1').find('.statusString').html().should.match(/20\.0 KB\/s/)
    end
  end
end

describe 'FilterTorrentsHelpers'
  before_each
    filter_helpers = FilterTorrentsHelpers
  end

  it 'should not filter if filter is all'
    var torrents = [
      Torrent({'id': '1', 'name': 'Zelda'}),
      Torrent({'id': '2', 'name': 'Alpha'}),
      Torrent({'id': '3', 'name': 'Manfred'})
    ]
    var filtered_torrents = filter_helpers.filterTorrents('all', torrents)
    filtered_torrents[0].id.should.eql('1')
    filtered_torrents[1].id.should.eql('2')
    filtered_torrents[2].id.should.eql('3')    
  end
  
  it 'should filter by paused'
    var torrents = [
      Torrent({'id': '1', 'name': 'Zelda', 'status': 4}),
      Torrent({'id': '2', 'name': 'Alpha', 'status': 16}),
      Torrent({'id': '3', 'name': 'Manfred', 'status': 8})
    ]
    var filtered_torrents = filter_helpers.filterTorrents('paused', torrents)
    filtered_torrents[0].id.should.eql('2')
    filtered_torrents.length.should.eql(1)
  end
  
  it 'should filter by downloading'
    var torrents = [
      Torrent({'id': '1', 'name': 'Zelda', 'status': 4}),
      Torrent({'id': '2', 'name': 'Alpha', 'status': 16}),
      Torrent({'id': '3', 'name': 'Manfred', 'status': 8})
    ]
    var filtered_torrents = filter_helpers.filterTorrents('downloading', torrents)
    filtered_torrents[0].id.should.eql('1')
    filtered_torrents.length.should.eql(1)
  end
  
  it 'should filter by seeding'
    var torrents = [
      Torrent({'id': '1', 'name': 'Zelda', 'status': 4}),
      Torrent({'id': '2', 'name': 'Alpha', 'status': 16}),
      Torrent({'id': '3', 'name': 'Manfred', 'status': 8})
    ]
    var filtered_torrents = filter_helpers.filterTorrents('seeding', torrents)
    filtered_torrents[0].id.should.eql('3')
    filtered_torrents.length.should.eql(1)
  end
end
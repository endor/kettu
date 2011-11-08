describe 'FilterTorrentsHelpers'
  before_each
    filter_helpers = kettu.FilterTorrentsHelpers
  end

  it 'should not filter if filter is all'
    var torrents = [
      kettu.Torrent({'id': '1', 'name': 'Zelda'}),
      kettu.Torrent({'id': '2', 'name': 'Alpha'}),
      kettu.Torrent({'id': '3', 'name': 'Manfred'})
    ]
    var filtered_torrents = filter_helpers.filterTorrents('all', torrents)
    filtered_torrents[0].id.should.eql('1')
    filtered_torrents[1].id.should.eql('2')
    filtered_torrents[2].id.should.eql('3')    
  end
  
  it 'should filter by paused'
    var torrents = [
      kettu.Torrent({'id': '1', 'name': 'Zelda', 'status': 4}),
      kettu.Torrent({'id': '2', 'name': 'Alpha', 'status': 0}),
      kettu.Torrent({'id': '3', 'name': 'Manfred', 'status': 6})
    ]
    var filtered_torrents = filter_helpers.filterTorrents('paused', torrents)
    filtered_torrents[0].id.should.eql('2')
    filtered_torrents.length.should.eql(1)
  end
  
  it 'should filter by downloading'
    var torrents = [
      kettu.Torrent({'id': '1', 'name': 'Zelda', 'status': 4}),
      kettu.Torrent({'id': '2', 'name': 'Alpha', 'status': 0}),
      kettu.Torrent({'id': '3', 'name': 'Manfred', 'status': 6})
    ]
    var filtered_torrents = filter_helpers.filterTorrents('downloading', torrents)
    filtered_torrents[0].id.should.eql('1')
    filtered_torrents.length.should.eql(1)
  end
  
  it 'should filter by seeding'
    var torrents = [
      kettu.Torrent({'id': '1', 'name': 'Zelda', 'status': 4}),
      kettu.Torrent({'id': '2', 'name': 'Alpha', 'status': 0}),
      kettu.Torrent({'id': '3', 'name': 'Manfred', 'status': 6})
    ]
    var filtered_torrents = filter_helpers.filterTorrents('seeding', torrents)
    filtered_torrents[0].id.should.eql('3')
    filtered_torrents.length.should.eql(1)
  end
end
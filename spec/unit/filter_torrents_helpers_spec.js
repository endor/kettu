describe("FilterTorrentsHelpers", function() {
  var filter_helpers = kettu.FilterTorrentsHelpers;

  it("should not filter if filter is all", function() {
    var torrents = [
      kettu.Torrent({'id': '1', 'name': 'Zelda'}),
      kettu.Torrent({'id': '2', 'name': 'Alpha'}),
      kettu.Torrent({'id': '3', 'name': 'Manfred'})
    ];
    var filtered_torrents = filter_helpers.filterTorrents('all', torrents);
    expect(filtered_torrents[0].id).to.equal('1');
    expect(filtered_torrents[1].id).to.equal('2');
    expect(filtered_torrents[2].id).to.equal('3');
  });

  it("should filter by paused", function() {
    var torrents = [
      kettu.Torrent({'id': '1', 'name': 'Zelda', 'status': 4}),
      kettu.Torrent({'id': '2', 'name': 'Alpha', 'status': 0}),
      kettu.Torrent({'id': '3', 'name': 'Manfred', 'status': 6})
    ];
    var filtered_torrents = filter_helpers.filterTorrents('paused', torrents);
    expect(filtered_torrents[0].id).to.equal('2');
    expect(filtered_torrents.length).to.equal(1);
  });

  it("should filter by downloading", function() {
    var torrents = [
      kettu.Torrent({'id': '1', 'name': 'Zelda', 'status': 4}),
      kettu.Torrent({'id': '2', 'name': 'Alpha', 'status': 0}),
      kettu.Torrent({'id': '3', 'name': 'Manfred', 'status': 6})
    ];
    var filtered_torrents = filter_helpers.filterTorrents('downloading', torrents);
    expect(filtered_torrents[0].id).to.equal('1');
    expect(filtered_torrents.length).to.equal(1);
  });

  it("should filter by seeding", function() {
    var torrents = [
      kettu.Torrent({'id': '1', 'name': 'Zelda', 'status': 4}),
      kettu.Torrent({'id': '2', 'name': 'Alpha', 'status': 0}),
      kettu.Torrent({'id': '3', 'name': 'Manfred', 'status': 6})
    ];
    var filtered_torrents = filter_helpers.filterTorrents('seeding', torrents);
    expect(filtered_torrents[0].id).to.equal('3');
    expect(filtered_torrents.length).to.equal(1);
  });
});

//
// these sort helpers are based heavily on the previous sort helpers by Dave Perrett and Malcolm Jarvis
//

kettu.SortTorrentsHelpers = {
  sortTorrents: function(sort_mode, torrents, reverse) {
    var torrentSortFunction = function() {};

    switch(sort_mode) {
      case 'name':
        torrentSortFunction = function(a, b) {
          var a_name = a.name.toUpperCase();
          var b_name = b.name.toUpperCase();
          return (a_name < b_name) ? -1 : (a_name > b_name) ? 1 : 0;
        };
        break;
      case 'activity':
        torrentSortFunction = function(a, b) {
          return a.activity() - b.activity();
        };
        break;
      case 'age':
        torrentSortFunction = function(a, b) {
          return b.addedDate - a.addedDate;
        };
        break;
      case 'progress':
        torrentSortFunction = function(a, b) {
          if(a.percentDone() !== b.percentDone()) {
            return a.percentDone() - b.percentDone();
          } else {
           var a_ratio = Math.ratio(a.uploadedEver, a.downloadedEver);
           var b_ratio = Math.ratio(b.uploadedEver, b.downloadedEver);
           return a_ratio - b_ratio;
          }
        };
        break;
      case 'queue':
        torrentSortFunction = function(a, b) {
          return a.id - b.id;
        };
        break;
      case 'state':
        torrentSortFunction = function(a, b) {
          return a.status - b.status;
        };
        break;
    }

    torrents.sort(torrentSortFunction);

    if(reverse) {
      torrents.reverse();
    }

    return torrents;
  }
};

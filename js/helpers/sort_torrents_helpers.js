// 
// these sort helpers are based heavily on the previous sort helpers by Dave Perrett and Malcolm Jarvis
//

var SortTorrentsHelpers = {
  sortTorrents: function(sort_mode, torrents, reverse) {
    var torrent_sort_function = function() {};
    
    switch(sort_mode) {
      case 'name':
        torrent_sort_function = function(a, b) {
          var a_name = a.name.toUpperCase();
          var b_name = b.name.toUpperCase();
          return (a_name < b_name) ? -1 : (a_name > b_name) ? 1 : 0;
        };
        break;
      case 'activity':
        torrent_sort_function = function(a, b) {
          return b.activity() - a.activity();
        };
        break;
      case 'age':
        torrent_sort_function = function(a, b) {
          return b.addedDate - a.addedDate;
        };
        break;
      case 'progress':
        torrent_sort_function = function(a, b) {
          if(a.percentDone() != b.percentDone()) {
            return a.percentDone() - b.percentDone();
          } else {
           var a_ratio = Math.ratio(a.uploadedEver, a.downloadedEver);
           var b_ratio = Math.ratio(b.uploadedEver, b.downloadedEver);
           return a_ratio - b_ratio;            
          }
        };
        break;
      case 'queue':
        torrent_sort_function = function(a, b) {
          return a.id - b.id;
        };
        break;
      case 'state':
        torrent_sort_function = function(a, b) {
          return a.status - b.status;
        };
        break;
    }
    
    torrents.sort(torrent_sort_function);
    
    if(reverse) {
      torrents.reverse();
    }
    
    return torrents;
  }
}
kettu.TorrentView = function(torrent, context, sort_peers) {
  var view = torrent;
  view.sort_peers = sort_peers || 'client';
  
  view.formatTime = function(timestamp) {
    var current = new Date(parseInt(timestamp, 10) * 1000);
    if(current) {
      var date = (current.getMonth() + 1) + '/' + current.getDate() + '/' + current.getFullYear();
      var time = current.getHours() + ':' + (current.getMinutes() < 10 ? '0' + current.getMinutes() : current.getMinutes());
      return date + ' ' + time;      
    } else {
      return timestamp;
    }
  };
  
  view.addFormattedTimes = function() {
    if(view.trackerStats !== undefined) {
      _.each(view.trackerStats, function(stat, i) {
        view.trackerStats[i]['lastAnnounceTimeFormatted'] = view.formatTime(stat.lastAnnounceTime);
        view.trackerStats[i]['nextAnnounceTimeFormatted'] = context.formatNextAnnounceTime(stat.nextAnnounceTime);
        view.trackerStats[i]['lastScrapeTimeFormatted'] = view.formatTime(stat.lastScrapeTime);
        view.trackerStats[i]['lastScrapeDidNotSucceed'] = !view.lastScrapeSucceeded;
        view.trackerStats[i]['lastAnnounceDidNotSucceed'] = !view.lastAnnounceSucceeded;
      });      
    }    
  };
  
  view.addFormattedSizes = function() {
    if(view.files !== undefined) {
      _.each(view.files, function(file) {
        file.lengthFormatted = Math.formatBytes(file['length']);
        file.percentDone = Math.formatPercent(file['length'], file['length'] - file.bytesCompleted);
      });
    }
    if(view.peers !== undefined) {
      _.each(view.peers, function(peer) {
        peer.uploadFormatted = peer['rateToPeer'] !== 0 ? Math.formatBytes(peer['rateToPeer']) : '';
        peer.downloadFormatted = peer['rateToClient'] !== 0? Math.formatBytes(peer['rateToClient']) : '';
        peer.percentDone = Math.formatPercent(100, 100 - (peer['progress'] * 100));
      });      
    }
    view.rateDownloadFormatted = Math.formatBytes(view.rateDownload) + '/s';
    view.rateUploadFormatted = Math.formatBytes(view.rateUpload) + '/s';
  };
  
  view.sortPeers = function() {
    if(view.peers !== undefined) {
      var peers = view.peers;
      var peer_sort_function = function() {};
    
      switch(view.sort_peers) {
        case 'client':
          peer_sort_function = function(a, b) {
            var a_name = a.clientName.toUpperCase();
            var b_name = b.clientName.toUpperCase();
            return (a_name < b_name) ? -1 : (a_name > b_name) ? 1 : 0;
          };
          break;
        case 'percent':
          peer_sort_function = function(a, b) {
            return b.percentDone - a.percentDone;
          };
          break;
        case 'upload':
          peer_sort_function = function(a, b) {
            return b.rateToPeer - a.rateToPeer;
          };
          break;
        case 'download':
          peer_sort_function = function(a, b) {
            return b.rateToClient - a.rateToClient;
          };
          break;
      }

      view.peers = peers.sort(peer_sort_function);
    }
  };
  
  view.addIdsToFiles = function() {
    if(view.files) {
      _.each(view.files, function(file) {
        var id = view.files.indexOf(file);
        var disabled = view.files[id]['length'] - view.files[id]['bytesCompleted'] === 0;
        file['id'] = 'file_' + id;
        file['wanted'] = (view.fileStats[id].wanted || disabled) ? ' checked="checked"' : '';
        file['disabled'] = disabled ? ' disabled="disabled"' : '';
      });
      if(view.files.length == 1) {
        view.files[0]['disabled'] = ' disabled="disabled"';
        view.files[0]['wanted'] = ' checked="checked"';
      }
    }
  };
  
  view.folderizeFiles = function() {
    view.folderless_files = [];
    view.folders = [];
    var i = -1;
    
    if(view.files) {
      _.each(view.files, function(file) {
        var name = file['name'].split('/');
        if(name.length > 1) { name.shift(); }
        if(name.length == 1) {
          file['name'] = name.join('/');
          view.folderless_files.push(this);
        } else {
          var folder = name.shift();
          file['name'] = name.join('/');
          
          if(view.folders[i] && view.folders[i].name == folder) {
            view.folders[i].files.push(file);
            view.folders[i].lengthFormatted += file.length;
            view.folders[i].bytesCompleted += file.bytesCompleted;
          } else {
            view.folders.push({
              name: folder,
              files: [file],
              lengthFormatted: file.length,
              bytesCompleted: file.bytesCompleted
            });
            i += 1;
          }
        }
      });
      _.each(view.folders, function(folder) {
        folder.percentDone = Math.formatPercent(folder.lengthFormatted, folder.lengthFormatted - folder.bytesCompleted);
        folder.lengthFormatted = Math.formatBytes(folder.lengthFormatted);
      });
    }
  };
  
  view.addPriorityStringToFiles = function() {
    _.each(view.fileStats, function(stat) {
      var id = view.fileStats.indexOf(stat);
      switch(stat.priority) {
        case 0:
          view.files[id]['priorityArrow'] = 'normal';
          break;
        case 1:
          view.files[id]['priorityArrow'] = 'up';
          break;
        case -1:
          view.files[id]['priorityArrow'] = 'down';
          break;
      }
      if(view.files[id]['length'] - view.files[id]['bytesCompleted'] === 0) {
        view.files[id]['priorityArrow'] = 'done';
      }
    });
    view.show_select_all = view.files.length > 1 && !view.isDoneDownloading();
  };
  
  view.sanitizeNumbers = function() {
    view.uploadRatio = context.sanitizeNumber(view.uploadRatio);
    if(view.trackerStats !== undefined) {
      var i = 0;
      _.each(view.trackerStats, function(stat) {
        view.trackerStats[i]['seederCount'] = context.sanitizeNumber(stat.seederCount);
        view.trackerStats[i]['leecherCount'] = context.sanitizeNumber(stat.leecherCount);
        view.trackerStats[i]['downloadCount'] = context.sanitizeNumber(stat.downloadCount);
        i += 1;
      });
    }
  };
  
  view.loadLocations = function() {
      view.showLocations = false;

      if (_.isArray(kettu.config.locations) && kettu.config.locations.length > 0) {
        view.locations = [{name:"Default", path: kettu.app.settings['download-dir']}];

        _.each(kettu.config.locations, function(location) {
          if (location.path != view.locations[0].path) {
            view.locations.push(location);
          }
        });

        view.showLocations = true;
      }      
  };
  
  view.addFormattedTimes();
  view.addFormattedSizes();
  view.sortPeers();
  view.addPriorityStringToFiles();
  view.sanitizeNumbers();
  view.addIdsToFiles();
  view.folderizeFiles();
  view.loadLocations();

  return view;
};
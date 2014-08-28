kettu.TorrentView = function(torrent, context, sort_peers) {
  var view = torrent;
  view.sort_peers = sort_peers || 'client';

  view.formatTime = function(timestamp) {
    if(timestamp === 0) { return 'N/A'; }

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
        view.trackerStats[i].lastAnnounceTimeFormatted = view.formatTime(stat.lastAnnounceTime);
        view.trackerStats[i].nextAnnounceTimeFormatted = context.formatNextAnnounceTime(stat.nextAnnounceTime);
        view.trackerStats[i].lastScrapeTimeFormatted = view.formatTime(stat.lastScrapeTime);
        view.trackerStats[i].lastScrapeDidNotSucceed = !view.lastScrapeSucceeded;
        view.trackerStats[i].lastAnnounceDidNotSucceed = !view.lastAnnounceSucceeded;
      });
    }
  };

  view.addFormattedSizes = function() {
    if(view.files !== undefined) {
      _.each(view.files, function(file) {
        file.lengthFormatted = Math.formatBytes(file.length);
        file.percentDone = Math.formatPercent(file.length, file.length - file.bytesCompleted);
      });
    }
    if(view.peers !== undefined) {
      _.each(view.peers, function(peer) {
        peer.uploadFormatted = peer.rateToPeer !== 0 ? Math.formatBytes(peer.rateToPeer) : '';
        peer.downloadFormatted = peer.rateToClient !== 0? Math.formatBytes(peer.rateToClient) : '';
        peer.percentDone = Math.formatPercent(100, 100 - (peer.progress * 100));
      });
    }
    view.rateDownloadFormatted = Math.formatBytes(view.rateDownload) + '/s';
    view.rateUploadFormatted = Math.formatBytes(view.rateUpload) + '/s';
    if (view.uploadRatio >= 0) {
      view.uploadRatio = view.uploadRatio.toPrecision(3);
    }
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
        var id = view.files.indexOf(file),
            disabled = view.files[id].length - view.files[id].bytesCompleted === 0;

        file.id = 'file_' + id;
        file.wanted = (view.fileStats[id].wanted || disabled) ? ' checked="checked"' : '';
        file.disabled = disabled ? ' disabled="disabled"' : '';
      });

      if(view.files.length === 1) {
        view.files[0].disabled = ' disabled="disabled"';
        view.files[0].wanted = ' checked="checked"';
      }
    }
  };

  var joinFileName = function(name) {
      return name.join('/');
  };

  view.folderizeFiles = function() {
    view.folderless_files = [];
    view.folders = [];

    view.files.sort(function(f1, f2) {
      return f1.name.localeCompare(f2.name);
    });

    if(view.files) {
      _.each(view.files, function(file) {
        var name = file.name.split('/');
        var i = view.folders.length - 1;

        if(name.length > 1) {
          name.shift();
        }

        if(name.length === 1) {
          file.name = joinFileName(name);
          view.folderless_files.push(file);
        } else {
          var folder = name.shift();
          file.name = joinFileName(name);

          if(i >= 0 && view.folders[i].name === folder) {
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
          }
        }
      });
    }
  };

  view.formatFolders = function() {
    _.each(view.folders, function(folder) {
      var wantedFiles = 0, completeFiles = 0, highPriorityFiles = 0, lowPriorityFiles = 0;

      _.each(folder.files, function(file) {
        if(!_.isEmpty(file.wanted)) { wantedFiles += 1; }
        if(!_.isEmpty(file.disabled)) { completeFiles += 1; }
        if(file.priorityArrow === "up") { highPriorityFiles += 1; }
        if(file.priorityArrow === "down") { lowPriorityFiles += 1; }
      });

      folder.percentDone = Math.formatPercent(folder.lengthFormatted, folder.lengthFormatted - folder.bytesCompleted);
      folder.lengthFormatted = Math.formatBytes(folder.lengthFormatted);
      folder.wanted = wantedFiles > 0 ? ' checked="checked"' : '';
      folder.disabled = completeFiles === folder.files.length ? ' disabled="disabled"' : '';

      if(highPriorityFiles === folder.files.length) {
        folder.priorityArrow = "up";
      } else if(lowPriorityFiles === folder.files.length) {
        folder.priorityArrow = "down";
      } else if(folder.percentDone === 100) {
        folder.priorityArrow = "done";
      } else {
        folder.priorityArrow = "normal";
      }
    });
  };

  view.addPriorityStringToFiles = function() {
    _.each(view.fileStats, function(stat) {
      var id = view.fileStats.indexOf(stat),
          arrows = {'0': 'normal', '1': 'up', '-1': 'down'};

      view.files[id].priorityArrow = arrows[stat.priority.toString()];

      if(view.files[id].length === view.files[id].bytesCompleted) {
        view.files[id].priorityArrow = 'done';
      }
    });
    view.show_select_all = view.files.length > 1 && !view.isDoneDownloading();
  };

  view.sanitizeNumbers = function() {
    view.uploadRatio = context.sanitizeNumber(view.uploadRatio);
    if(view.trackerStats !== undefined) {
      var i = 0;
      _.each(view.trackerStats, function(stat) {
        view.trackerStats[i].seederCount = context.sanitizeNumber(stat.seederCount);
        view.trackerStats[i].leecherCount = context.sanitizeNumber(stat.leecherCount);
        view.trackerStats[i].downloadCount = context.sanitizeNumber(stat.downloadCount);
        i += 1;
      });
      view.trackerStats = view.trackerStats.slice(0, 2);
    }
  };

  view.loadLocations = function() {
      view.showLocations = false;

      if (_.isArray(kettu.config.locations) && kettu.config.locations.length > 0) {
        view.locations = [{name: 'Default', path: (kettu.app.settings || {})['download-dir']}];

        _.each(kettu.config.locations, function(location) {
          if (location.path !== view.locations[0].path) {
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
  view.formatFolders();
  view.loadLocations();

  view.isMobile = kettu.app.mobile;

  if(kettu.app.mobile) {
    view.comment = context.shorten(view.comment, 33);
  }

  return view;
};

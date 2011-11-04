kettu.TorrentView = function(torrent, context, sort_peers) {
  var view = torrent;
  view.sort_peers = sort_peers || 'client';
  
  view.formatTime = function(timestamp) {
    var current = new Date(parseInt(timestamp) * 1000);
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
      var i = 0;
      $.each(view.trackerStats, function() {
        view.trackerStats[i]['lastAnnounceTimeFormatted'] = view.formatTime(this.lastAnnounceTime);
        view.trackerStats[i]['nextAnnounceTimeFormatted'] = context.formatNextAnnounceTime(this.nextAnnounceTime);
        view.trackerStats[i]['lastScrapeTimeFormatted'] = view.formatTime(this.lastScrapeTime);
        view.trackerStats[i]['lastScrapeDidNotSucceed'] = !view.lastScrapeSucceeded;
        view.trackerStats[i]['lastAnnounceDidNotSucceed'] = !view.lastAnnounceSucceeded;
        i += 1;
      });      
    }    
  };
  
  view.addFormattedSizes = function() {
    if(view.files !== undefined) {
      $.each(view.files, function() {
        this.lengthFormatted = Math.formatBytes(this['length']);
        this.percentDone = Math.formatPercent(this['length'], this['length'] - this.bytesCompleted);
      });
    }
    if(view.peers !== undefined) {
      $.each(view.peers, function() {
        this.uploadFormatted = this['rateToPeer'] !== 0 ? Math.formatBytes(this['rateToPeer']) : '';
        this.downloadFormatted = this['rateToClient'] !== 0? Math.formatBytes(this['rateToClient']) : '';
        this.percentDone = Math.formatPercent(100, 100 - (this['progress'] * 100));
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
      $.each(view.files, function() {
        var id = view.files.indexOf(this)
        var disabled = view.files[id]['length'] - view.files[id]['bytesCompleted'] == 0;
        this['id'] = 'file_' + id;
        this['wanted'] = (view.fileStats[id].wanted || disabled) ? ' checked="checked"' : '';
        this['disabled'] = disabled ? ' disabled="disabled"' : '';
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
      $.each(view.files, function() {
        var name = this['name'].split('/');
        if(name.length > 1) { name.shift(); }
        if(name.length == 1) {
          this['name'] = name.join('/');
          view.folderless_files.push(this);
        } else {
          var folder = name.shift();
          this['name'] = name.join('/');
          
          if(view.folders[i] && view.folders[i].name == folder) {
            view.folders[i].files.push(this);
            view.folders[i].lengthFormatted += this.length;
            view.folders[i].bytesCompleted += this.bytesCompleted;
          } else {
            view.folders.push({
              name: folder,
              files: [this],
              lengthFormatted: this.length,
              bytesCompleted: this.bytesCompleted
            });
            i += 1;
          }
        }
      });
      $.each(view.folders, function() {
        this.percentDone = Math.formatPercent(this.lengthFormatted, this.lengthFormatted - this.bytesCompleted);
        this.lengthFormatted = Math.formatBytes(this.lengthFormatted);
      });
    }
  };
  
  view.addPriorityStringToFiles = function() {
    $.each(view.fileStats, function() {
      var id = view.fileStats.indexOf(this);
      switch(this.priority) {
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
      if(view.files[id]['length'] - view.files[id]['bytesCompleted'] == 0) {
        view.files[id]['priorityArrow'] = 'done';
      }
    });
    view.show_select_all = view.files.length > 1 && !view.isDoneDownloading();
  };
  
  view.sanitizeNumbers = function() {
    view.uploadRatio = context.sanitizeNumber(view.uploadRatio);
    if(view.trackerStats !== undefined) {
      var i = 0;
      $.each(view.trackerStats, function() {
        view.trackerStats[i]['seederCount'] = context.sanitizeNumber(this.seederCount);
        view.trackerStats[i]['leecherCount'] = context.sanitizeNumber(this.leecherCount);
        view.trackerStats[i]['downloadCount'] = context.sanitizeNumber(this.downloadCount);
        i += 1;
      });
    }
  };
  
  view.loadLocations = function() {
      view.showLocations = false;

      if ($.isArray(kettu.config.locations) && kettu.config.locations.length > 0) {
        view.locations = [{name:"Default", path: kettu.app.settings['download-dir']}];

        kettu.config.locations.forEach(function(location) {
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

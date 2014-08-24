/*global _, kettu */

(function() {
  var torrent = {
    "id":  1,
    "name": "Hans",
    "status": 4,
    "totalSize": 100,
    "sizeWhenDone": 100,
    "leftUntilDone": 50,
    "eta": 0,
    "uploadedEver": 0,
    "uploadRatio": 0,
    "rateDownload": 0,
    "rateUpload": 0,
    "metadataPercentComplete": 1,
    "addedDate": 27762987,
    "downloadDir": "/downloads",
    "creator": "chaot",
    "hashString": "83ui72GYAYDg27ghg22e22e4235215",
    "comment": "",
    "isPrivate": true,
    "downloadedEver": 50,
    "haveValid": 20,
    "haveUnchecked": 10,
    "errorString": "",
    "peersGettingFromUs": 0,
    "peersSendingToUs": 0,
    "files": [],
    "fileStats": [],
    "pieceCount": 20,
    "pieceSize": 5,
    "trackerStats": [
      {
        "lastAnnounceTime": "12345678",
        "host": "my.tracker.com",
        "nextAnnounceTime": "12345678",
        "lastScrapeTime": "12345678",
        "seederCount": 0,
        "leecherCount": 0,
        "downloadCount": 1
      }
    ]
  };

  var torrents = [];

  kettu.helpers = {
    setup: function() {
      var originalAjax = $.ajax;

      $.ajax = function(options) {
        if(options.url.match(/template/)) {
          originalAjax(options);
        } else {
          var data = JSON.parse(options.data);

          if(data["method"] !== "torrent-get") {
            window.lastRequest = options;
          }

          if(data["arguments"]["ids"]) {
            var _torrents = _.select(torrents, function(_torrent) {
              return _torrent.id === data["arguments"]["ids"];
            });
            options.success({"arguments": {"torrents": _torrents}});
          } else {
            options.success({"arguments": {"torrents": torrents}});
          }
        }
      };

      kettu.config.reloadInterval = 300;
      kettu.config.storeName = 'kettu-test';
    },

    setupStore: function() {
      kettu.store.clearAll();
    },

    waitForReload: function(callback) {
      setTimeout(callback, 400);
    },

    bind: function(fn, scope) {
      return function() {
        return fn.apply(scope, arguments);
      };
    },

    createTorrent: function(name, options) {
      torrents = [
        _.extend({}, torrent, {name: name}, options)
      ];
    },

    updateTorrent: function(options) {
      torrents[0] = _.extend(torrents[0], options);
    },

    createTorrents: function(_torrents) {
      torrents = _.map(_torrents, function(_torrent) {
        return _.extend({}, torrent, {name: _torrent[0]}, _torrent[1] || {});
      });
    }
  };
})();

kettu.TorrentsView = function(torrent, context) {
  var view = torrent;

  view.pauseAndActivateButton = function() {
    var torrent = kettu.Torrent(view);
    var options = torrent.isActive() ? ['torrent-stop', 'Pause'] : ['torrent-start', 'Resume'];
    this.cachePartial('templates/torrents/pause_and_activate_button.mustache', 'pause_and_activate_button', context);
    return context.mustache(context.cache('pause_and_activate_button'), {
      'id': torrent.id,
      'method': options[0],
      'button': options[1],
      'css_class': torrent.statusWord(),
      'isMobile': !!kettu.app.mobile
    });
  };

  view.deleteForm = function() {
    var torrent = kettu.Torrent(view);
    this.cachePartial('templates/torrents/delete_form.mustache', 'delete_form', context);
    return context.mustache(context.cache('delete_form'), {
      'id': torrent.id,
      'isMobile': !!kettu.app.mobile
    });
  };

  view.firstTracker = function() {
    if(view.trackerStats && view.trackerStats[0]) {
      return view.trackerStats[0].host;
    } else {
      return '';
    }
  };

  view.errorClass = function() {
    return view.hasError() ? ' error' : '';
  };

  view.isMobile = function() {
    return !!kettu.app.mobile;
  };

  view.paused = function() {
    return view.statusWord() === 'paused' || view.statusWord() === 'finished';
  };

  view.mobileError = function() {
    return (view.isMobile() && view.hasError()) ? 'mobile-error' : '';
  };

  view.showPriorityArrow = function() {
    return torrent.bandwidthPriority !== 0;
  };

  view.priorityArrow = function() {
    return torrent.bandwidthPriority === 1 ? 'up' : 'down';
  };

  view.cachePartial = context.cachePartial;

  if(kettu.app.mobile) {
    view.name = context.shorten(view.name, 32);
  }

  return view;
};

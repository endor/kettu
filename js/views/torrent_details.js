kettu.TorrentDetailsView = function(accumulation) {
  var view = accumulation;

  view.ratio = (view.uploaded / view.downloaded).toPrecision(3);
  view.percent_done = Math.formatPercent(view.size, view.left_until_done);

  _.each(['size', 'downloaded', 'uploaded', 'rate_download', 'rate_upload'], function(item) {
    view[item] = Math.formatBytes(view[item]);
  });

  _.each(['status_words', 'secure'], function(item) {
    view[item] = _.uniq(view[item]);
  });

  view.status_words = view.status_words.join('/');
  view.secure = view.secure.length > 1 ? 'Mixed' : view.secure[0] + 's';
  view.rate_download = view.rate_download + '/s';
  view.rate_upload = view.rate_upload + '/s';

  view.isMobile = kettu.app.mobile;

  return view;
};

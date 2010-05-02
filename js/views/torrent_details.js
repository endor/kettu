TorrentDetailsView = function(accumulation) {
  var view = accumulation;
    
  view.ratio = (view.uploaded / view.downloaded).toFixed(4);
  view.percent_done = Math.formatPercent(view.size, view.left_until_done);
  $.each(['size', 'downloaded', 'uploaded', 'rate_download', 'rate_upload'], function() {
    view[this] = Math.formatBytes(view[this]);
  });
  $.each(['status_words', 'secure'], function() {
    view[this] = $.uniq(view[this]);
  });
  
  view.status_words = view.status_words.join('/');
  view.secure = view.secure.length > 1 ? 'Mixed' : view.secure[0] + 's';
  view.rate_download = view.rate_download + '/s';
  view.rate_upload = view.rate_upload + '/s';
  
  return view;
}
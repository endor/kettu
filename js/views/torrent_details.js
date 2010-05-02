TorrentDetailsView = function(accumulation) {
  var view = accumulation;
    
  view.ratio = (view.uploaded / view.downloaded).toFixed(4);
  $.each(['size', 'downloaded', 'uploaded'], function() {
    view[this] = Math.formatBytes(view[this]);
  });
  view.status_words = $.uniq(view.status_words).join('/');
  
  return view;
}
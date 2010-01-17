Sammy.Mustache = function(app) {
  app.helpers({
    mustache: function(template, data) {
      return Mustache.to_html(template, data);
    }
  });
};
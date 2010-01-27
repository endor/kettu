var StatisticHelpers = {
  updateStatistics: function() {
    var context = this;
    $('#statistics').click(function() {
      if(context.infoIsOpen()) {
        context.closeInfo();
      } else {
        window.location.hash = '/statistics';
      }
      return false;
    });
  }
}
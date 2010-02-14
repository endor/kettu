var StatisticHelpers = {
  activateStatisticsLink: function() {
    var context = this;
    $('#statistics').click(function() {
      if(context.infoIsOpen()) {
        context.closeInfo();
      } else {
        context.redirect('#/statistics');
      }
      return false;
    });
  }
}
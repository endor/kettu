kettu.StatisticHelpers = {
  activateGraphLinks: function(context) {
    $('.graph_links a').click(function() {
      var graph = context.upAndDownloadGraph();

      context.render('templates/statistics/up_and_download_graph.mustache', {}, function(rendered_view) {
        $.facebox(rendered_view);
        $('#facebox').addClass('graph');
        context.drawGraph('up_and_download_graph', graph);
      });
      
      return false;      
    });
  },
  
  upAndDownloadGraph: function() {
    var graph = {'data': [], 'labels': ''}, i = 2;
    
    _.each(this.store.get('up_and_download_rate'), function(rate) {
      if(i === 0) {
        graph['data'].push((rate.up / 1024) + (rate.down / 1024));
        i = 2;
      } else {
        i -= 1;
      }
    });
    
    graph['labels'] = 'Activity';
    return graph;
  },
  
  drawGraph: function(holder, graph) {
    var width = 800,
        height = 300,
        leftgutter = 10,
        bottomgutter = 30,
        topgutter = 20,
        colorhue = 0.6 || Math.random(),
        color = "#bbbbbb",
        r = Raphael(holder, width, height),
        txt = {font: '12px Fontin-Sans, Arial', fill: "#fff"},
        txt1 = {font: '10px Fontin-Sans, Arial', fill: "#fff"},
        txt2 = {font: '12px Fontin-Sans, Arial', fill: "#000"},
        X = (width - leftgutter) / graph['data'].length,
        max = Math.max.apply(Math, graph['data']),
        Y = (height - bottomgutter - topgutter) / (max || 1);
    r.drawGrid(leftgutter + X * 0.5, topgutter, width - leftgutter - X, height - topgutter - bottomgutter, 10, 10, "#888888");
    
    var path = r.path().attr({stroke: color, "stroke-width": 4, "stroke-linejoin": "round"}),
        bgp = r.path().attr({stroke: "none", opacity: 0.3, fill: color}).moveTo(leftgutter + X * 0.5, height - bottomgutter),
        frame = r.rect(10, 10, 100, 40, 5).attr({fill: "#000", stroke: "#474747", "stroke-width": 2}).hide(),
        label = [],
        is_label_visible = false,
        leave_timer,
        blanket = r.set();
    label[0] = r.text(60, 10, "").attr(txt).hide();
    
    for(var i = 0, ii = graph['data'].length; i < ii; i++) {
        var y = Math.round(height - bottomgutter - Y * graph['data'][i]),
            x = Math.round(leftgutter + X * (i + 0.5)),
            t = r.text(x, height - 6, graph['data'][i]).attr(txt).toBack();
        bgp[i === 0 ? "lineTo" : "cplineTo"](x, y, 10);
        path[i === 0 ? "moveTo" : "cplineTo"](x, y, 10);
        var dot = r.circle(x, y, 5).attr({fill: color, stroke: "#000"});
        blanket.push(r.rect(leftgutter + X * i, 0, X, height - bottomgutter).attr({stroke: "none", fill: "#fff", opacity: 0}));
        var rect = blanket[blanket.length - 1];

        (function (x, y, data, lbl, dot) {
            var timer, i = 0;
            $(rect.node).hover(function () {
                clearTimeout(leave_timer);
                var newcoord = {x: +x + 7.5, y: y - 19};
                if (newcoord.x + 100 > width) {
                    newcoord.x -= 114;
                }
                frame.show().animate({x: newcoord.x, y: newcoord.y}, 200 * is_label_visible);
                label[0].attr({text: data.toFixed(2) + " KB/s"}).show().animateWith(frame, {x: +newcoord.x + 50, y: +newcoord.y + 12}, 200 * is_label_visible);
                dot.attr("r", 7);
                is_label_visible = true;
            }, function () {
                dot.attr("r", 5);
                leave_timer = setTimeout(function () {
                    frame.hide();
                    label[0].hide();
                    is_label_visible = false;
                }, 1);
            });
        })(x, y, graph['data'][i], graph['labels'][i], dot);        
    }
    bgp.lineTo(x, height - bottomgutter).andClose();
    frame.toFront();
    label[0].toFront();
    blanket.toFront();
  }
};
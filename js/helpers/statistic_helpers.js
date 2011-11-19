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

    graph['data'] = graph['data'].slice(-20);
    
    var config = {
      width: 1000,
      height: 300,
      leftgutter: 10,
      bottomgutter: 30,
      topgutter: 20,
      colorhue: 0.6,
      color: '#bbbbbb',
      txt:  { font: '12px Fontin-Sans, Arial', fill: "#000" },
      max: Math.max.apply(Math, graph['data'])
    }

    var raphael = Raphael('up_and_download_graph', config.width, config.height);

    var X = (config.width - config.leftgutter) / graph['data'].length;
    var Y = (config.height - config.bottomgutter - config.topgutter) / (config.max || 1);

    raphael.drawGrid(
      config.leftgutter + X * 0.5,
      config.topgutter,
      config.width - config.leftgutter - X,
      config.height - config.topgutter - config.bottomgutter,
      10, 10, "#888888"
    );
    
    var path = raphael.
                path().
                attr({stroke: config.color, "stroke-width": 4, "stroke-linejoin": "round"});
      
    var bgp = raphael.
                path().
                attr({stroke: "none", opacity: 0.3, fill: config.color}).
                moveTo(config.leftgutter + X * 0.5, config.height - config.bottomgutter);
                
    var frame = raphael.
                  rect(10, 10, 100, 40, 5).
                  attr({fill: "#000", stroke: "#474747", "stroke-width": 2}).
                  hide();

    var label = [];
    var is_label_visible = false;
    var leave_timer;
    var blanket = raphael.set();
    
    label[0] = raphael.text(60, 10, "").attr(config.txt).hide();
    
    for(var i = 0, ii = graph['data'].length; i < ii; i++) {
        var y = Math.round(config.height - config.bottomgutter - Y * graph['data'][i]);
        var x = Math.round(config.leftgutter + X * (i + 0.5));
        var t = raphael.text(x, config.height - 6, graph['data'][i].toFixed(2)).attr(config.txt).toBack();
        var dot = raphael.circle(x, y, 5).attr({fill: config.color, stroke: "#000"});

        bgp[i === 0 ? "lineTo" : "cplineTo"](x, y, 10);
        path[i === 0 ? "moveTo" : "cplineTo"](x, y, 10);        
        
        blanket.push(raphael.
                      rect(config.leftgutter + X * i, 0, X, config.height - config.bottomgutter).
                      attr({stroke: "none", fill: "#fff", opacity: 0})
        );
        
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
                
                label[0].
                  attr({text: data.toFixed(2) + " KB/s"}).
                  show().
                  animateWith(frame, {x: +newcoord.x + 50, y: +newcoord.y + 12}, 200 * is_label_visible);
                  
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
    bgp.lineTo(x, config.height - config.bottomgutter).andClose();
    
    frame.toFront();
    label[0].toFront();
    blanket.toFront();
    
  }
};
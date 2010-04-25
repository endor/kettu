$(function() {
  Raphael = Raphael || {};
  Raphael.fn = Raphael.fn || {};
  
  Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
    color = color || "#000";
    var path = ["M", x, y, "L", x + w, y, x + w, y + h, x, y + h, x, y],
      rowHeight = h / hv,
      columnWidth = w / wv;
    for(var i = 1; i < hv; i++) {
      path = path.concat(["M", x, y + i * rowHeight, "L", x + w, y + i * rowHeight]);
    }
    for(var i = 1; i < wv; i++) {
      path = path.concat(["M", x + i * columnWidth, y, "L", x + i * columnWidth, y + h]);
    }
    return this.path(path.join(",")).attr({stroke: color});
  };  
});

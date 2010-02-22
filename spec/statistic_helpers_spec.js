describe 'StatisticHelpers'
  before_each
    statistic_helpers = StatisticHelpers
  end

  describe 'drawGraphs'
    it 'should draw a graph of the KB up and download rates'
      f = function() {}
      transmission = {}
      graph = {"set_theme": f, "data": f, "draw": f}
      Bluff = {"Pie": function() {return graph;}, "Line": function() {return graph;}}
      transmission['store'] = {"get": function() {return [{"up": 10240, "down": 20480}, {"up": 20480, "down": 10240}];}}
      statistic_helpers.should.receive('drawLines').with_args('up_and_download_stats', {"Upload": [10, 20], "Download": [20, 10]})
      statistic_helpers.drawGraphs()
    end
  end
end
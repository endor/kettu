describe 'Torrents'
  describe 'index'
    it 'should'
      torrent_1 = {}, torrent_2 = {}
      $.extend(torrent_1, JSON.parse(fixture('torrent.json')), {"id": 1, "name": "My first Torrent"})
      $.extend(torrent_2, JSON.parse(fixture('torrent.json')), {"id": 2, "name": "My second Torrent"})
      
      mock_request().and_return({ 'arguments': { 'torrents': [ torrent_1, torrent_2 ] } }, 'application/json', 200)
      
      $('body').append('<div id="torrents"></div>')
      RPC.prototype.handle_success = RPC.prototype.save_handle_success
          
      sammy.runRoute('get', '#/torrents')      
      
      RPC.prototype.handle_success = function() {}
    end

  // before: function () {
  //   this.app = new Sammy.Application(function() {
  //     this.element_selector = '#form_params';
  //     this.use(Sammy.NestedParams);
  //     this.route('post', /test_nested_params/, function() {
  //       this.app.form_params = this.params;
  //       return false;
  //     });
  //   });
  // }
  // 
  // var app = this.app;
  // app.run('#/');
  // $('#nested_params_test_form').submit();
  // soon(function() {
  //   ok(app.form_params);
  //   console.log(app.form_params);
  //   equals(app.form_params['title'], 'xyz!');
  //   app.unload();
  // }, this, 1, 2);                  
  // 
  end
end
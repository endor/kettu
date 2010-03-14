# kettu
Port of http://github.com/kjg/derailleur and the original Transmission Web Client  
using [jquery](http://jquery.com), [sammy](http://github.com/quirkey/sammy) and [mustache.js](http://github.com/janl/mustache.js).

By Frank Prößdorf <fp@notjusthosting.com>.


## Thanks 
* kjg for all the work on the transmission web client and help.
* lenalena for introducing proper jspec testing to this project.


## Usage
You can use kettu instead of the original web client to remotely administrate your transmission application.

Once you allowed remote access in your transmission client, you can simply open the `index.html` in the browser. If you run your transmission application on something other than the default host and port, you can adjust these settings in the `rpc` file.

It's recommended to replace the old web interface with this one, so the server and the web interface run in the same location (e.g. localhost:9091). When uploading torrents there is a cross-site request which leads to a deserved warning. Also Firefox and Chrome will not work because cross-site requests will trigger [preflight requests](http://www.w3.org/TR/access-control/#preflight-request) in those browsers, which the server cannot handle.


## Tests

### Unit Tests
There are [jspecs](http://github.com/visionmedia/jspec) in `/spec` which you can run by opening the `index.html` file within the spec directory.

### Acceptance Tests
There are [culerity](http://github.com/langalex/culerity) tests in `features`. You will need culerity, celerity and the most current htmlunit to run them. You will just need to type `cucumber features/<feature>`.


## Todo
* style it nicely (css) (in progress)
* display errors, also tracker errors in tracker info + torrents list
* when adding new torrent
  * select download folder (type in/categories/? => http://trac.transmissionbt.com/ticket/1496)
  * select and prioritize files
* register content handlers (although this seems to be not fully supported yet) just as in http://trac.transmissionbt.com/ticket/2404
* graphing up/download:
  * aggregate data
* maybe icons for different file types in file list
* periodically update torrent info, especially peer list
* iphone compability
* maybe sort and filter at the same time
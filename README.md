# kettu
Port of http://github.com/kjg/derailleur and the original Transmission Web Client  
using [jquery](http://jquery.com), [sammy](http://github.com/quirkey/sammy), [jspec](http://github.com/visionmedia/jspec) and [mustache.js](http://github.com/janl/mustache.js).

By Frank Prößdorf <fp@notjusthosting.com>.

## Thanks 
* kjg for all the work on the transmission web client and help.
* lenalena for introducing proper jspec testing to this project.

## Usage
You can use kettu instead of the original web client to remotely administrate your transmission application.

Once you allowed remote access in your transmission client, you can simply open the `index.html` in the browser. If you run your transmission application on something other than the default host and port, you can adjust these settings in the `rpc` file.

It's recommended to replace the old web interface with this one, so the server and the web interface run in the same location (e.g. localhost:9091). When uploading torrents there is a cross-site request which leads to a deserved warning. Also Firefox and Chrome will not work because cross-site requests will trigger [preflight requests](http://www.w3.org/TR/access-control/#preflight-request) in those browsers, which the server cannot handle.

## Todo
* sort torrents
* ignore unencrypted clients
* show some tracker information
* show more information about files
* show more information about peers
# kettu
Port of http://github.com/kjg/derailleur and the original Transmission Web Client  
using [jquery](http://jquery.com), [sammy](http://github.com/quirkey/sammy) and [mustache.js](http://github.com/janl/mustache.js).

By Frank Prößdorf <fp@notjusthosting.com>.


## Thanks
* Kriesse for the elegant design.
* kjg for all the work on the transmission web client and help.
* lenalena for introducing proper jspec testing to this project.


## Usage
You can use kettu instead of the original web client to remotely administrate your transmission application.

It is recommended to set the TRANSMISSION_WEB_HOME environment variable to the root path of this web client. Then you just need to open the location to the transmission web server (e.g. localhost:9091) and it will work.

## Tests

### Unit Tests
There are [jspecs](http://github.com/visionmedia/jspec) in `/spec` which you can run by opening the `index.html` file within the spec directory.

### Acceptance Tests
There are [culerity](http://github.com/langalex/culerity) tests in `features`. You will need culerity, celerity and the most current htmlunit to run them. You will just need to type `cucumber features/<feature>`.


## Todo
* display errors, also tracker errors in tracker info + torrents list
* when adding new torrent
  * select download folder (type in/categories/? => http://trac.transmissionbt.com/ticket/1496)
  * select and prioritize files
* graphing up/download:
  * aggregate data
* iphone compability
* maybe sort and filter at the same time
* maybe icons for different file types in file list
* debug why browser sometimes seems to fill up memory and become slower (maybe not cleaning up all intervals?)
* maybe statistics, preferences not as sidebar
* add transmission name (plus logo)
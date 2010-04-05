# kettu
Port of http://github.com/kjg/derailleur and the original Transmission Web Client  
using [jquery](http://jquery.com), [sammy](http://github.com/quirkey/sammy) and [mustache.js](http://github.com/janl/mustache.js).

By Frank Prößdorf <fp@notjusthosting.com>.

kettu osaa monta asiaa.

## Thanks
* Kriesse for the elegant design.
* kjg for all the work on the transmission web client and help.
* lenalena for introducing proper jspec testing to this project.


## Usage
You can use kettu instead of the original web client to remotely administrate your transmission application.

It is recommended to set the TRANSMISSION_WEB_HOME environment variable to the root path of this web client. Then you just need to open the location to the transmission web server (e.g. localhost:9091) and it will work.

## Goals
* Usage should be as simple as possible
* Try out new features that older browsers may not support
* Keep the code clean
* Write tests for everything

## Tests

### Unit Tests
There are [jspecs](http://github.com/visionmedia/jspec) in `/spec` which you can run by opening the `index.html` file within the spec directory.

### Acceptance Tests
There are [culerity](http://github.com/langalex/culerity) tests in `features`. You will need culerity, celerity and the most current htmlunit to run them. You will just need to type `cucumber features/<feature>`.


## Todo
* display errors, also tracker errors in tracker info + torrents list (maybe red)
* iphone compatibility
* debug why browser sometimes seems to fill up memory and become slower (maybe not cleaning up all intervals?)
* extend stats view
* maybe right clicking shows relevant menus
* maybe icons for different file types in file list
* maybe show ratio goal in torrent list (if so, it should be changeable in the settings)
* maybe be able to select multiple torrents and pause/activate them
* maybe actually request if turtle mode is enabled to set correct value
* maybe aggregate graphing data
* clean up torrents controller
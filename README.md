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

### Using Environment Variables
If you're just trying kettu out, it is recommended to set the TRANSMISSION_WEB_HOME environment variable to the root path of this web client. Then you just need to open the location to the transmission web server (e.g. localhost:9091) and it will work.

### Installation
Move the kettu files in the right location, and the next time you start Transmission, it will use kettu.

#### Linux
Without overwriting the default Web Interface, you can drop the kettu files into: `~/.local/share/transmission/web/`.

#### On Mac OS X, using a (pre-v2.0) nightly
In the current (pre-v2.0) nightlies on the mac, you can simply drop kettu in the Transmission Application Support folder and rename it web (`~/Library/Application Support/Transmission/web/`).

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
* update torrent info feature once last_request step is working
* maybe have a trash icon where torrents can be dragged and dropped into
* maybe inspector should open beneath the selected torrent (as with a small arrow pointing first right, then down)
* maybe checkboxes in preferences could be on/off sliders, something with sliders
* maybe some nice animation effects for faceboxes (disappearing), or torrents (disappearing, starting, pausing)
* maybe add <audio> to audio files, transforms
* check for speed bottle necks, needs to be thin, raphael should be loaded at a later point somehow
midi.js
=======
JS/CoffeeScript library to read/play midi files.  Requires soundfonts to be converted
first and available as sf2.js files.  See link for how to generate your sound fonts:

https://github.com/eagsalazar/sf2_to_js

Development
-----------

- If you have an older version of Grunt: `npm uninstall -g grunt`
- `npm install -g grunt-cli`
- `npm install`
- `grunt`

Checkout demos @ `http://localhost:6888/demo/`

Grunt Tasks
-----------

- `grunt` - Compile coffeescript when .coffee files are saved
- `grunt test` - Run jasmine tests
- `grunt release` - Generate midi.js and midi.min.js

TODO
-----------

- device.coffee
  - pitch bend
- sequencer.coffee
  - some bug where things sound assy
  - onNoteOn, onNoteOff events
  - play to multiple "devices" at once, instrument per channel
  - set/force instrument on channel


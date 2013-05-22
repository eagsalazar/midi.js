midi.js
=======

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

- sf2_to_js
  - only reads fonts in bank 000, read all.


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

sf2\_to\_js - generates js versions of soundfont files
-----------

- required gems: midilib, fileutils, colorize, base64
- required system (brew install): fluidsynth, oggenc
- usage:
```ruby
require_relative 'sf2_to_js'
sf = Sf2ToJs.new "./FluidR3_GM.sf2", [105], "~/soundfonts" # Banjo
sf.to_js # -> ~/soundfonts/FluidR3_GM.Banjo.sf2.js
```

- thor script (gem install thor)
  - thor list
  - thor help sf2:to_js

TODO
-----------

- device.coffee
  - pitch bend
- sequencer.coffee
  - some bug where things sound assy
  - onNoteOn, onNoteOff events
  - play to multiple "devices" at once, instrument per channel
  - set/force instrument on channel


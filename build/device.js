(function() {
  var n, name, octave,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Midi.NOTES_TO_NUMBER = {};

  Midi.NOTES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

  n = 21;

  while (n <= 108) {
    octave = (n - 12) / 12 >> 0;
    name = Midi.NOTES[n % 12] + octave;
    Midi.NOTES_TO_NUMBER[name] = n;
    n++;
  }

  Midi.Device = (function(_super) {
    __extends(Device, _super);

    Device.prototype.defaultOptions = {
      onReady: function(self) {
        return {};
      },
      soundFont: Midi.Soundfont.acoustic_grand_piano
    };

    function Device(options) {
      Device.__super__.constructor.call(this, options);
      this._sources = {};
      this._audioBuffers = {};
      this._ctx = new window.webkitAudioContext();
      this._soundFontLoader();
    }

    Device.prototype.noteOn = function(channel, noteNumber, velocity, startTime) {
      var source;

      if (!this._audioBuffers[noteNumber]) {
        return this;
      }
      source = this._createAudioGraph(channel, noteNumber, velocity);
      source.start(this._toDeviceTime(startTime));
      return this;
    };

    Device.prototype.noteOff = function(channel, noteNumber, stopTime) {
      var source;

      source = this._sources[channel + "" + noteNumber];
      if (!source) {
        return this;
      }
      source.gain.linearRampToValueAtTime(1, this._toDeviceTime(stopTime));
      source.gain.linearRampToValueAtTime(0, this._toDeviceTime(stopTime + 500));
      source.stop(this._toDeviceTime(stopTime + 800));
      delete this._sources[channel + "" + noteNumber];
      return this;
    };

    Device.prototype.currentTime = function() {
      return this._ctx.currentTime * 1000;
    };

    Device.prototype.flushSources = function() {
      _.each(this._sources, function(source) {
        return source.stop(0);
      });
      this._sources = {};
      return this;
    };

    Device.prototype._toDeviceTime = function(time) {
      return time / 1000;
    };

    Device.prototype._createAudioGraph = function(channel, noteNumber, velocity) {
      var gainNode, gainValue, source;

      source = this._ctx.createBufferSource();
      source.buffer = this._audioBuffers[noteNumber];
      gainNode = this._ctx.createGainNode();
      gainValue = (velocity / 127) * 2 - 1;
      gainNode.gain.gainValue = Math.max(-1, gainValue);
      source.connect(gainNode);
      gainNode.connect(this._ctx.destination);
      return source;
    };

    Device.prototype._soundFontLoader = function() {
      var notes, processedCount,
        _this = this;

      notes = _.keys(this.options.soundFont);
      processedCount = 0;
      return _.each(notes, function(note) {
        var key64b, keyBin;

        key64b = _this.options.soundFont[note].split(",")[1];
        keyBin = Base64Binary.decodeArrayBuffer(key64b);
        return _this._ctx.decodeAudioData(keyBin, function(buffer) {
          processedCount += 1;
          _this._audioBuffers[Midi.NOTES_TO_NUMBER[note]] = buffer;
          if (processedCount === notes.length - 1) {
            return _this.options.onReady(_this);
          }
        });
      });
    };

    return Device;

  })(Midi.Base);

}).call(this);

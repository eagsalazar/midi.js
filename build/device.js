(function() {
  var n, name, number2key, octave,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Midi.noteNameToNoteNumber = {};

  number2key = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

  n = 21;

  while (n <= 108) {
    octave = (n - 12) / 12 >> 0;
    name = number2key[n % 12] + octave;
    Midi.noteNameToNoteNumber[name] = n;
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

    Device.prototype.noteOn = function(channel, noteNumber, velocity, delay) {
      var source;

      if (!this._audioBuffers[noteNumber]) {
        return this;
      }
      source = this._createAudioGraph(channel, noteNumber, velocity);
      source.start(this._relative2AbsoulteTime(delay));
      return this;
    };

    Device.prototype.noteOff = function(channel, noteNumber, delay) {
      var source, stopTime;

      stopTime = this._relative2AbsoulteTime(delay);
      source = this._sources[channel + "" + noteNumber];
      if (!source) {
        return this;
      }
      source.gain.linearRampToValueAtTime(1, stopTime);
      source.gain.linearRampToValueAtTime(0, stopTime + 0.2);
      source.stop(stopTime + 0.3);
      this._sources[channel + "" + noteNumber] = void 0;
      return this;
    };

    Device.prototype._createAudioGraph = function(channel, noteNumber, velocity) {
      var gainNode, gainValue, source;

      source = this._ctx.createBufferSource();
      this._sources[channel + "" + noteNumber] = source;
      source.buffer = this._audioBuffers[noteNumber];
      source.connect(this._ctx.destination);
      gainNode = this._ctx.createGainNode();
      gainValue = (velocity / 127) * 2 - 1;
      gainNode.connect(this._ctx.destination);
      gainNode.gain.gainValue = Math.max(-1, gainValue);
      source.connect(gainNode);
      return source;
    };

    Device.prototype._soundFontLoader = function() {
      var noteNames, processedCount,
        _this = this;

      noteNames = _.keys(this.options.soundFont);
      processedCount = 0;
      return _.each(noteNames, function(noteName) {
        var key64b, keyBin;

        key64b = _this.options.soundFont[noteName].split(",")[1];
        keyBin = Base64Binary.decodeArrayBuffer(key64b);
        return _this._ctx.decodeAudioData(keyBin, function(buffer) {
          processedCount += 1;
          _this._audioBuffers[Midi.noteNameToNoteNumber[noteName]] = buffer;
          if (processedCount === noteNames.length - 1) {
            return _this.options.onReady(_this);
          }
        });
      });
    };

    Device.prototype._relative2AbsoulteTime = function(delay) {
      delay || (delay = 0);
      if (delay < this._ctx.currentTime) {
        return delay += this._ctx.currentTime;
      } else {
        return delay;
      }
    };

    return Device;

  })(Midi.Base);

}).call(this);

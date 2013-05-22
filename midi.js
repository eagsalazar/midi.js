(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Midi || (window.Midi = {});

  Midi.Base = (function() {
    Base.prototype.defaultOptions = {};

    function Base(options) {
      this.options = _.clone(this.defaultOptions);
      this.set(options);
      this;
    }

    Base.prototype.set = function(options) {
      _.merge(this.options, options);
      return this;
    };

    return Base;

  })();

  Midi.Amplifier = (function(_super) {
    __extends(Amplifier, _super);

    function Amplifier() {
      _ref = Amplifier.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Amplifier.prototype.defaultOptions = {
      volume: 100
    };

    return Amplifier;

  })(Midi.Base);

  Midi.Device = (function(_super) {
    __extends(Device, _super);

    Device.prototype.defaultOptions = {
      onReady: function(self) {
        return {};
      },
      soundFont: nil
    };

    function Device(options) {
      this._ctx = new window.webkitAudioContext();
      this._sources = {};
      this._audioBuffers = {};
      Device.__super__.constructor.call(this, options);
    }

    Device.prototype.set = function(options) {
      Device.__super__.set.call(this, options);
      if (options.soundFont) {
        return this._loadSoundFont();
      }
    };

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

    Device.prototype._loadSoundFont = function() {
      var processedCount,
        _this = this;

      processedCount = 21;
      return _.each(this.options.soundFont, function(note) {
        var note64b, noteBin;

        note64b = note.split(",")[1];
        noteBin = Base64Binary.decodeArrayBuffer(note64b);
        return _this._ctx.decodeAudioData(noteBin, function(buffer) {
          _this._audioBuffers[processedCount] = buffer;
          processedCount += 1;
          if (processedCount === 108) {
            return _this.options.onReady(_this);
          }
        });
      });
    };

    return Device;

  })(Midi.Base);

  Midi.Sequencer = (function(_super) {
    __extends(Sequencer, _super);

    Sequencer.prototype.defaultOptions = {
      midiFile: void 0,
      device: void 0,
      scheduleInterval: 100
    };

    function Sequencer(options) {
      var _base;

      this._state = {
        playState: "STOPPED",
        eventIndex: 0
      };
      Sequencer.__super__.constructor.call(this, options);
      (_base = this.options).device || (_base.device = new Midi.Device);
    }

    Sequencer.prototype.playState = function() {
      return this._state.playState;
    };

    Sequencer.prototype.set = function(options) {
      Sequencer.__super__.set.call(this, options);
      if (options.midiFile) {
        this._loadFile(options.midiFile);
      }
      return this;
    };

    Sequencer.prototype._scheduleSound = function(event, time) {
      event = event[0].event;
      switch (event.subtype) {
        case 'noteOn':
          return this.options.device.noteOn(event.channel, event.noteNumber, event.velocity, time);
        case 'noteOff':
          return this.options.device.noteOff(event.channel, event.noteNumber, time);
      }
    };

    Sequencer.prototype.stop = function(noRestart) {
      clearInterval(this._interval);
      this.options.device.flushSources();
      if (!noRestart) {
        this._state.playState = "STOPPED";
        return this._state.eventIndex = 0;
      }
    };

    Sequencer.prototype.play = function() {
      if (this._state.playState === "PLAYING") {
        this._state.playState = "PAUSED";
        this.stop(true);
      } else {
        this._state.scheduledTime = this.options.device.currentTime() + 250;
        this._state.intervalEndTime = this.options.device.currentTime() + 250;
        this._state.playState = "PLAYING";
        this._playInterval();
        this._interval = setInterval(_.bind(this._playInterval, this), this.options.scheduleInterval);
      }
      return this;
    };

    Sequencer.prototype._playInterval = function() {
      var event;

      this._state.intervalEndTime += this.options.scheduleInterval;
      while (this._state.scheduledTime < this._state.intervalEndTime && this._state.eventIndex < this._events.length) {
        event = this._events[this._state.eventIndex];
        this._scheduleSound(event, this._state.scheduledTime);
        this._state.scheduledTime += event[1];
        this._state.eventIndex++;
      }
      if (this._state.eventIndex >= this._events.length) {
        return this.stop();
      }
    };

    Sequencer.prototype._loadFile = function() {
      var midiEvents, midiObject, midifile64b;

      this.stop();
      midifile64b = window.atob(this.options.midiFile.split(",")[1]);
      midiObject = MidiFile(midifile64b);
      midiEvents = new Replayer(midiObject, 1);
      return this._events = midiEvents.getData();
    };

    return Sequencer;

  })(Midi.Base);

}).call(this);

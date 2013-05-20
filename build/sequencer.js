(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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

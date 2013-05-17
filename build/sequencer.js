(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Midi.Sequencer = (function(_super) {
    __extends(Sequencer, _super);

    Sequencer.prototype.defaultOptions = {
      midiFile: void 0,
      device: void 0
    };

    function Sequencer(options) {
      var _base;

      Sequencer.__super__.constructor.call(this, options);
      (_base = this.options).device || (_base.device = new Midi.Device);
    }

    Sequencer.prototype.set = function(options) {
      Sequencer.__super__.set.call(this, options);
      if (options.midiFile) {
        this._loadFile(options.midiFile);
      }
      return this;
    };

    Sequencer.prototype._queueEvent = function(event) {
      this._queuedTime += event[1];
      event = event[0].event;
      switch (event.subtype) {
        case 'noteOn':
          return this.options.device.noteOn(event.channel, event.noteNumber, event.velocity, this._queuedTime / 1000);
        case 'noteOff':
          return this.options.device.noteOff(event.channel, event.noteNumber, this._queuedTime / 1000);
      }
    };

    Sequencer.prototype.play = function() {
      var events;

      events = this.midiEvents.getData();
      this._queuedTime = 0;
      _.each(events, this._queueEvent, this);
      return this;
    };

    Sequencer.prototype._loadFile = function() {
      var midiObject, midifile64b;

      midifile64b = window.atob(this.options.midiFile.split(",")[1]);
      midiObject = MidiFile(midifile64b);
      return this.midiEvents = new Replayer(midiObject, 1);
    };

    return Sequencer;

  })(Midi.Base);

}).call(this);

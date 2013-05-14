/*! midi.js - v0.0.0 - 2013-05-14 */
(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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

}).call(this);

(function() {
  window.Midi = {};

  Midi.Base = (function() {
    Base.prototype.defaultOptions = {};

    function Base(options) {
      this.options = _.clone(this.defaultOptions);
      this.set(options);
    }

    Base.prototype.set = function(options) {
      return _.merge(this.options, options);
    };

    return Base;

  })();

}).call(this);

(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Midi.Instrument = (function(_super) {
    __extends(Instrument, _super);

    function Instrument() {
      _ref = Instrument.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Instrument.prototype.defaultOptions = {
      soundFont: void 0
    };

    Instrument.prototype.playNote = function(note, ms) {};

    return Instrument;

  })(Midi.Base);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Midi.Player = (function(_super) {
    __extends(Player, _super);

    Player.prototype.defaultOptions = {
      tempo: 1,
      currentTime: 0,
      midiFile: void 0,
      playState: 'stopped',
      instrument: void 0,
      soundFont: void 0,
      amplifier: void 0,
      volume: void 0,
      callbacks: {
        onNote: function() {
          return {};
        },
        onPlay: function() {
          return {};
        },
        onPause: function() {
          return {};
        },
        onStop: function() {
          return {};
        },
        onEnd: function() {
          return {};
        },
        onAdvance: function() {
          return {};
        }
      }
    };

    function Player(options) {
      var _base, _base1;

      (_base = this.options).amplifier || (_base.amplifier = new Midi.Amplifier(_.pick(options, ['volume'])));
      (_base1 = this.options).instrument || (_base1.instrument = new Midi.Instrument(_.pick(options, ['soundFont'])));
      _.extend(options, {
        volume: void 0,
        soundFont: void 0
      });
      Player.__super__.constructor.call(this, options);
    }

    Player.prototype.set = function(options) {
      Player.__super__.set.call(this, options);
      if (options.soundFont) {
        return this.options.instrument.set({
          soundFont: options.soundFont
        });
      } else if (options.volume) {
        return this.options.amplifier.set({
          volume: options.volume
        });
      } else if (options.tempo) {
        return console.log("changed tempo to " + options.tempo);
      }
    };

    Player.prototype.play = function() {
      return this.options.callbacks.onPlay();
    };

    Player.prototype.pause = function() {
      return this.options.callbacks.onPause();
    };

    Player.prototype.stop = function() {
      return this.options.callbacks.onStop();
    };

    Player.prototype.advance = function(ms) {
      return this.options.callbacks.onAdvance();
    };

    return Player;

  })(Midi.Base);

}).call(this);

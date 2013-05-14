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

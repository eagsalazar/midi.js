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

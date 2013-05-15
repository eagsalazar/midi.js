(function() {
  window.Midi || (window.Midi = {});

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

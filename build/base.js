(function() {
  window.Midi || (window.Midi = {});

  Midi.Base = (function() {
    Base.prototype.defaultOptions = {};

    function Base(options) {
      this.options = _.clone(this.defaultOptions);
      this.set(options);
      this;
    }

    Base.prototype.set = function(options) {
      _.extend(this.options, options);
      return this;
    };

    return Base;

  })();

}).call(this);

window.Midi ||= {}
class Midi.Base

  defaultOptions: {}

  constructor: (options) ->
    @options = _.clone(@defaultOptions)
    @set options
    @

  set: (options) ->
    # FIXME - not deep copy!
    # _.merge not available in underscore
    _.extend(@options, options)
    @

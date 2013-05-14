window.Midi = {}
class Midi.Base

  defaultOptions: {}

  constructor: (options) ->
    @options = _.clone(@defaultOptions)
    @set options

  set: (options) ->
    _.merge(@options, options)

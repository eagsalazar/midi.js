class Midi.Instrument < Base

  defaultOptions:
    soundFont: undefined

  constructor: (options) ->
    super options

  playNote: (note) ->

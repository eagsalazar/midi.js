class Midi.Player < Midi.Base

  defaultOptions:

    tempo: 1
    currentTime: 0
    midiFile: undefined
    playState: 'stopped'

    # Provide either Midi.Instrument or soundFont
    # and Instrument will be automatically created.
    instrument: undefined
    soundFont: undefined

    # Provide either Midi.Amplifier or will be
    # automatically created.  Volume, if provided
    # is passed to Amplifier, otherwise default.
    amplifier: undefined
    volume: undefined

    callbacks:
      onNote: () -> {}
      onPlay: () -> {}
      onPause: () -> {}
      onStop: () -> {}
      onEnd: () -> {}
      onAdvance: () -> {}


  constructor: (options) ->
    @options.amplifier |= new Midi.Amplifier(_.pick(options, ['volume']))
    @options.instrument |= new Midi.Instrument(_.pick(options, ['soundFont']))

    _.extend options,
      volume: undefined
      soundFont: undefined

    super options

  set: (options) ->
    super options

    if options.soundFont
      @options.instrument.set {soundFont: options.soundFont}
    else if options.volume
      @options.amplifier.set {volume: options.volume}
    else if options.tempo
      console.log "changed tempo to #{options.tempo}"

  play: () ->
    @options.callbacks.onPlay()

  pause: () ->
    @options.callbacks.onPause()

  stop: () ->
    @options.callbacks.onStop()

  advance: (ms) ->
    @options.callbacks.onAdvance()


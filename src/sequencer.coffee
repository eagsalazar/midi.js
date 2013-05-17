class Midi.Sequencer extends Midi.Base

  defaultOptions:
    midiFile: undefined
    device: undefined

  constructor: (options) ->
    super options
    @options.device ||= new Midi.Device

  set: (options) ->
    super options
    if options.midiFile
      @_loadFile options.midiFile
    @

  _queueEvent: (event) ->
    @_queuedTime += event[1]
    event = event[0].event
    switch event.subtype
      when 'noteOn'
        @options.device.noteOn(event.channel, event.noteNumber, event.velocity, @_queuedTime/1000)
      when 'noteOff'
        @options.device.noteOff(event.channel, event.noteNumber, @_queuedTime/1000)

  play: () ->
    events = @midiEvents.getData()
    @_queuedTime = 0
    _.each events, @_queueEvent, @
    @

  _loadFile: () ->
    midifile64b = window.atob(@options.midiFile.split(",")[1])
    midiObject = MidiFile(midifile64b)
    @midiEvents = new Replayer(midiObject, 1)

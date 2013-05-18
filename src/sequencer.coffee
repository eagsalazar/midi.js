class Midi.Sequencer extends Midi.Base

  defaultOptions:
    midiFile: undefined
    device: undefined
    scheduleInterval: 100

  constructor: (options) ->
    @_state =
      playState: "STOPPED"
      eventIndex: 0

    super options
    @options.device ||= new Midi.Device

  playState: ->
    @_state.playState

  set: (options) ->
    super options
    if options.midiFile
      @_loadFile options.midiFile
    @

  _scheduleSound: (event, time) ->
    event = event[0].event
    switch event.subtype
      when 'noteOn'
        @options.device.noteOn(event.channel, event.noteNumber, event.velocity, time)
      when 'noteOff'
        @options.device.noteOff(event.channel, event.noteNumber, time)

  stop: (noRestart) ->
    clearInterval @_interval
    @options.device.flushSources()
    unless noRestart
      @_state.playState = "STOPPED"
      @_state.eventIndex = 0

  play: () ->
    if @_state.playState == "PLAYING"
      @_state.playState = "PAUSED"
      @stop true
    else
      @_state.scheduledTime = @options.device.currentTime() + 250
      @_state.intervalEndTime = @options.device.currentTime() + 250

      @_state.playState = "PLAYING"
      @_playInterval()
      @_interval = setInterval _.bind(@_playInterval, @), @options.scheduleInterval
    @

  _playInterval: ->
    @_state.intervalEndTime += @options.scheduleInterval

    while @_state.scheduledTime < @_state.intervalEndTime && @_state.eventIndex < @_events.length
      event = @_events[@_state.eventIndex]
      @_scheduleSound event, @_state.scheduledTime
      @_state.scheduledTime += event[1]
      @_state.eventIndex++

    if @_state.eventIndex >= @_events.length
      @stop()

  _loadFile: ->
    @stop()
    midifile64b = window.atob(@options.midiFile.split(",")[1])
    midiObject = MidiFile(midifile64b)
    midiEvents = new Replayer(midiObject, 1)
    @_events = midiEvents.getData()


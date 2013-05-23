class Midi.Device extends Midi.Base

  defaultOptions:
    onReady: (self) -> {}
    soundFont: undefined

  constructor: (options) ->
    @_ctx = new window.webkitAudioContext()
    @_sources = {}
    @_audioBuffers = {}
    super options

  set: (options) ->
    super options
    if options.soundFont
      @_loadSoundFont()

  noteOn: (channel, noteNumber, velocity, startTime) ->
    return @ if (!@_audioBuffers[noteNumber])
    source = @_createAudioGraph(channel, noteNumber, velocity)
    source.start(@_toDeviceTime(startTime))
    @

  noteOff: (channel, noteNumber, stopTime) ->
    source = @_sources[channel + "" + noteNumber]
    return @ if (!source)

    source.gain.linearRampToValueAtTime(1, @_toDeviceTime(stopTime))
    source.gain.linearRampToValueAtTime(0, @_toDeviceTime(stopTime + 500))
    source.stop(@_toDeviceTime(stopTime + 800))
    delete @_sources[channel + "" + noteNumber]
    @

  currentTime: ->
    @_ctx.currentTime * 1000

  flushSources: ->
    _.each @_sources, (source) ->
      source.stop(0)
    @_sources = {}
    @

  _toDeviceTime: (time) ->
    time/1000

  _createAudioGraph: (channel, noteNumber, velocity) ->
    source = @_ctx.createBufferSource()
    #@_sources[channel + "" + noteNumber] = source
    source.buffer = @_audioBuffers[noteNumber]

    gainNode = @_ctx.createGainNode()
    gainValue = (velocity / 127) * 2 - 1
    gainNode.gain.gainValue = Math.max(-1, gainValue)

    source.connect(gainNode)
    gainNode.connect(@_ctx.destination)

    source

  _loadSoundFont: ->
    processedCount = 21
    _.each @options.soundFont, (note) =>
      note64b = note.split(",")[1]
      noteBin = Base64Binary.decodeArrayBuffer(note64b)

      @_ctx.decodeAudioData noteBin, (buffer) =>
        @_audioBuffers[processedCount] = buffer
        processedCount += 1

        if processedCount == 108
          @options.onReady(@)


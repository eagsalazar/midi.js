Midi.NOTES_TO_NUMBER = {} # C8  == 108
Midi.NOTES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

n = 21
while n <= 108
  octave = (n - 12) / 12 >> 0
  name = Midi.NOTES[n % 12] + octave
  Midi.NOTES_TO_NUMBER[name] = n
  n++


class Midi.Device extends Midi.Base

  defaultOptions:
    onReady: (self) -> {}
    soundFont: Midi.Soundfont.acoustic_grand_piano

  constructor: (options) ->
    super options
    @_sources = {}
    @_audioBuffers = {}
    @_ctx = new window.webkitAudioContext()
    @_soundFontLoader()

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

  _soundFontLoader: ->
    notes = _.keys(@options.soundFont)
    processedCount = 0

    _.each notes, (note) =>
      key64b = @options.soundFont[note].split(",")[1]
      keyBin = Base64Binary.decodeArrayBuffer(key64b)

      @_ctx.decodeAudioData keyBin, (buffer) =>
        processedCount += 1
        @_audioBuffers[Midi.NOTES_TO_NUMBER[note]] = buffer

        if processedCount == notes.length - 1
          @options.onReady(@)


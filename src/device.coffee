Midi.noteNameToNoteNumber = {} # C8  == 108
number2key = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

n = 21
while n <= 108
  octave = (n - 12) / 12 >> 0
  name = number2key[n % 12] + octave
  Midi.noteNameToNoteNumber[name] = n
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

  noteOn: (channel, noteNumber, velocity, delay) ->
    if (!@_audioBuffers[noteNumber])
      return @

    source = @_createAudioGraph(channel, noteNumber, velocity)
    source.start(@_relative2AbsoulteTime(delay))
    @

  noteOff: (channel, noteNumber, delay) ->
    stopTime = @_relative2AbsoulteTime(delay)
    source = @_sources[channel + "" + noteNumber]

    if (!source)
      return @

    source.gain.linearRampToValueAtTime(1, stopTime)
    source.gain.linearRampToValueAtTime(0, stopTime + 0.2)
    source.stop(stopTime + 0.3)

    @_sources[channel + "" + noteNumber] = undefined
    @

  _createAudioGraph: (channel, noteNumber, velocity) ->
    source = @_ctx.createBufferSource()
    @_sources[channel + "" + noteNumber] = source
    source.buffer = @_audioBuffers[noteNumber]
    source.connect(@_ctx.destination)

    gainNode = @_ctx.createGainNode()
    gainValue = (velocity / 127) * 2 - 1
    gainNode.connect(@_ctx.destination)
    gainNode.gain.gainValue = Math.max(-1, gainValue)
    source.connect(gainNode)

    source

  _soundFontLoader: ->
    noteNames = _.keys(@options.soundFont)
    processedCount = 0

    _.each noteNames, (noteName) =>
      key64b = @options.soundFont[noteName].split(",")[1]
      keyBin = Base64Binary.decodeArrayBuffer(key64b)

      @_ctx.decodeAudioData keyBin, (buffer) =>
        processedCount += 1
        @_audioBuffers[Midi.noteNameToNoteNumber[noteName]] = buffer

        if processedCount == noteNames.length - 1
          @options.onReady(@)

  _relative2AbsoulteTime: (delay) ->
    delay ||= 0
    if delay < @_ctx.currentTime
      delay += @_ctx.currentTime
    else
      delay


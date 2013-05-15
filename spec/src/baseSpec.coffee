describe "Midi.Base", ->
  beforeEach ->
    @base = new Midi.Base()

  it "sets options on initialize", ->
    expect(typeof @base.options).toEqual typeof 5


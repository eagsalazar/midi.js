describe "Midi.Base", ->
  describe "constructor", ->
    it "should use default options", ->
      base = new Midi.Base()
      expect(base.options).toEqual base.defaultOptions

    it "should merge options passed in", ->
      base = new Midi.Base({foo: 'bar', baz: 'dingleberry'})
      expect(base.options).toEqual {foo: 'bar', baz: 'dingleberry'}

  describe "#set", ->
    beforeEach ->
      @base = new Midi.Base()

    it "should set a single option passed in", ->
      @base.set(foo: 'bar')
      expect(@base.options.foo).toEqual 'bar'

    it "should set multiple options passed in", ->
      @base.set(foo: 'bar', baz: 'dingleberry')
      expect(@base.options).toEqual {foo: 'bar', baz: 'dingleberry'}

    it "should overwrite existing option", ->
      @base.set(foo: 'bar', doo: 'dingleberry')
      @base.set(foo: 'baz')
      expect(@base.options).toEqual {foo: 'baz', doo: 'dingleberry'}


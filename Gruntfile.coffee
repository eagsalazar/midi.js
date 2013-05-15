module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    watch:
      coffee:
        files: ["<%= coffee.compile.src %>"]
        tasks: ['coffee', 'test']

    coffee:
      compile:
        expand: true
        cwd: 'src/'
        src: '**/*.coffee'
        dest: "build/"
        ext: '.js'
      spec:
        expand: true
        cwd: 'spec/src/'
        src: '**/*.coffee'
        dest: "spec/build/"
        ext: '.js'
      dist:
        options:
          join: true
        files:
          "midi.js": ["src/base.coffee", "src/**/*.coffee"]

    coffeelint:
      app: ['src/**/*.coffee', 'spec/**/*.coffee']

    jasmine:
      tests:
        src: 'midi.js'
        options:
          specs: 'spec/build/**/*Spec.js'
          vendor: ['node_modules/lodash/lodash.js']

    clean:
      all: ["spec/build", "build"]
      test: "spec/build"

    connect:
      server:
        options:
          port: 6888
          base: 'demo/'

     concat:
        options:
          banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today('yyyy-mm-dd') %> */\n"
          stripBanners: true
        dist:
          src: "midi.js"
          dest: "midi.js"

      uglify:
        options:
          banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today('yyyy-mm-dd') %> */\n"
          preserveComments: false
          report: 'min'
        dist:
          files:
             'midi.min.js': 'midi.js'

  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-jasmine')
  grunt.loadNpmTasks('grunt-coffeelint')
  grunt.loadNpmTasks('grunt-contrib-clean')

  grunt.registerTask('test', ['coffeelint', 'clean:test', 'coffee:dist', 'coffee:spec', 'jasmine'])
  grunt.registerTask('default', ['clean:all', 'coffee:compile', 'connect', 'watch'])
  grunt.registerTask('release', ['clean:all', 'coffee:compile', 'coffee:dist', 'concat', 'uglify'])


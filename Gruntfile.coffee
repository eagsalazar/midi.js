module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    watch:
      coffee:
        files: "<%= coffee.compile.src %>"
        tasks: 'coffee'

    coffee:
      compile:
        expand: true
        cwd: 'src/'
        src: '**/*.coffee'
        dest: "build/"
        ext: '.js'

    connect:
      server:
        options:
          port: 6888
          base: 'demo/'

     concat:
        options:
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
          stripBanners: true
        dist:
          src: "src/**/.js"
          dest: "midi.js"

      uglify:
        options:
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
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

  grunt.registerTask('default', ['coffee', 'connect', 'watch'])
  grunt.registerTask('release', ['concat', 'uglify'])


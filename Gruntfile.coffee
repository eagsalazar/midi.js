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

    uglify:
      options:
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        build:
          src: 'build/**/*.js'
          dest: '<%= pkg.name %>.min.js'

  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('default', ['coffee', 'watch'])


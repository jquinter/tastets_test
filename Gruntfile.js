module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      build: {
        // the files to concatenate
        compress:  {
          drop_console: true
        },
        mangle: false,
        src: [
          'bower_components/angular/angular.js',
          'bower_components/angular-ui-grid/ui-grid.js',
          'tastets.js'
        ],
        // the location of the resulting JS file
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    copy: {
      api: {
        cwd: '',
        src: [
          'api.php'
        ],
        dest: 'build/'
      },      
      build: {
        cwd: 'bower_components/angular-ui-grid/',
        expand: true,
        src: [
          'ui-grid.*'
        ],
        dest: 'build/'
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'build/<%= pkg.name %>.css': ['bower_components/angular-ui-grid/ui-grid.css']
        }
      }
    },
    rsync: {
      options: {
          args: ["-r -a -v"],
          exclude: ["'.git*'","'*.scss'","node_modules"],
          recursive: true
      },
      build: {
        options: {
          src: "build/",
          dest: "public_html/tastets/",
          host: "webuzo@104.167.119.235",
          delete: true // Careful this option could cause data loss, read the docs! 
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-rsync');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'copy', 'cssmin', 'uglify', 'rsync']);

};
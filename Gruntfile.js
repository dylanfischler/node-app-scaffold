module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: ["dist/public/**/*", "dist/server/**/*", "dist/config/**/*"]
    },
    wiredep: {
      task: {
        src: [
          'src/server/views/index.ejs'
        ],
        options: {
          ignorePath: "../../client/"
        }
      }
    },
    concat: {
      options: {
        separator: ';\n'
      },
      dist: {
        src: ['src/client/js/**/*.js', '!src/client/js/static_lib/*.js'],
        dest: 'dist/public/js/scripts.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/public/js/scripts.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/config/**/*.js', 'src/client/js/**/*.js', 'src/server.js', 'src/server/**/*.js', '!src/client/js/static_lib/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    sass: {
      dist: {
        files: {
          'dist/public/css/main.css': 'src/client/sass/main.scss'
        }
      }
    },
    copy: {
      assets: {
        files: [
          {expand: true, cwd: "src/client/lib", src: ['**'], dest: 'dist/public/lib', filter: 'isFile'},
          {expand: true, cwd: "src/client/assets", src: ['**'], dest: 'dist/public/assets', filter: 'isFile'},
          {expand: true, cwd: "src/client/js/static_lib", src: ['**'], dest: 'dist/public/js/static_lib', filter: 'isFile'}
        ]
      },
      views: {
        files: [
          {expand: true, cwd: "src/client/views/", src: ['**'], dest: 'dist/public/views', filter: 'isFile'}
        ]
      },
      server: {
        files: [
          {expand: true, cwd: "src", src: ['server.js'], dest: 'dist/', filter: 'isFile'},
          {expand: true, cwd: 'src/server/', src: ['**'], dest: 'dist/server', filter: 'isFile'},
          {expand: true, cwd: "src/config/", src: ['**'], dest: 'dist/config', filter: 'isFile'}
        ]
      }

    },
    watch: {
      appFiles: {
        files: ['src/**/*', 'bower.json', 'Gruntfile.js'],
        tasks: ['default'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ['clean','wiredep', 'jshint', 'concat', 'uglify', 'copy', 'sass']);
  grunt.registerTask('development', ['clean','wiredep', 'jshint', 'concat', 'uglify', 'copy','sass', 'watch']);

};
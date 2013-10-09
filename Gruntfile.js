module.exports = function (grunt) {


    // configuration
    grunt.initConfig({
        

        pkg: grunt.file.readJSON('package.json'),


        folder:  grunt.file.readJSON('folder.json'),


        assemble: {
            options: {
                flatten: true,
                layout: '<%= folder.layouts_source %>/master.hbs',
                partials: "<%= folder.partials_source %>/**/*.hbs"
            },
            pages: {
                src: ['<%= folder.templates_source %>/*.hbs'],
                dest: '<%= folder.dist %>/'
            }
        },


        clean: {
            css: ["<%= folder.css_dist %>"],
            dist: ["<%= folder.dist %>/*"],
            htc: ["<%= folder.resources_dist %>/htc"],
            images: ["<%= folder.resources_dist %>/imgs"],
            javascripts: ["js_dist"],
            pages: ["<%= folder.dist %>/*.html"]
        },


        concat: {
            options: {
                separator: '\n',
            },
            debug: {
                src: [
                    '<%= folder.js_source %>/libs/jquery.js',
                    '<%= folder.js_source %>/common.js'
                ],
                dest: '<%= folder.js_dist %>/main.js',
                nonull: true
            }
        },


        connect: {
            server: {
                options: {
                    port: 9000,
                    base: ['<%= folder.dist %>', '<%= folder.resources_dist %>']
                }
            }
        },


        compass: {
            dist: {
                options: {
                    sassDir: '<%= folder.css_source %>',
                    cssDir: '<%= folder.css_dist %>'
                }
            }
        },


        copy: {
            main: {
                expand: true,
                cwd: '<%= folder.resources_source %>/',
                src: ['htc/*', 'imgs/**'],
                dest: '<%= folder.resources_dist %>'
            }
        },


        jshint: {
            files: ['<%= folder.js_source %>/**/*.js'],
            options: {
                ignores: ['<%= folder.js_source %>/libs/**/*.js']
            }
        },


        prettify: {
            options: {
                "indent": 4,
                "indent_char": " ",
                "indent_scripts": "normal",
                "wrap_line_length": 0,
                "brace_style": "collapse",
                "preserve_newlines": true,
                "max_preserve_newlines": 1,
                "unformatted": [
                    // "a",
                    "code",
                    "pre"
                ]
            },
            all: {
                expand: true,
                cwd: '<%= folder.dist %>/',
                ext: '.html',
                src: ['*.html'],
                dest: '<%= folder.dist %>/'
            }
        },


        watch: {
            handlebars: {
                files: ['<%= folder.templates_source %>/**/*.hbs'],
                tasks: ['assemble', 'prettify']
            },
            images: {
                files: ['<%= folder.resources_source %>/imgs/**/*'],
                tasks: ['clean:images', 'copy']
            },
            javascript: {
                files: ['<%= folder.js_source %>/**/*.js'],
                tasks: ['jshint', 'concat']
            },
            sass: {
                files: ['<%= folder.css_source %>/**/*.scss'],
                tasks: ['compass']
            }
        }


    });


    // load npm tasks
    grunt.util._.each([
        'assemble',
        'grunt-contrib-clean',
        'grunt-contrib-connect',
        'grunt-contrib-compass',
        'grunt-contrib-concat',
        'grunt-contrib-copy',
        'grunt-contrib-jshint',
        'grunt-contrib-sass',
        'grunt-contrib-watch',
        'grunt-prettify'
    ], function (tasks) {
        grunt.loadNpmTasks(tasks);
    });


    // define grunt tasks
    grunt.registerTask('default', [
        'server'
    ]);
    

    grunt.registerTask('server', [
        'build',
        'connect:server',
        'watch'
    ]);
    

    grunt.registerTask('build', [
        'clean:dist',
        'assemble',
        'concat',
        'compass',
        'copy',
        'prettify'
    ]);


}
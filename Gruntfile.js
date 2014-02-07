module.exports = function (grunt) {


    // configuration
    grunt.initConfig({


        pkg: grunt.file.readJSON('package.json'),


        folder:  grunt.file.readJSON('folder.json'),


        assemble: {
            options: {
                flatten: true,
                data: 'source/data/*.json',
                layout: '<%= folder.layouts_source %>/master.hbs',
                partials: "<%= folder.partials_source %>/**/*.hbs"
            },
            development: {
                options: {
                    production: false
                },
                src: ['<%= folder.templates_source %>/*.hbs'],
                dest: '<%= folder.dist %>/'
            },
            production: {
                options: {
                    production: true
                },
                src: ['<%= folder.templates_source %>/*.hbs'],
                dest: '<%= folder.dist %>/'
            }
        },


        autoprefixer: {
            options: {
                browsers: ['last 4 version', 'ie 10', 'ie 9', 'ie 8', 'ie 7']
            },
            production: {
                src: ['<%= folder.css_dist %>/styles.css'],
                dest: '<%= folder.css_dist %>/styles.css'
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
            javascript: {
                src: [
                    '<%= folder.js_source %>/libs/jquery.js',
                    '<%= folder.js_source %>/libs/bootstrap.min.js',
                    '<%= folder.js_source %>/common.js'
                ],
                dest: '<%= folder.js_dist %>/main.js',
                nonull: true
            },
            css: {
                src: [
                    '<%= folder.css_dist %>/bootstrap.min.css',
                    '<%= folder.css_dist %>/flat-ui.min.css',
                    '<%= folder.css_dist %>/custom.css'
                ],
                dest: '<%= folder.css_dist %>/styles.css',
                nonull: true
            }
        },


        connect: {
            server: {
                options: {
                    hostname: '*',
                    port: 9000,
                    base: ['<%= folder.dist %>', '<%= folder.resources_dist %>']
                }
            }
        },


        compass: {
            dev: {
                options: {
                    sassDir: '<%= folder.css_source %>',
                    cssDir: '<%= folder.css_dist %>',
                    environment: 'development',
                    bundleExec: true
                }
            },
            dist: {
                options: {
                    sassDir: '<%= folder.css_source %>',
                    cssDir: '<%= folder.css_dist %>',
                    environment: 'production',
                    bundleExec: true
                }
            }
        },


        copy: {
            main: {
                expand: true,
                cwd: '<%= folder.resources_source %>/',
                src: ['htc/*', 'imgs/**', 'fonts/**', 'css/bootstrap.min.css'],
                dest: '<%= folder.resources_dist %>'
            }
        },


        'ftp-deploy': {
            build: {
                auth: {
                    host: 'roethig.it',
                    port: 21,
                    authKey: 'ftpkey'
                },
                src: '<%= folder.dist %>',
                dest: '/htdocs'
            }
        },



        less: {
            production: {
                options: {
                    paths: ['<%= folder.css_source %>/libs/flat-ui-less'],
                    yuicompress: true
                },
                files: {
                    '<%= folder.css_dist %>/flat-ui.min.css': '<%= folder.css_source %>/flat-ui-less/flat-ui.less'
                }
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


        uglify: {
            production: {
                files: {
                    '<%= folder.dist %>/resources/js/main.min.js': ['<%= folder.dist %>/resources/js/main.js']
                }
            }
        },


        uncss: {
            dist: {
                files: {
                    '<%= folder.dist %>/resources/css/styles.css': [
                        '<%= folder.dist %>/index.html',
                        '<%= folder.dist %>/like.html',
                        '<%= folder.dist %>/projects.html',
                        '<%= folder.dist %>/resume.html'
                    ]
                },
                options: {
                    compress: true,
                    ignore: ['.country-visible']
                }
            }
        },


        watch: {
            options: {
                livereload: true
            },
            data: {
                files: ['source/data/**/*.json'],
                tasks: ['assemble:development', 'prettify']
            },
            handlebars: {
                files: ['<%= folder.templates_source %>/**/*.hbs'],
                tasks: ['assemble:development', 'prettify']
            },
            images: {
                files: ['<%= folder.resources_source %>/imgs/**/*'],
                tasks: ['clean:images', 'copy']
            },
            javascript: {
                files: ['<%= folder.js_source %>/**/*.js'],
                tasks: ['jshint', 'concat:javascript']
            },
            sass: {
                files: ['<%= folder.css_source %>/**/*.scss'],
                tasks: ['compass:dev', 'autoprefixer']
            },
            less: {
                files: ['<%= folder.css_source %>/**/*.less'],
                tasks: ['less']
            }
        }


    });


    // load npm tasks
    grunt.util._.each([
        'assemble',
        'grunt-autoprefixer',
        'grunt-contrib-clean',
        'grunt-contrib-connect',
        'grunt-contrib-compass',
        'grunt-contrib-concat',
        'grunt-contrib-copy',
        'grunt-ftp-deploy',
        'grunt-contrib-jshint',
        'grunt-contrib-sass',
        'grunt-contrib-less',
        'grunt-contrib-uglify',
        'grunt-contrib-watch',
        'grunt-prettify',
        'grunt-uncss'
    ], function (tasks) {
        grunt.loadNpmTasks(tasks);
    });


    // define grunt tasks
    grunt.registerTask('default', [
        'server'
    ]);


    grunt.registerTask('server', [
        'build_dev',
        'connect:server',
        'watch'
    ]);

    grunt.registerTask('build_dev', [
        'clean:dist',
        'assemble:development',
        'concat:javascript',
        'less',
        'compass:dev',
        'copy',
        'concat:css',
        'prettify',
        'uglify:production',
        'uncss:dist',
        'autoprefixer'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'assemble:production',
        'concat:javascript',
        'less',
        'compass:dist',
        'copy',
        'concat:css',
        'prettify',
        'uglify:production',
        'uncss:dist',
        'autoprefixer'
    ]);

    grunt.registerTask('deploy', [
        'build',
        'ftp-deploy',
    ]);

}
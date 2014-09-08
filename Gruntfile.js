'use strict';
var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9000;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'lodash'

module.exports = function (grunt) {

    /**
     * Callback from the shell:save-stamp task. The stamp is a git formatted
     * show for the latest commit, comprised of a short commit sha followed by
     * a formatted date. This splits off the time of day part of the date (which
     * would result in an unusable file name), and then saves the grunt config
     * buildstamp property. This is called with the result of a shell command.
     *
     * @function saveStamp
     *
     * @param  {String}   err    Error description
     * @param  {String}   stdout Results of shell command
     * @param  {String}   stderr Error description
     * @param  {Function} cb     Task requires that this be called at the end
     *                           of this callback.
     */
    function saveStamp (err, stdout, stderr, cb) {
        var stamp = stdout.split(' ')[0];
        grunt.log.writeln('stamp = ' + stamp);
        grunt.config.set('buildstamp', stamp);
        cb();
    }

    /**
     * Read host configuration to use for deploy tasks. If ssh keys are
     * available for authentication, check that here since it cannot be
     * determned from the config file itself. Provide to the configuration as
     * the property 'agent' if available.
     *
     * @function readConfig
     *
     * @param  {String} fileName Path to cofig file to read.
     */
    function readConfig (fileName) {
        var config = grunt.file.readJSON(fileName);

        if (process.env.SSH_AUTH_SOCK) {
            config.agent = process.env.SSH_AUTH_SOCK;
        }

        return config;
    }

    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        host: grunt.file.readJSON('host.json'),
        yeoman: yeomanConfig,
        sshconfig: {
            production: readConfig('host.production.json')
        },
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass']
            },
            livereload: {
                options: {
                    livereload: grunt.option('livereloadport') || LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                    '<%= yeoman.app %>/scripts/templates/*.dust',
                    'test/spec/**/*.js'
                ]
            },
            dustjs: {
                files: [
                    '<%= yeoman.app %>/scripts/templates/*.dust'
                ],
                tasks: ['dust']
            },
            test: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js', 'test/spec/**/*.js'],
                tasks: ['test:true']
            }
        },
        connect: {
            options: {
                port: grunt.option('port') || SERVER_PORT,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            },
            test: {
                path: 'http://localhost:<%= connect.test.options.port %>'
            }
        },
        clean: {
            dist: ['.tmp', '<%= yeoman.dist %>/*'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/plugins/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.test.options.port %>/index.html']
                }
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.app %>/bower_components',
                relativeAssets: true
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        // not enabled since usemin task does concat and uglify
        // check index.html to edit your build targets
        // enable this task if you prefer defining your build targets here
        /*uglify: {
            dist: {}
        },*/
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%= yeoman.app %>/styles/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,txt}',
                            '.htaccess',
                            'images/{,*/}*.{webp,gif}',
                            'styles/fonts/{,*/}*.*',
                            'data/{,*/}*.json',
                            'documents/{,*/}*.*'
                        ]
                    },
                    {
                        expand: true,
                        dot: false,
                        cwd: '<%= yeoman.app %>/bower_components/76d-social-icons/assets/fonts',
                        dest: '<%= yeoman.dist %>/styles/fonts',
                        src: '*.{eot,svg,ttf,woff}'
                    }
                ]
            }
        },
        dustjs: {
            compile: {
                files: {
                    '.tmp/scripts/templates.js': ['<%= yeoman.app %>/templates/*.dust']
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '/styles/fonts/{,*/}*.*',
                        'bower_components/sass-bootstrap/fonts/*.*'
                    ]
                }
            }
        },
        ver: {
            dist: {
                phases: [
                    {
                        files: [
                            '<%= yeoman.dist %>/data/{,*/}*.json',
                            '<%= yeoman.dist %>/documents/{,*/}*.pdf'
                        ],
                        references: [
                            '<%= yeoman.dist %>/scripts/*.main.js'
                        ]
                    },
                    {
                        files: [
                            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        ],
                        references: [
                            '<%= yeoman.dist %>/styles/{,*/}*.css',
                            '<%= yeoman.dist %>/data/{,*/}*.json',
                            '<%= yeoman.dist %>/scripts/*.main.js'
                        ]
                    }
                ],
                versionFile: '<%= yeoman.dist %>/version.json'
            }
        },
        shell: {
            stamp: {
                command: 'git show --format="' + 'window.build_stamp = \'rev: %h date: %ci\';%n' + '" --quiet > .tmp/scripts/stamp.js'
            },
            'save-stamp': {
                command: 'git show --format="%h_%ci" --quiet',
                options: {
                    callback: saveStamp
                }
            },
            'archive-dist': {
                command: [
                    'cd dist',
                    'tar --exclude=.DS_Store -c -z -f ../<%= buildstamp %>.tar.gz .',
                    'cd ..'
                ].join('&&')
            },
            'clean-dist': {
                command: 'rm <%= buildstamp %>.tar.gz'
            }
        },
        sshexec: {
            'do-release': {
                command: [
                    'mkdir -p <%= host.base %>/releases',
                    'mkdir <%= host.base %>/releases/<%= buildstamp %>',
                    'tar -xzf <%= host.base %>/<%= buildstamp %>.tar.gz -C <%= host.base %>/releases/<%= buildstamp %>',
                    'rm <%= host.base %>/<%= buildstamp %>.tar.gz',
                    'rm -rf <%= host.docroot %>',
                    'ln -s <%= host.base %>/releases/<%= buildstamp %> <%= host.docroot %>'
                ].join('&&')
            }
        },
        sftp: {
            'push-up': {
                files: {
                    './': '<%= buildstamp %>.tar.gz'
                },
                options: {
                    showProgress: true
                }
            }
        }
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve' + (target ? ':' + target : '')]);
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build:dist', 'open:server', 'connect:dist:keepalive']);
        }

        if (target === 'test') {
            return grunt.task.run([
                'clean:server',
                'dustjs',
                'compass:server',
                'connect:test',
                'open:test',
                'watch'
            ]);
        }

        grunt.task.run([
            'clean:server',
            'dustjs',
            'compass:server',
            'connect:livereload',
            'open:server',
            'watch'
        ]);
    });

    grunt.registerTask('test', function (isConnected) {
        isConnected = Boolean(isConnected);
        var testTasks = [
                'clean:server',
                'dustjs',
                'compass',
                'connect:test',
                'mocha',
            ];

        if(!isConnected) {
            return grunt.task.run(testTasks);
        } else {
            // already connected so not going to connect again, remove the connect:test task
            testTasks.splice(testTasks.indexOf('connect:test'), 1);
            return grunt.task.run(testTasks);
        }
    });

    grunt.registerTask('build', function (target) {

        if (target === 'dev') {
            grunt.task.run([
                'clean:dist',
                'dustjs',
                'shell:stamp',
                'compass:dist',
                'useminPrepare',
                'imagemin',
                'htmlmin',
                'concat',
                'copy',
                'usemin'
            ]);
        }
        else if (target === 'dist') {
            grunt.task.run([
                'clean:dist',
                'dustjs',
                'shell:stamp',
                'compass:dist',
                'useminPrepare',
                'imagemin',
                'htmlmin',
                'concat',
                'cssmin',
                'uglify',
                'copy',
                'rev',
                'usemin',
                'ver'
            ]);
        }
    });

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build:dist'
    ]);

    grunt.registerTask('deploy', [
        'shell:save-stamp',
        'shell:archive-dist',
        'sftp:push-up',
        'sshexec:do-release',
        'shell:clean-dist'
    ]);
};

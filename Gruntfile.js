/*global module:false*/
module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['<%= pkg.name %>/scripts/*.js'],
                dest: 'dist/<%= pkg.name %>/scripts/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>/scripts/<%= pkg.name %>.min.js'
            }
        },
        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            dist: {
                options: {
                    sassDir: '<%= pkg.name %>/styles',
                    cssDir: 'dist/<%= pkg.name %>/styles'
                }
            },
            dev: {
                options: {
                    sassDir: '<%= pkg.name %>/styles',
                    cssDir: '<%= pkg.name %>/styles'
                }
            }
        },
        cssmin: {
           dist: {
             files: {
               'dist/<%= pkg.name %>/styles/<%= pkg.name %>.css': '<%= compass.dist.options.cssDir %>/*.css'
             }
           }
        },
        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.name %>/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: 'dist/<%= pkg.name %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.name %>/images',
                    src: '{,*/}*.svg',
                    dest: 'dist/<%= pkg.name %>/images'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= pkg.name %>',
                    src: ['*.html', 'views/{,*/}*.html'],
                    dest: 'dist/<%= pkg.name %>'
                }]
            }
        },
        connect:{
            options:{
                port:9000,
                hostname: 'localhost',
                base:'<%= pkg.name %>',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base:'<%= pkg.name %>'
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            compass: {
                files: ['<%= pkg.name %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:dev']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            all:{
                files:['<%= pkg.name %>/*.html', '<%= pkg.name %>/scripts/*.js']
            }
        }
    });

    // Default task.

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'concat',
        'uglify',
        'compass',
        'htmlmin',
        'imagemin',
        'svgmin',
        'cssmin'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

};

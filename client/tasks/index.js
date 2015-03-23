'use strict';

var gulp = require('gulp'),
    browserify = require('browserify'),
    del = require('del'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify');

module.exports = function (grunt) {


    grunt.registerTask("buildToolsClient", "Builds the merchant tools client", function () {

        grunt.file.setBase(__dirname + "/..");

        grunt.log.writeln("Building tools client to ", this.options().buildDir);

        var destDir = this.options().buildDir;

        gulp.task('build', function (done) {

            browserify({
                standalone: 'Tools',
                transform: ['reactify'],
                extensions: ['.jsx'],
                entries: ['./src/jsx/dropdown.jsx', './src/jsx/dashboard.jsx']
            })
                .bundle()
                .pipe(source('tools.js'))
                // .pipe(buffer())
                // .pipe(uglify())
                .pipe(gulp.dest(destDir));

        });

        gulp.start('build', this.async());
    });
};
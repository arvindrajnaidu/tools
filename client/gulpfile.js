"use strict";

var gulp = require('gulp');
var browserify = require('browserify');  // Bundles JS.
var del = require('del');  // Deletes files.
var source = require('vinyl-source-stream');
var less = require('gulp-less');
var svgSprite = require('gulp-svg-sprite');

// An example of a dependency task, it will be run before the css/js tasks.
// Dependency tasks should call the callback to tell the parent task that
// they're done.

gulp.task('clean', function(done) {
    del(['dist', 'public'], done);
});

// Our CSS task. It finds all our Stylus files and compiles them.

gulp.task('css', ['clean'], function () {
    gulp.src('./src/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/css'));

    var config = {
        mode: {
            css: {     // Activate the «css» mode
                render: {
                    css: true  // Activate CSS output (with default options)
                }
            }
        }
    };

    //Bundle svgs
    gulp.src('./src/img/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulp.dest('./dist/img/svg'));

    gulp.src('./src/img/*.png')
        .pipe(gulp.dest('./dist/img'));
});

// Our JS task. It will Browserify our code and compile React JSX files.
gulp.task('js', function() {

    browserify({
        standalone: 'Tools',
        transform : ['reactify'],
        extensions: ['.jsx'],
        entries: ['./src/jsx/tools.jsx']
    })
    .bundle()
    .pipe(source('tools.js'))
    .pipe(gulp.dest('./dist/js'));
});

// 
gulp.task('pisces', function() {

    browserify({
        standalone: 'Tools',
        transform : ['reactify'],
        extensions: ['.jsx'],
        entries: ['./src/jsx/tools.pisces.jsx']
    })
    .bundle()
    .pipe(source('tools.pisces.js'))
    .pipe(gulp.dest('./dist/js'));
});

// Rerun tasks whenever a file changes
gulp.task('watch', function() {
    gulp.watch(['src/**/*'], ['css', 'js', 'pisces']);
});

// The default task (called when we run `gulp` from cli)
gulp.task('default', ['watch', 'css', 'js']);

gulp.task('build', ['css', 'js']);

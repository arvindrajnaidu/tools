"use strict";

var gulp = require('gulp');
var browserify = require('browserify');  // Bundles JS.
var del = require('del');  // Deletes files.
var source = require('vinyl-source-stream');
var less = require('gulp-less');

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
    .pipe(gulp.dest('./public/css/components/tools'))

    gulp.src('./src/img/*')
        .pipe(gulp.dest('./public/img'));
});

// Our JS task. It will Browserify our code and compile React JSX files.
gulp.task('js', function() {

    browserify({
        standalone: 'Tools',
        transform : ['reactify'],
        extensions: ['.jsx'],
        entries: ['./src/jsx/dropdown.jsx', './src/jsx/dashboard.jsx']
    })
    .bundle()
    .pipe(source('tools.js'))
    .pipe(gulp.dest('./public/js/components/tools'));
    // .pipe(gulp.dest('../../../public/js/components/tools'));
});

// Rerun tasks whenever a file changes.
gulp.task('watch', function() {
    gulp.watch(['src/**/*'], ['js']);
});

// The default task (called when we run `gulp` from cli)
gulp.task('default', ['watch', 'css', 'js']);

gulp.task('build', ['css', 'js']);

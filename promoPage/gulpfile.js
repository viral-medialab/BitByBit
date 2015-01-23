'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    rimraf = require('gulp-rimraf'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify =  require('gulp-uglify');
    

// Modules for webserver and livereload
var express = require('express'),
    refresh = require('gulp-livereload'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 4500;

// Set up an express server (not starting it yet)
var server = express();
server.use(livereload({port: livereloadport}));// Add live reload
server.use(express.static('./dist')); // Use our 'dist' folder as rootfolder
server.all('/*', function(req, res) { // Because I like HTML5 pushstate .. this redirects everything back to our index.html
  res.sendFile('index.html', { root: 'dist' });
});


// Dev task
gulp.task('dev', ['static-resources', 'styles', 'lint'], function() { });

 
// Clean task
// gulp.task('clean', function() {
//   gulp.src('./dist/templates', { read: false }) // much faster
//   .pipe(rimraf({force: true}));
// });


// JSHint task
gulp.task('lint', function() {
  gulp.src('app/scripts/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(gulp.dest('dist/js/'));
});


// Styles task
gulp.task('styles', function() {
  gulp.src('app/styles/*.scss')
  .pipe(sass({onError: function(e) { console.log(e); } })) // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
  .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8')) // Optionally add autoprefixer
  .pipe(gulp.dest('dist/css/'));
});


// Static Resources task
gulp.task('static-resources', function() {
  gulp.src('app/index.html').pipe(gulp.dest('dist/')); // Get our index.html, And put it in the dist folder
  gulp.src('app/favicon.ico').pipe(gulp.dest('dist/'));
  gulp.src('app/images/*').pipe(gulp.dest('dist/images/'));
  gulp.src('app/scripts/*.js').pipe(gulp.dest('dist/js/'));
});


// Watch task
gulp.task('watch', ['lint'], function() {
  server.listen(serverport);// Start webserver
  refresh.listen(livereloadport);// Start live reload

  gulp.watch(['app/scripts/*.js'],['lint']); // Watch our scripts, and when they change run lint and browserify
  gulp.watch(['app/styles/*.scss'], ['styles']); // Watch our sass files
  gulp.watch(['app/*.html'], ['static-resources']);
  gulp.watch('./dist/**').on('change', refresh.changed);

});


// Default task
gulp.task('default', ['dev', 'watch']);


'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    rimraf = require('gulp-rimraf'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    ngAnnotate =  require('gulp-ng-annotate'),
    uglify =  require('gulp-uglify');
    // chartjs = require('chartjs')

// Modules for webserver and livereload
var express = require('express'),
    refresh = require('gulp-livereload'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 7000;

// Set up an express server (not starting it yet)
var server = express();
server.use(livereload({port: livereloadport}));// Add live reload
server.use(express.static('./dist')); // Use our 'dist' folder as rootfolder
server.all('/*', function(req, res) { // Because I like HTML5 pushstate .. this redirects everything back to our index.html
  res.sendFile('index.html', { root: 'dist' });
});


// Dev task
gulp.task('dev', ['clean', 'static-resources', 'styles', 'lint', 'browserify'], function() { });

 
// Clean task
gulp.task('clean', function() {
  gulp.src('./dist/templates', { read: false }) // much faster
  .pipe(rimraf({force: true}));
});


// JSHint task
gulp.task('lint', function() {
  gulp.src('app/scripts/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});


// Styles task
gulp.task('styles', function() {
  gulp.src('app/styles/*.scss')
  .pipe(sass({onError: function(e) { console.log(e); } })) // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
  .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8')) // Optionally add autoprefixer
  .pipe(gulp.dest('dist/css/'));
});


// Browserify task
gulp.task('browserify', function() {
  // Single point of entry (make sure not to src ALL your files, browserify will figure it out)
  gulp.src(['app/scripts/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('bundle.js')) // Bundle to a single file
  .pipe(ngAnnotate())
  // .pipe(uglify())
  .pipe(gulp.dest('dist/js'));
});


// Static Resources task
gulp.task('static-resources', function() {
  gulp.src('app/index.html').pipe(gulp.dest('dist/')); // Get our index.html, And put it in the dist folder
  gulp.src('app/favicon.ico').pipe(gulp.dest('dist/'));
  gulp.src('app/templates/**/*').pipe(gulp.dest('dist/templates/')); // Any other view files from app/templates, Will be put in the dist/templates folder
  gulp.src('app/modules/landing/*.html').pipe(gulp.dest('dist/templates/')); 
  gulp.src('app/images/*').pipe(gulp.dest('dist/images/'));
  gulp.src('app/scripts/libraries/*.js').pipe(gulp.dest('dist/js/'));
  gulp.src('app/content/*').pipe(gulp.dest('dist/content/'));
});


// Watch task
gulp.task('watch', ['lint'], function() {
  server.listen(serverport);// Start webserver
  refresh.listen(livereloadport);// Start live reload

  gulp.watch(['app/scripts/*.js'],['lint','browserify']); // Watch our scripts, and when they change run lint and browserify
  // gulp.watch(['app/scripts/**/*.js'],['static-resources']); 
  gulp.watch(['app/modules/**/*.js'],['lint','browserify']);
  gulp.watch(['app/styles/**/*.scss'], ['styles']); // Watch our sass files
  gulp.watch(['app/modules/**/*.scss'], ['styles']); // Watch our sass files
  gulp.watch(['app/**/*.html'], ['static-resources']);
  gulp.watch('./dist/**').on('change', refresh.changed);

});


// Default task
gulp.task('default', ['dev', 'watch']);


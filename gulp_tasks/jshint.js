(function(){
  'use strict';

  var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish');

  var $ = require('gulp-load-plugins')();

  var scripts = [
    'client/app/**/**.js'
  ];

  // Lint JavaScript
  gulp.task('jshint', function () {
    return gulp.src(scripts)
      //.pipe(reload({stream: true, once: true}))
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'));
    //.pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
  });

  gulp.task('eslint', function () {
    return gulp.src('src/**/*.js')
      .pipe($.eslint())
      .pipe($.eslint.format())
  });

})();

(function () {
  'use strict';

  var gulp = require('gulp');
  var $ = require('gulp-load-plugins')();
  var scripts = [
    'client/app/**/*.js',
    'server/**/*.js',
    'gulpfile.js',
    'gulp_tasks/**/*.js',

    '!client/app/vendor/**',
    '!node_modules/**',
    '!bower_components/**'
  ];

  gulp.task('lint', function () {
    return gulp.src(scripts)
      .pipe($.eslint())
      .pipe($.eslint.format());
  });

})();

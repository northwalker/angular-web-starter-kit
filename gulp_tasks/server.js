var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('nodemon', function (cb) {

  $.util.log('Running platform:', $.util.colors.cyan(process.platform)); // 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
  $.util.log('Running env.NODE_ENV:', $.util.colors.magenta(process.env.NODE_ENV));
  //console.log('[AWSK] Running platform:', process.platform);       // 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
  //console.log('[AWSK] Running env.NODE_ENV:', process.env.NODE_ENV);

  var started = false;
  return nodemon({
    script: './server/server.js'
  }).on('start', function () {
    // Avoid nodemon being started multiple times
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('browser-sync', ['nodemon'], function () {

  browserSync.init(null, {
    proxy: 'http://localhost:4000',
    files: ['dist/**/*.*'],
    // browser: "google chrome",
    port: 4001
  });
});

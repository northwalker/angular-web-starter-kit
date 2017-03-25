var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var del = require('del');
var path = require('path');
var es = require('event-stream');
var series = require('stream-series');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
// var util = require('util');  // Node.js
// var pagespeed = require('psi');

var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var paths = {
  src: 'client',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e'
};

gulp.task('default', ['browser-sync'], function () {

});

gulp.task('dev_clean', function (callback) {
  var folderPaths = [paths.tmp];
  del(folderPaths).then(function () {
    $.util.log('Files or folders that would be deleted:', folderPaths);
    callback();
  });
});

// Compile and automatically prefix stylesheets
gulp.task('dev_styles', function () {

  var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];
  var sassOptions = {
    precision: 10,
    style: 'expanded',
    includePaths: [
      'bower_components'
    ]
  };

  return gulp.src([
    paths.src + '/app/**/*.css',
    paths.src + '/app/**/*.scss',
    '!' + paths.src + '/app/seed/**/*.scss',
    '!' + paths.src + '/app/vendor/**/*.css'
  ])
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassOptions)
      .on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.concat('app.css'))
    // .pipe($.if('*.css', $.csso())) // Concatenate and minify styles
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(paths.tmp + '/serve/app/css/'))
    .pipe($.size({title: 'styles', showFiles: true, pretty: true}));
});

gulp.task('dev_inject', function () {
  var injectStyles = gulp.src([
    paths.tmp + '/serve/app/**/*.css'
  ], {read: false});
  var injectVendorStyles = gulp.src(paths.src + '/app/vendor/**/*.css')
    .pipe($.concat('vendor.css'))
    .pipe(gulp.dest(paths.tmp + '/serve/app/css/'));
  var injectStyleOptions = {
    // ignorePath: [paths.src, paths.tmp + '/serve'],
    addRootSlash: false
  };
  var injectScripts = gulp.src([
    paths.src + '/app/**/*.js',
    '!' + paths.src + '/app/**/*.spec.js',
    '!' + paths.src + '/app/**/*.mock.js',
    '!' + paths.src + '/app/seed/**/*.js',
    '!' + paths.src + '/app/vendor/**/*.js'
  ])
    .pipe($.angularFilesort());
  var injectVendorScripts = gulp.src([
    paths.src + '/app/vendor/**/*.js',
    '!' + paths.src + '/app/vendor/js/modernizr.js'
  ]);
  var injectScriptOptions = {
    ignorePath: [paths.src, paths.tmp + '/serve'],
    addRootSlash: false
  };
  var wiredepOptions = {
    directory: 'bower_components'
    // exclude: [/bootstrap\.css/, /foundation\.css/, /material-design-iconic-font\.css/, /default\.css/]
  };
  var injectModernizr = gulp.src(paths.tmp + '/serve/app/js/modernizr.min.js', {read: false});
  var injectModernizrOptions = {
    name: 'modernizr',
    addRootSlash: false
  };

  return gulp.src(paths.src + '/*.html')
    .pipe($.inject(es.merge(injectStyles, injectVendorStyles), injectStyleOptions))
    .pipe($.inject(series(injectVendorScripts, injectScripts), injectScriptOptions))
    .pipe($.inject(injectModernizr, injectModernizrOptions))
    .pipe(wiredep(wiredepOptions)) // inject bower files
    .pipe(gulp.dest(paths.tmp + '/serve'));
});

gulp.task('dev_modernizr', function (cb) {
  gulp.src(paths.src + '/app/vendor/js/modernizr.js')
    .pipe($.concat('modernizr.min.js'))
    .pipe($.uglify())
    .pipe($.size({title: 'modernizr', showFiles: true, pretty: true}))
    .pipe(gulp.dest(paths.tmp + '/serve/app/js'))
    .on('end', cb);
});

gulp.task('dev', function () {
  var startTimeStamp = new Date();
  process.env.NODE_ENV = 'development';
  runSequence('dev_clean', 'dev_modernizr', 'dev_styles', 'dev_inject', 'browser-sync', function () {
    console.log('Total cost time:', (new Date() - startTimeStamp), 'ms.');
  });

  gulp.watch([path.join(paths.src, '/app/**/*.css'), path.join(paths.src, '/app/**/*.scss')], function () {
    console.log('Styles files modified...');
    gulp.start('dev_styles');
    browserSync.reload();
  });

  gulp.watch([path.join(paths.src, '/app/**/*.js'), path.join(paths.src, '/**/*.html')], function () {
    console.log('Scripts files modified...');
    gulp.start('dev_inject');
  });

  gulp.watch(path.join(paths.tmp, '/serve/**/*.html'), function (event) {
    // console.log('event', event);
    browserSync.reload();
  });

});

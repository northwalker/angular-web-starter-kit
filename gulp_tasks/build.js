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

gulp.task('clean', function (callback) {
  var folderPaths = [paths.tmp, paths.dist];
  del(folderPaths).then(function () {
    $.util.log('Files or folders that would be deleted:', folderPaths);
    callback();
  });
});

gulp.task('modernizr', function (cb) {

  var injectModernizrOptions = {
    name: 'modernizr',
    ignorePath: [paths.dist],
    addRootSlash: false
  };

  var injectModernizrScripts = gulp.src(paths.src + '/app/vendor/js/modernizr.js')
    .pipe($.concat('modernizr.min.js'))
    .pipe($.uglify())
    .pipe($.size({title: 'modernizr', showFiles: true, pretty: true}))
    .pipe(gulp.dest(paths.dist + '/scripts'));

  return gulp.src(paths.dist + '/*.html')
    .pipe($.inject(injectModernizrScripts, injectModernizrOptions))
    .pipe(gulp.dest(paths.dist));

});
// Copy all static images
gulp.task('images', function () {
  return gulp.src(paths.src + '/assets/images/**/*')
    .pipe(gulp.dest(paths.dist + '/assets/images/'));
});

gulp.task('misc', function () {
  return gulp.src(paths.src + '/favicon.png')
    .pipe(gulp.dest(paths.dist));
});

// Compile and automatically prefix stylesheets
gulp.task('styles', function () {
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
    .pipe($.rename({suffix: '.min'}))
    .pipe($.if('*.css', $.csso()))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(paths.tmp + '/serve/app/css/'))
    .pipe($.size({title: 'styles', showFiles: true, pretty: true}));
});

gulp.task('partials', function () {
  return gulp.src([
    paths.src + '/app/**/*.html'
  ])
    .pipe($.htmlmin({
      collapseWhitespace: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'app',
      root: 'app'
    }))
    .pipe($.uglify({
      wrap: true
    }))
    .pipe(gulp.dest(paths.tmp + '/serve/app/partials/'))
    .pipe($.size({title: 'partials', showFiles: true, pretty: true}));
});

gulp.task('scripts', ['partials'], function () {
  return gulp.src([
    paths.src + '/app/**/*.js',
    paths.tmp + '/app/partials/templateCacheHtml.js',
    '!' + paths.src + '/app/**/*.spec.js',
    '!' + paths.src + '/app/**/*.mock.js',
    '!' + paths.src + '/app/seed/**/*.js',
    '!' + paths.src + '/app/vendor/**/*.js'
  ])
    .pipe($.sourcemaps.init())
    .pipe($.angularFilesort())
    .pipe($.concat('app.js'))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(paths.tmp + '/serve/app/js/'))
    .pipe($.size({title: 'scripts', showFiles: true, pretty: true}));
});

gulp.task('inject', ['styles', 'scripts'], function () {
  var injectStyles = gulp.src([paths.tmp + '/serve/app/**/*.css'], {read: false});
  var injectVendorStyles = gulp.src(paths.src + '/app/vendor/**/*.css')
    .pipe($.concat('vendor.css'))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.if('*.css', $.csso()))
    .pipe(gulp.dest(paths.tmp + '/serve/app/css/'));

  var injectScripts = gulp.src([paths.tmp + '/serve/app/**/*.js'], {read: false});

  var injectVendorScripts = gulp.src([
    paths.src + '/app/vendor/**/*.js',
    '!' + paths.src + '/app/vendor/js/modernizr.js'
  ])
    .pipe($.concat('vendor.js'))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.uglify({
      wrap:true
    }))
    .pipe(gulp.dest(paths.tmp + '/serve/app/js/'));

  var injectStyleOptions = {
    ignorePath: [paths.src, paths.tmp + '/serve'],
    addRootSlash: false
  };
  var injectScriptOptions = {
    ignorePath: [paths.src, paths.tmp + '/serve'],
    addRootSlash: false
  };

  return gulp.src(paths.src + '/*.html')
    .pipe($.inject(es.merge(injectStyles, injectVendorStyles), injectStyleOptions))
    .pipe($.inject(series(injectVendorScripts, injectScripts), injectScriptOptions))
    .pipe(gulp.dest(paths.tmp + '/serve'));
});

gulp.task('html', ['inject'], function () {

  // var jsFilter = $.filter("**/*.js", { restore: true });
  // var cssFilter = $.filter("**/*.css", { restore: true });
  // var indexHtmlFilter = $.filter(['**/*', '!**/index.html'], { restore: true });

  var wiredepOptions = {
    directory: 'bower_components'
  };
  return gulp.src(paths.tmp + '/serve/*.html')
    .pipe(wiredep(wiredepOptions)) // inject bower files
    .pipe($.useref())
    // gulp-useref() no suffix support option, add min suffix manual
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.js', $.rename({suffix:'.min'})))
    .pipe($.if('*.css', $.csso()))
    .pipe($.if('*.css', $.rename({suffix:'.min'})))
    .pipe($.replace('app.css', 'app.min.css'))
    .pipe($.replace('bower.css', 'bower.min.css'))
    .pipe($.replace('app.js', 'app.min.js'))
    .pipe($.replace('bower.js', 'bower.min.js'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('html-minify', function () {
  return gulp.src(paths.dist + '/*.html')
    .pipe($.htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,             // Gogle Analytics code
      minifyCSS: true
    }))
    .pipe(gulp.dest(paths.dist))
    .pipe($.size({title: 'HTML minify', showFiles: true, pretty: true}));
});

gulp.task('build', function () {
  var startTimeStamp = new Date();
  runSequence('clean', 'images', 'html','html-minify', 'modernizr', function () {
    console.log('Total cost time:', (new Date() - startTimeStamp), 'ms.');
  });
});

gulp.task('serve:dist', function () {
  var startTimeStamp = new Date();
  process.env.NODE_ENV = 'production';

  runSequence('clean', 'images', 'html','html-minify', 'modernizr',  'browser-sync', function () {
    console.log('Total cost time:', (new Date() - startTimeStamp), 'ms.');
  });
});

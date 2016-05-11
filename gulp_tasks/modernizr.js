var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('build_modernizr', function (cb) {
  var modernizr = require("modernizr");
  var configAllJson = require("../node_modules/modernizr/lib/config-all.json");
  var fs = require('fs');

  modernizr.build(configAllJson, function (result) {
    // console.log(result.length); // the build

    var targetPath = 'client/app/vendor/';
    if (!fs.existsSync(targetPath))
      fs.mkdirSync(targetPath);
    targetPath += 'js/';                    // 'client/app/vendor/js/';
    if (!fs.existsSync(targetPath))
      fs.mkdirSync(targetPath);

    fs.writeFile(targetPath + 'modernizr.js', result, function (err) {
      if (err)
        console.error(err);
      
      cb();
    });
  });
});

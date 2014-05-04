# gulp-untar

[![NPM version](https://badge.fury.io/js/gulp-untar.svg)](http://badge.fury.io/js/gulp-untar)

Extract tarballs in your [gulp](http://gulpjs.com) build pipeline

## Install

```bash
$ npm install --save-dev gulp-untar
```
## Usage

```js
  var gulp = require('gulp')
  var untar = require('gulp-untar')

  gulp.task('extract-archives', function () {
    return gulp.src('./archive/*.tar')
      .pipe(untar())
      .pipe(gulp.dest('./extracted'))
  })
```

In combination with [gulp-download](https://github.com/Metrime/gulp-download)
and [gulp-gunzip](https://github.com/jmerrifield/gulp-gunzip):

```js
var gulp = require('gulp')
var download = require('gulp-download')
var gunzip = require('gulp-gunzip')
var untar = require('gulp-untar')

gulp.task('default', function () {
  return download('http://example.org/some-file.tar.gz')
  .pipe(gunzip())
  .pipe(untar())
  .pipe(gulp.dest('output'))
})
```

## License

[MIT](http://opensource.org/licenses/MIT)

© [Jon Merrifield](http://www.jmerrifield.com)

# gulp-untar

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

## License

[MIT](http://opensource.org/licenses/MIT)

© [Jon Merrifield](http://www.jmerrifield.com)

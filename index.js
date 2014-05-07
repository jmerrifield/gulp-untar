var through = require('through2')
var parse = require('tar').Parse
var gutil = require('gulp-util')
var path = require('path')
var streamifier = require('streamifier')

module.exports = function () {
  return through.obj(function (file, enc, callback) {
    var contentsStream

    if (file.isNull()) {
      return this.push(file)
    }

    if (file.isStream()) {
      contentsStream = file.contents
    }

    if (file.isBuffer()) {
      contentsStream = streamifier.createReadStream(file.contents)
    }

    contentsStream
    .pipe(parse())
    .on('entry', function (entry) {
      if (entry.props.type !== '0') return

      this.push(new gutil.File({
        contents: entry,
        path: path.relative('.', entry.props.path)
      }))
    }.bind(this))
    .on('end', function () {
      callback()
    })
  })
}

var through = require('through2')
var tar = require('tar-stream')
var gutil = require('gulp-util')
var path = require('path')
var streamifier = require('streamifier')

module.exports = function () {
  return through.obj(function (file, enc, callback) {
    var extract = tar.extract()

    extract.on('entry', function (header, stream, nextEntry) {
      if (header.type !== 'file') return nextEntry()

      this.push(new gutil.File({
        contents: stream,
        path: path.relative('.', header.name)
      }))

      nextEntry()
    }.bind(this))

    extract.on('finish', function () {
      callback()
    })

    if (file.isNull()) {
      this.push(file)
    }

    if (file.isStream()) {
      file.contents.pipe(extract)
    }

    if (file.isBuffer()) {
      streamifier.createReadStream(file.contents).pipe(extract)
    }
  })
}

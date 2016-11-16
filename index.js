var through = require('through2')
var parse = require('tar').Parse
var gutil = require('gulp-util')
var path = require('path')
var streamifier = require('streamifier')
var es = require('event-stream')

module.exports = function (options) {
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

      // Accumulate the contents and emit a file with a Buffer of the contents.
      //
      // I tried returning the entry as the contents of each file but that
      // seemed unreliable, presumably each entry stream is intended to be
      // consumed *as we read* the source archive, so handing out individual
      // streams to consumers means that we're depending on them consuming
      // each stream in sequence.

      entry.pipe(es.wait(function (err, data) {
        var dirName;

        if (err) return this.emit('error', err)

        if (!!options && options.dirName) {
          dirName = options.dirName;
        } else {
          dirName = path.dirname(file.path);
        }

        this.push(new gutil.File({
          contents: new Buffer(data),
          path: path.normalize(dirName + '/' + entry.props.path),
          base: file.base,
          cwd: file.cwd
        }))
      }.bind(this)))
    }.bind(this))
    .on('end', function () {
      callback()
    })
  })
}

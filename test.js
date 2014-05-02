var es = require('event-stream')
var gutil = require('gulp-util')
var assert = require('assert')
var fs = require('fs')
var async = require('async')
var _ = require('lodash')
var untar = require('./index')

describe('gulp-untar', function () {
  function assertOutput(stream, done) {
    var files = []

    stream.on('data', function (file) {
      files.push(file)
    })

    stream.on('end', function () {
      async.each(files, function (file, callback) {
        file.contents.pipe(es.wait(function (err, data) {
          file.stringContents = data
          callback()
        }))
      }, function () {
        assert.equal(files.length, 2)

        var file1 = _.find(files, {path: 'file1.txt'})
        assert.ok(file1, 'No file found named "file1.txt"')
        assert.equal('File 1\n', file1.stringContents)

        var file2 = _.find(files, {path: 'dir1/file2.txt'})
        assert.ok(file2, 'No file found named "dir1/file2.txt"')
        assert.equal('File 2\n', file2.stringContents)

        done()
      })
    })
  }

  context('in streaming mode', function () {
    it('should untar files', function (done) {
      var stream = untar()

      assertOutput(stream, done)

      stream.write(new gutil.File({
        path: './fixtures/test.tar',
        contents: fs.createReadStream('./fixtures/test.tar')
      }))

      stream.end()
    })

  })

  context('in buffer mode', function () {
    it('should untar files', function (done) {
      var stream = untar()

      assertOutput(stream, done)

      stream.write(new gutil.File({
        path: './fixtures/test.tar',
        contents: fs.readFileSync('./fixtures/test.tar')
      }))

      stream.end()
    })
  })

  context('null files', function () {
    it('should let them pass through', function (done) {
      var stream = untar()

      stream.on('data', function (file) {
        assert.equal(file.path, './fixtures/test.tar')
        done()
      })

      stream.write(new gutil.File({
        path: './fixtures/test.tar',
        contents: null
      }))
    })
  })
})

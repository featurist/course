var express = require('express')
var browserify = require('browserify-middleware')
var pathUtils = require('path')
var MemoryDatabase = require('./memoryDatabase')

module.exports = function ({data} = {}) {
  var app = express()

  var database = new MemoryDatabase({data})

  app.get('/index.js', browserify(pathUtils.join(__dirname, '../browser/index.js'), {
    transform: ['babelify'],
    extensions: ['.jsx'],
    fullPaths: true
  }))

  app.get('/', (req, res) => {
    res.send(`<html>
    <body>
      <script src="/index.js"></script>
    </body>
  </html>`)
  })

  app.get('/api/artists', async (req, res) => {
    res.send(await database.artists())
  })

  app.get('/api/artists/:artistId', async (req, res) => {
    const artist = await database.artist(req.params.artistId)
    if (artist) {
      res.send(artist)
    } else {
      res.status(404).send('no such artist')
    }
  })

  app.get('/api/releases/:releaseId', async (req, res) => {
    const release = await database.release(req.params.releaseId)
    if (release) {
      res.send(release)
    } else {
      res.status(404).send('no such release')
    }
  })

  return app
}

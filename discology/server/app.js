const express = require('express')
const browserify = require('browserify-middleware')
const pathUtils = require('path')

module.exports = function ({db} = {}) {
  const app = express()

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
    res.send(await db.artists())
  })

  app.get('/api/artists/:artistId', async (req, res) => {
    const artist = await db.artist(req.params.artistId)
    if (artist) {
      res.send(artist)
    } else {
      res.status(404).send('no such artist')
    }
  })

  app.get('/api/releases/:releaseId', async (req, res) => {
    const release = await db.release(req.params.releaseId)
    if (release) {
      res.send(release)
    } else {
      res.status(404).send('no such release')
    }
  })

  return app
}

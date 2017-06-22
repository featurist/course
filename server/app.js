const express = require('express')
const browserify = require('browserify-middleware')
const pathUtils = require('path')

module.exports = function ({db} = {}) {
  const app = express()

  app.get('/index.js', browserify(pathUtils.join(__dirname, '../browser/index.js'), {
    transform: ['babelify'],
    extensions: ['.jsx'],
    debug: true,
    fullPaths: true
  }))

  app.get('/api/artists', async (req, res) => {
    res.send(await db.artists())
  })

  app.get('/api/artists/:artistId', async (req, res) => {
    const artist = await db.artist(Number(req.params.artistId))
    if (artist) {
      res.send(artist)
    } else {
      res.status(404).send('no such artist')
    }
  })

  app.get('/api/releases/:releaseId', async (req, res) => {
    const release = await db.release(Number(req.params.releaseId))
    if (release) {
      res.send(release)
    } else {
      res.status(404).send('no such release')
    }
  })

  app.get('/*', (req, res) => {
    res.send(`<html>
    <body>
      <script src="/index.js"></script>
    </body>
  </html>`)
  })

  return app
}

const DiscogsApi = require('../../server/discogsApi')
const _ = require('underscore')
const formatDuration = require('format-duration')

module.exports = class HttpDiscogsApiService {
  constructor ({port = 6789} = {}) {
    this.artists = {}
    this.port = port
    this.url = `http://localhost:${this.port}/`
  }

  async create () {
    const express = require('express')
    const app = express()

    app.get('/artists/:artistId', (req, res) => {
      const artist = this.artists[req.params.artistId]
      res.send(_.pick(artist, 'name', 'id'))
    })

    app.get('/artists/:artistId/releases', (req, res) => {
      const releases = this.artists[req.params.artistId].releases
      res.send({
        releases: releases.map(release => ({
          resource_url: this.url + 'releases/' + release.id,
          type: 'master'
        }))
      })
    })

    app.get('/releases/:releaseId', (req, res) => {
      const releases = _.flatten(Object.keys(this.artists).map(id => this.artists[id].releases))
      const release = releases.find(r => r.id === Number(req.params.releaseId))

      if (release) {
        res.send({
          title: release.name,
          id: release.id,
          tracklist: release.tracks.map(track => ({
            duration: formatDuration(track.duration * 1000),
            title: track.name
          })),
          artists: release.artists.map(artist => ({
            name: artist.name,
            id: artist.id
          }))
        })
      } else {
        res.status(404).send()
      }
    })

    await new Promise(resolve => {
      this.server = app.listen(this.port, resolve)
    })

    return new DiscogsApi({url: this.url})
  }

  addArtist (artist) {
    this.artists[artist.id] = artist
  }

  async stop () {
    await new Promise(resolve => {
      this.server.close(resolve)
    })
  }
}

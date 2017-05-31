const _ = require('underscore')

module.exports = class MemoryDatabase {
  constructor ({data} = {}) {
    this.data = data
    this.artistsById = indexByArtists(data)
    this.releasesById = _.indexBy(data.releases, 'id')
    this._artists = _.flatten(data.releases.map(r => r.artists))
  }

  artists () {
    return this._artists
  }

  artist (id) {
    return this.artistsById[id]
  }

  release (id) {
    return this.releasesById[id]
  }
}

function indexByArtists (data) {
  const artistReleasePairs = _.flatten(data.releases.map(release => release.artists.map(artist => ({artist, release}))))
  return _.mapObject(_.groupBy(artistReleasePairs, pair => pair.artist.id), pairs => {
    const artist = pairs[0].artist
    return _.extend({}, artist, {
      releases: pairs.map(p => p.release)
    })
  })
}

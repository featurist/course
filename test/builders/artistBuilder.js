const _ = require('underscore')

module.exports = class ArtistBuilder {
  constructor () {
    this.artist = {}
    this.withName(`Artist`)
    this.withId(1)
  }

  withName (name) {
    this.artist.name = name
    return this
  }

  withId (id) {
    this.artist.id = id
    return this
  }

  withReleases (releases) {
    releases.forEach(r => {
      const found = r.artists.find(a => a.id === this.artist.id)
      if (!found) {
        r.artists.push(_.pick(this.artist, 'name', 'id'))
      }
    })
    this.artist.releases = releases
    return this
  }

  build () {
    return this.artist
  }
}

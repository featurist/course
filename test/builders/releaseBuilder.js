const ArtistBuilder = require('./artistBuilder')
const TrackBuilder = require('./trackBuilder')
const _ = require('underscore')

module.exports = class ReleaseBuilder {
  constructor () {
    this.release = {}
    this.withName(`Release`)
    this.withId(1)
    this.withArtists([new ArtistBuilder().build()])
    this.withTracks(3)
  }

  withTracks (tracks) {
    if (typeof tracks === 'number') {
      this.release.tracks = _.range(1, tracks + 1).map(number => new TrackBuilder().withNumber(number).build())
    } else {
      this.release.tracks = tracks
    }
    return this
  }

  withNoOtherArtists () {
    this.release.artists = []
    return this
  }

  withArtists (artists) {
    this.release.artists = artists
    return this
  }

  withName (name) {
    this.release.name = name
    return this
  }

  withId (id) {
    this.release.id = id
    return this
  }

  build () {
    return this.release
  }
}

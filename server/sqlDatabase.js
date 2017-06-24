const sworm = require('sworm')
const _ = require('underscore')

module.exports = class SqlDatabase {
  constructor (url) {
    this.db = sworm.db(url)
    this.schema = {
      artist: this.db.model({table: 'artists'}),
      artistsReleases: this.db.model({table: 'artists_releases'}),
      release: this.db.model({table: 'releases'}),
      track: this.db.model({table: 'tracks'})
    }
  }

  stop () {
    this.db.close()
  }

  async artists () {
    return this.db.query('select id, name from artists order by name')
  }

  async write (data) {
    const allArtists = _.flatten(data.releases.map(release => {
      return release.artists
    }))

    const artistsById = _.indexBy(allArtists, a => a.id)
    const artistEntitiesById = _.mapObject(artistsById, artist => this.schema.artist(artist))

    const releases = data.releases.map(release => {
      const tracks = release.tracks
        ? (r) => release.tracks.map((t, index) => this.schema.track({
          name: t.name,
          release: r,
          duration: t.duration,
          number: index + 1
        }))
        : undefined

      return this.schema.release({
        id: release.id,
        name: release.name,
        artistsReleases: (r) => release.artists.map(a => {
          return this.schema.artistsReleases({
            artist: artistEntitiesById[a.id],
            release: r
          })
        }),
        tracks: tracks
      })
    })

    await Promise.all(releases.map(r => r.insert()))
  }

  async release (id) {
    const releaseGraph = this.schema.release({
      id: 'id',
      name: 'name',
      artists: [
        this.schema.artist({
          name: 'artist_name',
          id: 'artist_id'
        })
      ],
      tracks: [
        this.schema.track({
          id: 'track_id',
          name: 'track_name',
          duration: 'track_duration'
        })
      ]
    })

    const release = (await this.db.queryGraph(releaseGraph, `
      select
        r.name,
        r.id,
        a.name as artist_name,
        a.id as artist_id,
        t.id as track_id,
        t.name as track_name,
        t.duration as track_duration
      from
        releases r
          inner join artists_releases ar
            on ar.release_id = r.id
          inner join artists a
            on ar.artist_id = a.id
          inner join tracks t
            on t.release_id = r.id
      where
        r.id = @id
      order by r.name, a.name, t.number
    `, {id: id}))[0]

    release.tracks.forEach(track => delete track.id)
    return release
  }

  async artist (id) {
    const artistGraph = this.schema.artist({
      id: 'id',
      name: 'name',
      releases: [
        this.schema.release({
          name: 'release_name',
          id: 'release_id',
          artists: [
            this.schema.artist({
              name: 'artist_name',
              id: 'artist_id'
            })
          ],
          tracks: [
            this.schema.track({
              id: 'track_id',
              name: 'track_name',
              duration: 'track_duration'
            })
          ]
        })
      ]
    })

    const artist = (await this.db.queryGraph(artistGraph, `
      select
        a.name,
        a.id,
        r.name as release_name,
        r.id as release_id,
        ra.name as artist_name,
        ra.id as artist_id,
        t.id as track_id,
        t.name as track_name,
        t.duration as track_duration
      from
        artists a
          inner join artists_releases ar
            on ar.artist_id = a.id
          inner join releases r
            on ar.release_id = r.id
          inner join artists_releases rar
            on rar.release_id = r.id
          inner join artists ra
            on rar.artist_id = ra.id
          inner join tracks t
            on t.release_id = r.id
      where
        a.id = @id
      order by a.name, r.name, ra.name, t.number
    `, {id: id}))[0]

    artist.releases.forEach(release => release.tracks.forEach(track => delete track.id))

    return artist
  }
}

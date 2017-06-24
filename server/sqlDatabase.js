const sworm = require('sworm')
const _ = require('underscore')

module.exports = class SqlDatabase {
  constructor (url) {
    this.db = sworm.db(url)
    this.schema = {
      artist: this.db.model({table: 'artists'}),
      artistRelease: this.db.model({table: 'artists_releases', id: ['release_id', 'artist_id']}),
      release: this.db.model({table: 'releases'}),
      track: this.db.model({table: 'tracks'})
    }
  }

  stop () {
    this.db.close()
  }

  async artists ({keepEntities = false} = {}) {
    const artists = await this.db.query('select id, name from artists order by name')
    return clone(artists, keepEntities)
  }

  createRelease (release, {artistEntitiesById, existing = false}) {
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
      artistRelease: (r) => release.artists.map(a => {
        return this.schema.artistRelease({
          artist: artistEntitiesById[a.id],
          release: r
        })
      }),
      tracks: tracks
    }, {saved: existing})
  }

  async write (data) {
    const allArtists = _.flatten(data.releases.map(release => {
      return release.artists
    }))

    const artistsById = _.indexBy(allArtists, a => a.id)
    const artistEntitiesById = _.mapObject(artistsById, artist => this.schema.artist(artist))

    const releases = data.releases.map(release => {
      return this.createRelease(release, {artistEntitiesById})
    })

    await Promise.all(releases.map(r => r.save()))
  }

  async release (id, {keepEntities = false} = {}) {
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
          left join artists_releases ar
            on ar.release_id = r.id
          left join artists a
            on ar.artist_id = a.id
          left join tracks t
            on t.release_id = r.id
      where
        r.id = @id
      order by r.name, a.name, t.number
    `, {id: id}))[0]

    if (release) {
      release.tracks.forEach(track => delete track.id)
    }

    return clone(release, keepEntities)
  }

  async artist (id, {keepEntities = false} = {}) {
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
          left join artists_releases ar
            on ar.artist_id = a.id
          inner join releases r
            on ar.release_id = r.id
          left join artists_releases rar
            on rar.release_id = r.id
          inner join artists ra
            on rar.artist_id = ra.id
          left join tracks t
            on t.release_id = r.id
      where
        a.id = @id
      order by a.name, r.name, ra.name, t.number
    `, {id: id}))[0]

    if (artist) {
      artist.releases.forEach(release => release.tracks.forEach(track => delete track.id))
    }

    return clone(artist, keepEntities)
  }

  async addArtist (artist) {
    const existingIds = async (tableName, objects) => {
      const entities = _.flatten(
        await Promise.all(objects.map(object => {
          return this.db.query(`select * from ${tableName} where id = @id`, {id: object.id})
        }))
      )
      const ids = entities.filter(x => x).map(x => x.id)
      return new Set(ids)
    }

    const existingReleaseIds = await existingIds('releases', artist.releases)
    const artists = _.uniq(_.flatten(artist.releases.map(r => r.artists)), a => a.id)
    const existingArtistIds = await existingIds('artists', artists)
    const artistEntitiesById = _.object(artists.map(artist => {
      const artistEntity = this.schema.artist({
        name: artist.name,
        id: artist.id
      }, {saved: existingArtistIds.has(artist.id)})
      return [artist.id, artistEntity]
    }))

    await Promise.all(artist.releases.map(release => {
      return this.createRelease(release, {artistEntitiesById, existing: existingReleaseIds.has(release.id)}).save()
    }))
  }
}

function clone (x, keepEntities) {
  if (keepEntities) {
    return x
  } else {
    return x !== undefined ? JSON.parse(JSON.stringify(x)) : undefined
  }
}

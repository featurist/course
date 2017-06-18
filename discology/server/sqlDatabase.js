const sworm = require('sworm')

module.exports = class SqlDatabase {
  constructor (url) {
    this.db = sworm.db(url)
    this.schema = {
      artist: this.db.model({table: 'artists'}),
      release: this.db.model({table: 'releases'}),
      track: this.db.model({table: 'tracks'})
    }
  }

  async createSchema () {
    await this.db.query(`
      create table artists (id, name, release_id);
      create table releases (id, name);
      create table tracks (id integer primary key, name, duration, release_id);
    `, undefined, {multiline: true})
  }

  async artists () {
    return this.db.query('select id, name from artists order by name')
  }

  async write (data) {
    const releases = data.releases.map(release => {
      const tracks = release.tracks
        ? (r) => release.tracks.map(t => this.schema.track({
          name: t.name,
          release: r,
          duration: t.duration
        }))
        : undefined

      return this.schema.release({
        id: release.id,
        name: release.name,
        artists: (r) => release.artists.map(a => this.schema.artist({
          id: a.id,
          name: a.name,
          release: r
        })),
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
          inner join artists a
            on a.release_id = r.id
          inner join tracks t
            on t.release_id = r.id
      where
        r.id = @id
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
          inner join releases r
            on a.release_id = r.id
          inner join artists ra
            on ra.release_id = r.id
          inner join tracks t
            on t.release_id = r.id
      where
        a.id = @id
    `, {id: id}))[0]

    artist.releases.forEach(release => release.tracks.forEach(track => delete track.id))

    return artist
  }
}

const httpism = require('httpism')

module.exports = class DiscogsApi {
  constructor ({url = 'https://api.discogs.com/', http = httpism}) {
    this.http = http.client(
      url,
      {
        headers: {
          'user-agent': 'HyperDiscology 1.0'
        }
      }
    )
  }

  async artist (id) {
    const [artist, releaseList] = await Promise.all([
      this.http.get('/artists/:id', {params: {id}}),
      this.http.get('/artists/:id/releases', {params: {id}})
    ])

    const discogsReleases = await Promise.all(releaseList.releases.filter(r => r.type === 'master').map((release) => {
      return this.http.get(release.resource_url)
    }))

    const releases = discogsReleases.map((release) => {
      return {
        name: release.title,
        id: release.id,
        artists: release.artists.map(({name, id}) => ({name, id})),
        tracks: release.tracklist.map((track) => ({
          duration: timeToSeconds(track.duration),
          name: track.title
        }))
      }
    })

    return {
      id: artist.id,
      name: artist.name,
      releases
    }
  }
}

function timeToSeconds (time) {
  const match = /^((\d+):)?(\d+):(\d+)$/.exec(time)
  if (match) {
    const [, , hours = 0, minutes, seconds] = match
    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
  }
}

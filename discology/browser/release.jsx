const hyperdom = require('hyperdom')
const httpism = require('httpism')
const routes = require('./routes')
const formatDuration = require('format-duration')

module.exports = class Release {
  routes () {
    return [
      routes.release({
        onload: async ({releaseId}) => {
          this.release = await httpism.get('/api/releases/:releaseId', {params: {releaseId}})
        },

        render: () => this
      })
    ]
  }

  render () {
    if (this.release) {
      return <div>
        <h1>{this.release.name}</h1>
        <ul>
          {
            this.release.tracks.map(track => <li class="release-track">
              <span class="release-trackName">{track.name}</span>
              <span class="release-trackDuration">{formatDuration(track.duration * 1000)}</span>
            </li>)
          }
        </ul>
      </div>
    }
  }
}

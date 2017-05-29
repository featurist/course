const hyperdom = require('hyperdom')
const httpism = require('httpism')
const routes = require('./routes')

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
          { this.release.tracks.map(track => <li>{track.name}</li>) }
        </ul>
      </div>
    }
  }
}

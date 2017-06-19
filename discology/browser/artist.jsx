const hyperdom = require('hyperdom')
const routes = require('./routes')

module.exports = class Artist {
  constructor ({serverApi} = {}) {
    this.serverApi = serverApi
  }

  routes () {
    return [
      routes.artist({
        onload: async (params) => {
          this.artist = await this.serverApi.artist(params.artistId)
        },

        render: () => this
      })
    ]
  }

  render () {
    if (this.artist) {
      return <div>
        <h1>{this.artist.name}</h1>
        <ul>
          {
            this.artist.releases.map(release => {
              return <li class="release"><a href={routes.release.href({releaseId: release.id})}>{release.name}</a></li>
            })
          }
        </ul>
      </div>
    }
  }
}

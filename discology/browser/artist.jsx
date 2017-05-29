const hyperdom = require('hyperdom')
const httpism = require('httpism')
const routes = require('./routes')
const Release = require('./release')

module.exports = class Artist {
  constructor () {
    this.release = new Release()
  }

  routes () {
    return [
      routes.artist({
        onload: async (params) => {
          this.artist = await httpism.get('/api/artists/:artistId', {params: {artistId: params.artistId}})
        },

        render: () => this
      }),

      this.release
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

const hyperdom = require('hyperdom')
const Artist = require('./artist')
const Release = require('./release')
const HttpServerApi = require('./httpServerApi')

const routes = require('./routes')

module.exports = class App {
  constructor ({serverApi = new HttpServerApi()} = {}) {
    this.artists = []
    this.artist = new Artist({serverApi})
    this.release = new Release({serverApi})
    this.serverApi = serverApi
  }

  async onload () {
    this.artists = await this.serverApi.artists()
  }

  routes () {
    return [
      routes.home({
        render: () => this
      }),

      this.artist,
      this.release
    ]
  }

  render () {
    return <div>
      <h1>Discology</h1>
      <ul>
        { this.artists.map(a => <li class="artist"><a href={routes.artist.href({artistId: a.id})}>{a.name}</a></li>) }
      </ul>
    </div>
  }
}
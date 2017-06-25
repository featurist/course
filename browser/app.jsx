const hyperdom = require('hyperdom')
const Artist = require('./artist')
const Release = require('./release')
const HttpServerApi = require('./httpServerApi')
const idFromDiscogsUrl = require('./idFromDiscogsUrl')

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

  async import () {
    const id = idFromDiscogsUrl(this.importUrl)
    await this.serverApi.import(id)
    this.importedArtist = await this.serverApi.artist(id)
  }

  render () {
    return <div>
      <h1>Discology</h1>
      <input class="import-url" type="text" binding="this.importUrl"/>
      <button class="import-button" onclick={() => this.import()}>import</button>
      { this.renderImportedArtist() }
      <ul>
        { this.artists.map(a => <li class="artist"><a href={routes.artist.href({artistId: a.id})}>{a.name}</a></li>) }
      </ul>
    </div>
  }

  renderImportedArtist () {
    if (this.importedArtist) {
      return <div>
        <a class="imported-artist-link" href={routes.artist.href({artistId: this.importedArtist.id})}>{this.importedArtist.name}</a>
      </div>
    }
  }
}

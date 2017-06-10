const hyperdom = require('hyperdom')
const httpism = require('httpism')
const Artist = require('./artist')
const Release = require('./release')

const routes = require('./routes')

module.exports = class App {
  constructor () {
    this.artists = []
    this.artist = new Artist()
    this.release = new Release()
  }

  async onload () {
    this.artists = await httpism.get('/api/artists')
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

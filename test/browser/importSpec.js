const describeApp = require('./describeApp')
const ArtistBuilder = require('../builders/artistBuilder')
const ReleaseBuilder = require('../builders/releaseBuilder')
const TrackBuilder = require('../builders/trackBuilder')

describeApp('import page', (appService) => {
  let discogsArtist

  beforeEach(async () => {
    await appService.start()

    discogsArtist = new ArtistBuilder()
      .withName('Polysick')
      .withId(1814667)
      .withReleases([
        new ReleaseBuilder()
          .withName('Digital Native')
          .withId(123)
          .withTracks([
            new TrackBuilder().withName('Totem').withDuration(159).build(),
            new TrackBuilder().withName('Woods').withDuration(100).build()
          ])
          .build()
      ])
      .build()

    await appService.addDiscogsArtist(discogsArtist)
  })

  afterEach(() => {
    return appService.stop()
  })

  it('shows all tracks with their durations', async () => {
    const app = appService.mount()
    await app.find('.import-url').typeIn('https://www.discogs.com/artist/1814667-Polysick')
    await app.find('.import-button').click()
    await app.find('.imported-artist-link').click()
    await app.find('.artist-name').shouldHave({text: 'Polysick'})
  })
})

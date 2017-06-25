const describeApp = require('../services/describeApp')

describeApp('import page', (appService) => {
  let discogsArtist

  beforeEach(async () => {
    await appService.start()

    discogsArtist = {
      name: 'Polysick',
      id: 1814667,
      releases: [
        {
          name: 'Digital Native',
          id: 123,

          artists: [
            {
              name: 'Polysick',
              id: 1814667
            }
          ],

          tracks: [
            {
              duration: 159,
              name: 'Totem'
            },
            {
              duration: 100,
              name: 'Woods'
            }
          ]
        }
      ]
    }

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

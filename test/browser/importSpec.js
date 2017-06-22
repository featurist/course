const describeApp = require('../services/describeApp')

describeApp('import page', (appService) => {
  beforeEach(async () => {
    await appService.start({
      data: {
        releases: []
      }
    })
  })

  afterEach(() => {
    return appService.stop()
  })

  it('shows all tracks with their durations', async () => {
    const app = appService.mount()
    await app.find('.import-url').typeIn('https://www.discogs.com/artist/1814667-Polysick')
    await app.find('.import-button').click()
    await app.find('.imported-artist-link').click()
    await app.find('.artist').shouldHave({text: 'Polysick'})
  })
})

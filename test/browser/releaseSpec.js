/* eslint-env mocha */

const describeApp = require('./describeApp')
const ReleaseBuilder = require('../builders/releaseBuilder')
const TrackBuilder = require('../builders/trackBuilder')
const routes = require('../../browser/routes')
const expect = require('chai').expect
const $ = require('jquery')

describeApp('release page', (appService) => {
  beforeEach(async () => {
    await appService.start({
      data: {
        releases: [
          new ReleaseBuilder()
            .withId(1)
            .withName('Digital Native')
            .withTracks([
              new TrackBuilder().withName('Totem').withDuration('1:40').build(),
              new TrackBuilder().withName('Woods').withDuration('2:39').build(),
              new TrackBuilder().withName('Taito').withDuration('5:43').build()
            ])
            .build()
        ]
      }
    })
  })

  afterEach(() => {
    return appService.stop()
  })

  it('shows all tracks with their durations', async () => {
    const app = appService.mount(routes.release.url({releaseId: '1'}))
    await app.find('.release-name').shouldHave({text: 'Digital Native'})
    await app.find('.release-track').shouldHaveElements(trackElements => {
      const tracks = trackElements.map(track => {
        return {
          name: $(track).find('.release-trackName').text(),
          duration: $(track).find('.release-trackDuration').text()
        }
      })
      expect(tracks).to.eql([
        {name: 'Totem', duration: '1:40'},
        {name: 'Woods', duration: '2:39'},
        {name: 'Taito', duration: '5:43'}
      ])
    })
  })
})

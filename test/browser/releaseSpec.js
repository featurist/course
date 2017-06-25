/* eslint-env mocha */

const describeApp = require('./describeApp')
const routes = require('../../browser/routes')
const expect = require('chai').expect
const $ = require('jquery')

describeApp('release page', (appService) => {
  beforeEach(async () => {
    await appService.start({
      data: {
        releases: [
          {
            id: 1,
            name: 'Journey Inwards',
            artists: [
              {
                id: 1,
                name: 'LTJ Bukem'
              }
            ],
            tracks: [
              {name: 'Journey Inwards', duration: 60},
              {name: 'Watercolours', duration: 90}
            ]
          }
        ]
      }
    })
  })

  afterEach(() => {
    return appService.stop()
  })

  it('shows all tracks with their durations', async () => {
    const app = appService.mount(routes.release.url({releaseId: '1'}))
    await app.find('.release-track').shouldHaveElements(trackElements => {
      const tracks = trackElements.map(track => {
        return {
          name: $(track).find('.release-trackName').text(),
          duration: $(track).find('.release-trackDuration').text()
        }
      })
      expect(tracks).to.eql([
        {name: 'Journey Inwards', duration: '1:00'},
        {name: 'Watercolours', duration: '1:30'}
      ])
    })
  })
})

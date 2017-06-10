/* eslint-env mocha */

const AppService = require('../services/appService')
const routes = require('../../browser/routes')
const expect = require('chai').expect
const $ = require('jquery')

describe('release page', () => {
  let service

  beforeEach(async () => {
    service = new AppService({
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
    await service.start()
  })

  afterEach(() => {
    return service.stop()
  })

  it('shows all tracks with their durations', async () => {
    const app = service.mount(routes.release.url({releaseId: '1'}))
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

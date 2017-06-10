/* eslint-env mocha */

const AppService = require('../services/appService')

describe('app', () => {
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
              {name: 'Journey Inwards'},
              {name: 'Watercolours'},
              {name: 'Rhodes To Freedom'},
              {name: 'Our World'},
              {name: 'Undress Your Mind'},
              {name: 'Point Of View'},
              {name: 'View Point'},
              {name: 'Sunrain'},
              {name: 'Deserted Vaults (Instrumental)'},
              {name: 'Inner Guidance'},
              {name: 'Close To The Source'},
              {name: 'Suspended Space'},
              {name: 'Unconditional Love'},
              {name: 'Feel What You Feel'}
            ]
          },
          {
            id: 2,
            name: 'Endtroducing.....',
            artists: [
              {
                id: 2,
                name: 'DJ Shadow'
              }
            ],
            tracks: [
              {name: 'Best Foot Forward'},
              {name: 'Building Steam With A Grain Of Salt'},
              {name: 'The Number Song'},
              {name: 'Changeling'},
              {name: '**Transmission 1'},
              {name: 'What Does Your Soul Look Like (Part 4)'},
              {name: 'Untitled'},
              {name: 'Stem/Long Stem'},
              {name: '**Transmission 2'},
              {name: 'Mutual Slump'},
              {name: 'Organ Donor'},
              {name: "Why Hip Hop Sucks In '96"},
              {name: 'Midnight In A Perfect World'},
              {name: 'Napalm Brain/Scatter Brain'},
              {name: 'What Does Your Soul Look Like (Part 1 - Blue Sky Revisit)'},
              {name: '**Transmission 3'}
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

  it('can display all artists', async () => {
    const browser = service.mount()
    await browser.shouldHave({text: 'Discology'})
    await browser.shouldHave({text: 'LTJ Bukem'})
    await browser.shouldHave({text: 'DJ Shadow'})
  })

  it('can display an artist', async () => {
    const browser = service.mount()
    await browser.find('.artist a', {text: 'LTJ Bukem'}).click()
    await browser.shouldHave({text: 'Journey Inwards'})
  })

  it('can display a release', async () => {
    const browser = service.mount()
    await browser.find('.artist a', {text: 'LTJ Bukem'}).click()
    await browser.find('.release a', {text: 'Journey Inwards'}).click()
    await browser.shouldHave({text: 'Watercolours'})
  })
})

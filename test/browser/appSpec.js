/* eslint-env mocha */

const describeApp = require('./describeApp')

describeApp('app', (appService) => {
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
              {name: 'Journey Inwards', duration: 30},
              {name: 'Watercolours', duration: 30},
              {name: 'Rhodes To Freedom', duration: 30},
              {name: 'Our World', duration: 30},
              {name: 'Undress Your Mind', duration: 30},
              {name: 'Point Of View', duration: 30},
              {name: 'View Point', duration: 30},
              {name: 'Sunrain', duration: 30},
              {name: 'Deserted Vaults (Instrumental)', duration: 30},
              {name: 'Inner Guidance', duration: 30},
              {name: 'Close To The Source', duration: 30},
              {name: 'Suspended Space', duration: 30},
              {name: 'Unconditional Love', duration: 30},
              {name: 'Feel What You Feel', duration: 30}
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
  })

  afterEach(() => {
    return appService.stop()
  })

  it('can display all artists', async () => {
    const browser = appService.mount()
    await browser.shouldHave({text: 'Discology'})
    await browser.shouldHave({text: 'LTJ Bukem'})
    await browser.shouldHave({text: 'DJ Shadow'})
  })

  it('can display an artist', async () => {
    const browser = appService.mount()
    await browser.find('.artist a', {text: 'LTJ Bukem'}).click()
    await browser.shouldHave({text: 'Journey Inwards'})
  })

  it('can display a release', async () => {
    const browser = appService.mount()
    await browser.find('.artist a', {text: 'LTJ Bukem'}).click()
    await browser.find('.artist-releasesRelease a', {text: 'Journey Inwards'}).click()
    await browser.shouldHave({text: 'Watercolours'})
  })
})

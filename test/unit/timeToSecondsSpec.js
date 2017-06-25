const timeToSeconds = require('../../server/timeToSeconds')
const expect = require('chai').expect

describe('timeToSeconds', () => {
  function itConvertsTimeToSeconds (time, seconds) {
    it(`conerts '${time}' to ${seconds} seconds`, () => {
      expect(timeToSeconds(time)).to.equal(seconds)
    })
  }

  itConvertsTimeToSeconds('0:30', 30)
  itConvertsTimeToSeconds('1:30', 90)
  itConvertsTimeToSeconds('1:00:00', 3600)
  itConvertsTimeToSeconds('1:30:00', 3600 + 1800)
  itConvertsTimeToSeconds('24:00:00', 3600 * 24)
})

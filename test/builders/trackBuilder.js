const timeToSeconds = require('../../server/timeToSeconds')

module.exports = class TrackBuilder {
  constructor () {
    this.track = {}
    this.withNumber(1)
  }

  withName (name) {
    this.track.name = name
    return this
  }

  withNumber (number) {
    this.track.name = `Track ${number}`
    this.track.duration = number * 30
    return this
  }

  withDuration (duration) {
    const seconds = typeof duration === 'string'
        ? timeToSeconds(duration)
        : duration
    this.track.duration = seconds
    return this
  }

  build () {
    return this.track
  }
}

module.exports = function timeToSeconds (time) {
  const match = /^((\d+):)?(\d+):(\d+)$/.exec(time)
  if (match) {
    const [, , hours = 0, minutes, seconds] = match
    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
  }
}

module.exports = function idFromDiscogsUrl (url) {
  const match = /^https?:\/\/www.discogs.com\/artist\/(\d+)-(.*)$/.exec(url)
  return match ? Number(match[1]) : undefined
}

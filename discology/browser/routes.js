const router = require('hyperdom/router')

module.exports = {
  home: router.route('/'),
  artist: router.route('/artist/:artistId'),
  release: router.route('/release/:releaseId')
}

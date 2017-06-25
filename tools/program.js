const argv = require('yargs').argv
const pathUtils = require('path')

module.exports = function (fn) {
  const result = fn(argv._, argv)

  if (result && typeof result.then === 'function') {
    result.catch(e => {
      console.error((e && e.stack) || e) // eslint-disable-line no-console
      process.exit(1)
    })
  }
}

module.exports.path = pathUtils.relative(process.cwd(), process.argv[1])

var browserMonkey = require('browser-monkey/iframe')
var pwd = process.cwd()

describe('mounting', () => {
  it ('says hello', async () => {
    var monkey = browserMonkey(`${pwd}/browser/angular2_es2015/index.html`)

    await monkey.find('input.new-todo').typeIn('Install dependencies')
    await monkey.find('.todo-list').shouldHave({text: [
      'Install dependencies'
    ]})
  })
})

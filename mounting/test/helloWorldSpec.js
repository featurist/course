var browserMonkey = require('browser-monkey/iframe')
var pwd = process.cwd()
var enter = new Event( 'keyup', {
  bubbles: true,
} )
enter.key = 'Enter'
enter.keyCode = 13


var ReactDOMComponentTree = require('react-dom/lib/ReactDOMComponentTree')
var ReactTestUtils = require('react-dom/test-utils')
ReactDOMComponentTree.getClosestInstanceFromNode = function (node) {
  var reactKey = Object.keys(node).find(k => k.indexOf('__react') === 0)
  console.log('closes', node, reactKey)
  if (reactKey) {
    return node[reactKey]
  }
}
ReactDOMComponentTree.getInstanceFromNode = function(node) {
  var inst = ReactDOMComponentTree.getClosestInstanceFromNode(node);
  if (inst != null && inst._hostNode === node) {
    return inst;
  } else {
    return null;
  }
}


describe('mounting', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it ('says hello', async () => {
    //var monkey = browserMonkey(`${pwd}/browser/angular2_es2015/index.html`)
    var monkey = browserMonkey(`${pwd}/browser/react/index.html`)

    await monkey.find('input.new-todo').typeIn('Install dependencies')
    el = await monkey.find('input.new-todo').element()

    el[0].addEventListener('keyup', e => {console.log('up', e)})
    el[0].dispatchEvent( enter )

    await monkey.find('.todo-list').shouldHave({text: [
      'Install dependencies'
    ]})
  })
})

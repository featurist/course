const hx = require('hyperdom/hyperx')

module.exports = class HelloWorld {
  constructor () {
    this.user = {}
  }

  message () {
    if (this.user.firstName) {
      return `Hello "${this.user.firstName} Monkey"`
    }
    return 'Please enter your name'
  }

  render () {
    return hx`<div>
      <input type="text" name="firstName" binding=${[this.user, 'firstName']} />
      <div class="message">${this.message()}</div>
    </div>`
  }
}

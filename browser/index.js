const hyperdom = require('hyperdom')
const App = require('./app')
const router = require('hyperdom/router')

hyperdom.append(document.body, new App(), {router})

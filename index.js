'use strict'

const REST = require('./rest.js')
const WS = require('./ws.js')
const REST2 = require('./rest2.js')
const WS2 = require('./ws2.js')

const t = require('./lib/transformer.js')

class BFX {
  constructor (apiKey, apiSecret, opts = { version: 1, transform: false }) {
    if (typeof opts === 'number') {
      const msg = [
        'constructor takes an object since version 1.0.0, see:',
        'https://github.com/bitfinexcom/bitfinex-api-node#version-100-breaking-changes',
        ''
      ].join('\n')
      throw new Error(msg)
    }

    this.apiKey = apiKey
    this.apiSecret = apiSecret
    this.wsConnection = false

    this.version = opts.version

    this.autoOpen = false
    if (opts.autoOpen !== false) {
      this.autoOpen = true
    }

    let transformer = function passThrough (d) { return d }
    if (opts.transform === true) {
      transformer = t
    }

    if (typeof opts.transform === 'function') {
      transformer = opts.transform
    }

    this.transformer = transformer

    return this
  }

  ws () {
    if (this.wsConnection) throw new Error('Websocket already set up. Use open/close methods.')

    if (this.version === 2) {
      this.ws = new WS2(this.apiKey, this.apiSecret, { transformer: this.transformer })
      this.autoOpen && this.ws.open()
      this.wsConnection = true
      return this.ws
    }

    this.ws = new WS(this.apiKey, this.apiSecret)
    this.autoOpen && this.ws.open()
    this.wsConnection = true
    return this.ws
  }

  http () {
    if (this.version === 2) {
      this.rest = new REST2(this.apiKey, this.apiSecret, { transformer: this.transformer })
      return this.rest
    }

    this.rest = new REST(this.apiKey, this.apiSecret)
    return this.rest
  }
}

module.exports = BFX

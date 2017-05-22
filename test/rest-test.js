/* eslint-env mocha */
/* eslint-disable */

const {expect} = require('chai')
const BFX = require('../index')
const _ = require('lodash')
const ws_test = require('./ws-test')

describe('Errors', function () {
  const bfx = new BFX()
  const bfx_rest = bfx.http()
  this.timeout(5000)
  it('should error out if a bad endpoint is given', () => {
    expect(bfx_rest.make_public_request).to.throw(Error)
  })
  it('should fail on authenticated requests if no api_key and api_secret', () => {
    expect(bfx_rest.account_infos).to.throw(Error)
  })
})
describe('Public Endpoints', function () {
  const bfx = new BFX()
  const bfx_rest = bfx.http()
  this.timeout(5000)
  it('should get a ticker', (done) => {
    bfx_rest.ticker('BTCUSD', (error, data) => {
      expect(data).to.exist
      expect(_.has(data, ['mid',
        'bid',
        'ask',
        'last_price',
        'low',
        'high',
        'volume',
        'timestamp']))
      done()
    })
  })
  it('should get the today endpoint', (done) => {
    bfx_rest.today('BTCUSD', (error, data) => {
      expect(data).to.exist
      done()
    })
  })
  it('should get the stats', (done) => {
    bfx_rest.stats('BTCUSD', (error, data) => {
      expect(data).to.exist
      expect(_.has(data[0], ['period', 'volume']))
      expect(_.has(data[1], ['period', 'volume']))
      expect(_.has(data[2], ['period', 'volume']))
      done()
    })
  })
  it('should get the fundingbook', (done) => {
    bfx_rest.fundingbook('USD', (error, data) => {
      expect(data).to.exist
      expect(_.has(data, ['bids', 'asks']))
      expect(_.keys(data.bids[0])).is.eql(['rate', 'amount', 'period', 'timestamp', 'frr'])
      expect(_.keys(data.asks[0])).is.eql(['rate', 'amount', 'period', 'timestamp', 'frr'])
      expect(
                _.every(
                    [data.asks[0] + data.bids[0]]
                ), !NaN).ok
      done()
    })
  })
  it('should get the fundingbook asks, zero bids, 100 asks', (done) => {
    bfx_rest.fundingbook('USD', {limit_bids: 0, limit_asks: 100}, (error, data) => {
      expect(data).to.exist
      expect(_.has(data, ['bids', 'asks']))
      expect(data.bids.length).is.eql(0)
      expect(data.asks.length).is.eql(100)
      done()
    })
  })
  it('should get the orderbook', (done) => {
    bfx_rest.orderbook('BTCUSD', (error, data) => {
      expect(data).to.exist
      expect(_.keys(data)).is.eql(['bids', 'asks'])
      expect(_.keys(data.bids[0])).is.eql(['price', 'amount', 'timestamp'])
      expect(_.keys(data.asks[0])).is.eql(['price', 'amount', 'timestamp'])
      expect(
                _.every(
                    [data.asks[0] + data.bids[0]]
                ), !NaN).ok
      done()
    })
  })
    // TODO API returns 1000 instead of 50`
  it.skip('should get recent trades', (done) => {
    bfx_rest.trades('BTCUSD', (error, data) => {
      expect(data).is.an.array
      expect(data.length).to.eql(50)
      expect(_.keys(data[0])).to.eql(['timestamp', 'tid', 'price', 'amount', 'exchange', 'type'])
      expect(
                _.map(
                    _.values(
                        data[0]
                    ), (v) => typeof (v)
                )).is.eql(['number', 'number', 'string', 'string', 'string', 'string'])
      done()
    })
  })
  it('should get recent lends', (done) => {
    bfx_rest.lends('USD', (error, data) => {
      expect(data).to.exist
      expect(data).is.an.array
      expect(data.length).to.eql(50)
      expect(_.keys(data[0])).to.eql(['rate', 'amount_lent', 'amount_used', 'timestamp'])
      expect(
                _.map(
                    _.values(
                        data[0]
                    ), (v) => typeof (v)
                )).is.eql(['string', 'string', 'string', 'number'])
      done()
    })
  })
  it('should get symbols', (done) => {
    bfx_rest.get_symbols((error, data) => {
      expect(data).to.eql([
        'btcusd',
        'ltcusd',
        'ltcbtc',
        'ethusd',
        'ethbtc',
        'etcbtc',
        'etcusd',
        'rrtusd',
        'rrtbtc',
        'zecusd',
        'zecbtc',
        'xmrusd',
        'xmrbtc',
        'dshusd',
        'dshbtc',
        'bccbtc',
        'bcubtc',
        'bccusd',
        'bcuusd',
        'xrpusd',
        'xrpbtc'
      ])
      done()
    })
  })
  it('should get symbol details', (done) => {
    bfx_rest.symbols_details((error, data) => {
      expect(data).to.exist
      expect(data).to.eql([
        {
          pair: 'btcusd',
          price_precision: 5,
          initial_margin: '30.0',
          minimum_margin: '15.0',
          maximum_order_size: '2000.0',
          minimum_order_size: '0.01',
          expiration: 'NA'
        },
        {
          pair: 'ltcusd',
          price_precision: 5,
          initial_margin: '30.0',
          minimum_margin: '15.0',
          maximum_order_size: '5000.0',
          minimum_order_size: '0.1',
          expiration: 'NA'
        },
        {
          pair: 'ltcbtc',
          price_precision: 5,
          initial_margin: '30.0',
          minimum_margin: '15.0',
          maximum_order_size: '5000.0',
          minimum_order_size: '0.1',
          expiration: 'NA'
        },
        {
          'pair': 'ethusd',
          'price_precision': 5,
          'initial_margin': '30.0',
          'minimum_margin': '15.0',
          'maximum_order_size': '5000.0',
          'minimum_order_size': '0.1',
          'expiration': 'NA'
        },
        {
          'pair': 'ethbtc',
          'price_precision': 5,
          'initial_margin': '30.0',
          'minimum_margin': '15.0',
          'maximum_order_size': '5000.0',
          'minimum_order_size': '0.1',
          'expiration': 'NA'
        },
        {
          'expiration': 'NA',
          'initial_margin': '30.0',
          'maximum_order_size': '100000.0',
          'minimum_margin': '15.0',
          'minimum_order_size': '0.1',
          'pair': 'etcbtc',
          'price_precision': 5
        },
        {
          'expiration': 'NA',
          'initial_margin': '30.0',
          'maximum_order_size': '100000.0',
          'minimum_margin': '15.0',
          'minimum_order_size': '0.1',
          'pair': 'etcusd',
          'price_precision': 5
        },
        {
          'expiration': 'NA',
          'initial_margin': '30.0',
          'maximum_order_size': '100000.0',
          'minimum_margin': '15.0',
          'minimum_order_size': '0.1',
          'pair': 'rrtusd',
          'price_precision': 5
        },
        {
          'expiration': 'NA',
          'initial_margin': '30.0',
          'maximum_order_size': '100000.0',
          'minimum_margin': '15.0',
          'minimum_order_size': '0.1',
          'pair': 'rrtbtc',
          'price_precision': 5
        },
        {
          'expiration': 'NA',
          'initial_margin': '30.0',
          'maximum_order_size': '20000.0',
          'minimum_margin': '15.0',
          'minimum_order_size': '0.0001',
          'pair': 'zecusd',
          'price_precision': 5
        },
        {
          'expiration': 'NA',
          'initial_margin': '30.0',
          'maximum_order_size': '20000.0',
          'minimum_margin': '15.0',
          'minimum_order_size': '0.0001',
          'pair': 'zecbtc',
          'price_precision': 5
        },
        {
          'expiration': 'NA',
          'initial_margin': '30.0',
          'maximum_order_size': '5000.0',
          'minimum_margin': '15.0',
          'minimum_order_size': '0.1',
          'pair': 'xmrusd',
          'price_precision': 5
        },
        {
          'expiration': 'NA',
          'initial_margin': '30.0',
          'maximum_order_size': '5000.0',
          'minimum_margin': '15.0',
          'minimum_order_size': '0.1',
          'pair': 'xmrbtc',
          'price_precision': 5
        },
        {
          'expiration': 'NA',
          'initial_margin': '30.0',
          'maximum_order_size': '5000.0',
          'minimum_margin': '15.0',
          'minimum_order_size': '0.01',
          'pair': 'dshusd',
          'price_precision': 5
        },
        {
          'expiration': 'NA',
          'initial_margin': '30.0',
          'maximum_order_size': '5000.0',
          'minimum_margin': '15.0',
          'minimum_order_size': '0.01',
          'pair': 'dshbtc',
          'price_precision': 5
        },
        {
          'expiration': 'NA',
          'initial_margin': '30.0',
          'maximum_order_size': '2000.0',
          'minimum_margin': '15.0',
          'minimum_order_size': '0.01',
          'pair': 'bccbtc',
          'price_precision': 5
        },
        {
          'expiration': 'NA',
          'initial_margin': '30.0',
          'maximum_order_size': '2000.0',
          'minimum_margin': '15.0',
          'minimum_order_size': '0.01',
          'pair': 'bcubtc',
          'price_precision': 5
        },
        {
          'expiration': 'NA',
          'initial_margin': '30.0',
          'maximum_order_size': '2000.0',
          'minimum_margin': '15.0',
          'minimum_order_size': '0.01',
          'pair': 'bccusd',
          'price_precision': 5
        },
        {
          'expiration': 'NA',
          'initial_margin': '30.0',
          'maximum_order_size': '2000.0',
          'minimum_margin': '15.0',
          'minimum_order_size': '0.01',
          'pair': 'bcuusd',
          'price_precision': 5
        },
        {
          "expiration": "NA",
          "initial_margin": "30.0",
          "maximum_order_size": "200000.0",
          "minimum_margin": "15.0",
          "minimum_order_size": "0.1",
          "pair": "xrpusd",
          "price_precision": 5
        },
        {
          "expiration": "NA",
          "initial_margin": "30.0",
          "maximum_order_size": "200000.0",
          "minimum_margin": "15.0",
          "minimum_order_size": "0.1",
          "pair": "xrpbtc",
          "price_precision": 5
        }
      ])
      done()
    })
  })
})

// FIXME: The API key in keys.json is invalid, causing these tests to fail.
xdescribe('Authenticated Endpoints: standard key', function () {
  this.timeout(5000)
  const key = ''
  const secret = ''
  const bfx = new BFX(key, secret)
  const bfx_rest = bfx.rest
  it('should get account info', (done) => {
    bfx_rest.account_infos((error, data) => {
      expect(data).to.exist
      done()
    })
  })
  it('should get a deposit address', (done) => {
    bfx_rest.new_deposit('BTC', 'bitcoin', 'exchange', (err, data) => {
      expect(data.result).to.eql('success')
      done()
    })
  })
  describe('orders', () => {
    it('should place a new order', (done) => {
      const errCB = function (err, value) {
        expect(err.toString()).is.eql('Error: Invalid order: not enough exchange balance for 0.01 BTCUSD at 0.01')
        expect(err instanceof Error).ok
        return done()
      }
      bfx_rest.new_order('BTCUSD', '0.01', '0.01', 'bitfinex', 'buy', 'exchange limit', false, errCB)
    })
    it('should place multiple orders', (done) => {
      const errCB = function (err, value) {
        expect(err instanceof Error).ok
        expect(err.toString()).is.eql("Error: Couldn't place an order: Invalid order: not enough exchange balance for 0.01 BTCUSD at 0.01")
        return done()
      }
      const orders = [{
        'symbol': 'BTCUSD',
        'amount': '0.01',
        'price': '0.01',
        'exchange': 'bitfinex',
        'side': 'buy',
        'type': 'exchange limit'
      }, {
        'symbol': 'BTCUSD',
        'amount': '0.02',
        'price': '0.03',
        'exchange': 'bitfinex',
        'side': 'buy',
        'type': 'exchange limit'
      }]
      bfx_rest.multiple_new_orders(orders, errCB)
    })
    it('should cancel an order', (done) => {
      const errCB = function (err, value) {
        expect(err instanceof Error).ok
        expect(err.toString()).is.eql('Error: Order could not be cancelled.')
        return done()
      }
      bfx_rest.cancel_order(1, errCB)
    })
        // TODO API needs to be fixed, never throws error
    it.skip('should cancel multiple orders', (done) => {
      const errCB = function (err, value) {
        expect(err instanceof Error).ok
        expect(err.toString()).is.eql('Error: Order could not be cancelled.')
        return done()
      }
      bfx_rest.cancel_multiple_orders([1, 2], errCB)
    })
        // TODO API needs to be fixed, never throws error
    it.skip('should cancel all orders', (done) => {
      const errCB = function (err, value) {
        expect(err instanceof Error).ok
        expect(err.toString()).is.eql('Error: Order could not be cancelled.')
        return done()
      }
      bfx_rest.cancel_all_orders(errCB)
    })
    it('should replace an order', (done) => {
      const errCB = function (err, value) {
        expect(err instanceof Error).ok
        expect(err.toString()).is.eql('Error: Order could not be cancelled.')
        return done()
      }
      bfx_rest.replace_order(1, 'BTCUSD', '0.01', '0.01', 'bitfinex', 'buy', 'exchange limit', errCB)
    })
        // TODO throws 404 error, is that intentional?
    it.skip('should get an orders status', (done) => {
      const errCB = function (err, value) {
        expect(err instanceof Error).ok
        expect(err.toString()).is.eql('Error: Order could not be cancelled.')
        return done()
      }
      bfx_rest.order_status(1000, errCB)
    })
    it('should get active orders', (done) => {
      const cb = function (err, data) {
        expect(data).to.be.an.array
        expect(data).to.be.empty
        return done()
      }
      bfx_rest.active_orders(cb)
    })
  })
  describe('positions', () => {
    it('should get active positions', (done) => {
      const cb = function (err, data) {
        expect(data).to.be.an.array
        expect(data).is.empty
        return done()
      }
      bfx_rest.active_positions(cb)
    })
        // TODO returns 404 instead of JSON on failure
    it.skip('should claim a position', (done) => {
      const errCB = function (err, data) {
        expect(err instanceof Error).ok
        expect(err.toString()).is.eql('Error: Order could not be cancelled.')
        return done()
      }
      bfx_rest.claim_position(12345, errCB)
    })
  })
  describe('historical data', () => {
    it('should get balance history', (done) => {
      const cb = function (err, data) {
        expect(data).to.be.an.array
        expect(data).to.be.empty
        return done()
      }
      bfx_rest.balance_history('USD', {}, cb)
    })
    it('should get deposit/withdrawal history', (done) => {
      const cb = function (err, data) {
        expect(data).to.be.an.array
        expect(data).to.be.empty
        return done()
      }
      bfx_rest.movements('USD', {}, cb)
    })
    it('should get past trades', (done) => {
      const cb = function (err, data) {
        expect(data).to.be.an.array
        expect(data).to.be.empty
        return done()
      }
      bfx_rest.past_trades('BTCUSD', {}, cb)
    })
  })
  describe('margin funding', () => {
    it('should place a new offer', (done) => {
      const errCB = function (err, data) {
        expect(err instanceof Error).ok
        expect(err.toString()).is.eql('Error: Invalid offer: not enough balance')
        return done()
      }
      bfx_rest.new_offer('USD', '0.01', '0.02', 2, 'lend', errCB)
    })
    it('should cancel an offer', (done) => {
      const errCB = function (err, data) {
        expect(err instanceof Error).ok
        expect(err.toString()).is.eql('Error: Offer could not be cancelled.')
        return done()
      }
      bfx_rest.cancel_offer(12345, errCB)
    })
        // TODO returns 404
    it('should get an offer status', (done) => {
      const errCB = function (err, data) {
        expect(err instanceof Error).ok
        expect(err.toString()).is.eql('Error: 404')
        return done()
      }
      bfx_rest.offer_status(12345, errCB)
    })
    it('should get active credits', (done) => {
      const cb = function (err, data) {
        expect(data).to.be.an.array
        expect(data).to.be.empty
        return done()
      }
      bfx_rest.active_credits(cb)
    })
    it('should get active funding used in a margin position', (done) => {
      const cb = function (err, data) {
        expect(data).to.be.an.array
        expect(data).to.be.empty
        return done()
      }
      bfx_rest.taken_swaps(cb)
    })
    it('should get total taken funds', (done) => {
      const cb = function (err, data) {
        expect(data).to.be.an.array
        expect(data).to.be.empty
        return done()
      }
      bfx_rest.total_taken_swaps(cb)
    })
  })
  it('should get wallet balances', (done) => {
    const cb = function (err, data) {
      expect(data).to.be.an.array
      expect(data).to.be.empty
      return done()
    }
    bfx_rest.wallet_balances(cb)
  })
  it('should get margin information', (done) => {
    const cb = function (err, data) {
      expect(data[0]).to.be.an.array
      expect(_.keys(data[0])).to.eql(
        [
          'margin_balance',
          'tradable_balance',
          'unrealized_pl',
          'unrealized_swap',
          'net_value',
          'required_margin',
          'leverage',
          'margin_requirement',
          'margin_limits',
          'message'])
      return done()
    }
    bfx_rest.margin_infos(cb)
  })
  it('should transfer between wallets', (done) => {
    const errCB = function (err, data) {
      expect(err instanceof Error).ok
      expect(err.toString()).to.eql('Error: 403')
      return done()
    }
    bfx_rest.transfer(0.01, 'BTC', 'exchange', 'trading', errCB)
  })
  it('should submit a withdrawal', (done) => {
    const errCB = function (err, data) {
      expect(err instanceof Error).ok
      expect(err.toString()).to.eql('Error: 403')
      return done()
    }
    bfx_rest.withdraw('bitcoin', 'exchange', 0.01, 'abc', errCB)
  })
})
describe('Authenticated Endpoints: read-only key', () => {
  let bfx, bfx_rest
  before(() => {
    bfx = new BFX()
    bfx_rest = bfx.rest
  })
  it('should get account info')
  it('should get a deposit address')
  describe('orders', () => {
    it('should place a new order')
    it('should place multiple orders')
    it('should cancel an order')
    it('should cancel multiple orders')
    it('should cancel all orders')
    it('should replace an order')
    it('should get an orders status')
    it('should get active orders')
  })
  describe('positions', () => {
    it('should get active positions')
    it('should claim a position')
  })
  describe('historical data', () => {
    it('should get balance history')
    it('should get deposit/withdrawal history')
    it('should get past trades')
  })
  describe('margin funding', () => {
    it('should place a new offer')
    it('should cancel an offer')
    it('should get an offer status')
    it('should get active credits')
    it('should get active funding used in a margin position')
    it('should get total taken funds')
  })
  it('should get wallet balances')
  it('should get margin information')
  it('should transfer between wallets')
  it('should submit a withdrawal')
})
describe('Authenticated Endpoints: withdrawal-enabled key', () => {
  let bfx, bfx_rest
  before(() => {
    bfx = new BFX()
    bfx_rest = bfx.rest
  })
  it('should get account info')
  it('should get a deposit address')
  describe('orders', () => {
    it('should place a new order')
    it('should place multiple orders')
    it('should cancel an order')
    it('should cancel multiple orders')
    it('should cancel all orders')
    it('should replace an order')
    it('should get an orders status')
    it('should get active orders')
  })
  describe('positions', () => {
    it('should get active positions')
    it('should claim a position')
  })
  describe('historical data', () => {
    it('should get balance history')
    it('should get deposit/withdrawal history')
    it('should get past trades')
  })
  describe('margin funding', () => {
    it('should place a new offer')
    it('should cancel an offer')
    it('should get an offer status')
    it('should get active credits')
    it('should get active funding used in a margin position')
    it('should get total taken funds')
  })
  it('should get wallet balances')
  it('should get margin information')
  it('should transfer between wallets')
  it('should submit a withdrawal')
})

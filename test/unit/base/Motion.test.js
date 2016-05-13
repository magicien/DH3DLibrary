import Motion from '../../../src/js/base/Motion'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('Motion class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(Motion).to.respondTo('constructor')
    })
  })

  describe('clone function', () => {
    it('should work', () => {
      expect(Motion).to.respondTo('clone')
    })
  })

  describe('destroy function', () => {
    it('should work', () => {
      expect(Motion).to.respondTo('destroy')
    })
  })

  describe('copy function', () => {
    it('should work', () => {
      expect(Motion).to.respondTo('copy')
    })
  })

})


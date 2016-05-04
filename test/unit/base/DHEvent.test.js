import DHEvent from '../../../src/js/base/DHEvent'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('DHEvent class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(DHEvent).to.respondTo('constructor')
    })
  })

  describe('delete function', () => {
    it('should work', () => {
      expect(DHEvent).to.respondTo('delete')
    })
  })

  describe('start function', () => {
    it('should work', () => {
      expect(DHEvent).to.respondTo('start')
    })
  })

  describe('setEventCallback function', () => {
    it('should work', () => {
      expect(DHEvent).to.respondTo('setEventCallback')
    })
  })

  describe('getEventCallback function', () => {
    it('should work', () => {
      expect(DHEvent).to.respondTo('getEventCallback')
    })
  })

})


import ObjectLoadMonitor from '../../../src/js/base/ObjectLoadMonitor'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('ObjectLoadMonitor class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(ObjectLoadMonitor).to.respondTo('constructor')
    })
  })

  describe('check function', () => {
    it('should work', () => {
      expect(ObjectLoadMonitor).to.respondTo('check')
    })
  })

  describe('add function', () => {
    it('should work', () => {
      expect(ObjectLoadMonitor).to.respondTo('add')
    })
  })

  describe('remove function', () => {
    it('should work', () => {
      expect(ObjectLoadMonitor).to.respondTo('remove')
    })
  })

})


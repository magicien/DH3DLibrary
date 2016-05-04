import PMDModel from '../../../src/js/mmd/PMDModel'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('PMDModel class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(PMDModel).to.respondTo('constructor')
    })
  })

  describe('destroy function', () => {
    it('should work', () => {
      expect(PMDModel).to.respondTo('destroy')
    })
  })

  describe('copy function', () => {
    it('should work', () => {
      expect(PMDModel).to.respondTo('copy')
    })
  })

})


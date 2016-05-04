import IK from '../../../src/js/base/IK'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('IK class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(IK).to.respondTo('constructor')
    })
  })

  describe('clone function', () => {
    it('should work', () => {
      expect(IK).to.respondTo('clone')
    })
  })

  describe('limitAngle function', () => {
    it('should work', () => {
      expect(IK).to.respondTo('limitAngle')
    })
  })

  describe('update function', () => {
    it('should work', () => {
      expect(IK).to.respondTo('update')
    })
  })

})


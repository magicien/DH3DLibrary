import CameraMotion from '../../../src/js/base/CameraMotion'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('CameraMotion class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(CameraMotion).to.respondTo('constructor')
    })
  })

  describe('clone function', () => {
    it('should work', () => {
      expect(CameraMotion).to.respondTo('clone')
    })
  })

  describe('copy function', () => {
    it('should work', () => {
      expect(CameraMotion).to.respondTo('copy')
    })
  })

})


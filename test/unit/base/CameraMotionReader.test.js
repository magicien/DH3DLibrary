import CameraMotionReader from '../../../src/js/base/CameraMotionReader'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('CameraMotionReader class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(CameraMotionReader).to.respondTo('constructor')
    })
  })

  describe('readMotion function', () => {
    it('should work', () => {
      expect(CameraMotionReader).to.respondTo('readMotion')
    })
  })

  describe('readMotionFromFile function', () => {
    it('should work', () => {
      expect(CameraMotionReader).to.respondTo('readMotionFromFile')
    })
  })

})


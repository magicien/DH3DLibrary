import CameraMotionBank from '../../../src/js/base/CameraMotionBank'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('CameraMotionBank class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(CameraMotionBank).to.respondTo('constructor')
    })
  })

  describe('addMotionReader function', () => {
    it('should work', () => {
      expect(CameraMotionBank).to.respondTo('addMotionReader')
    })
  })

  describe('getFileID function', () => {
    it('should work', () => {
      expect(CameraMotionBank).to.respondTo('getFileID')
    })
  })

  describe('getMotion function', () => {
    it('should work', () => {
      expect(CameraMotionBank).to.respondTo('getMotion')
    })
  })

  describe('getMotionFromFile function', () => {
    it('should work', () => {
      expect(CameraMotionBank).to.respondTo('getMotionFromFile')
    })
  })

  describe('onloadMotion function', () => {
    it('should work', () => {
      expect(CameraMotionBank).to.respondTo('onloadMotion')
    })
  })

})


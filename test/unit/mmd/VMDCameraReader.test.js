import VMDCameraReader from '../../../src/js/mmd/VMDCameraReader'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('VMDCameraReader class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(VMDCameraReader).to.respondTo('constructor')
    })
  })

  describe('readMotion function', () => {
    it('should work', () => {
      expect(VMDCameraReader).to.respondTo('readMotion')
    })
  })

  describe('readMotionFromFile function', () => {
    it('should work', () => {
      expect(VMDCameraReader).to.respondTo('readMotionFromFile')
    })
  })

  describe('readMotionProcess function', () => {
    it('should work', () => {
      expect(VMDCameraReader).to.respondTo('readMotionProcess')
    })
  })

  describe('readHeader function', () => {
    it('should work', () => {
      expect(VMDCameraReader).to.respondTo('readHeader')
    })
  })

  describe('readModelMotionFrames function', () => {
    it('should work', () => {
      expect(VMDCameraReader).to.respondTo('readModelMotionFrames')
    })
  })

  describe('readFrames function', () => {
    it('should work', () => {
      expect(VMDCameraReader).to.respondTo('readFrames')
    })
  })

})


import VMDReader from '../../../src/js/mmd/VMDReader'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('VMDReader class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(VMDReader).to.respondTo('constructor')
    })
  })

  describe('readMotion function', () => {
    it('should work', () => {
      expect(VMDReader).to.respondTo('readMotion')
    })
  })

  describe('readMotionFromFile function', () => {
    it('should work', () => {
      expect(VMDReader).to.respondTo('readMotionFromFile')
    })
  })

  describe('readMotionProcess function', () => {
    it('should work', () => {
      expect(VMDReader).to.respondTo('readMotionProcess')
    })
  })

  describe('readHeader function', () => {
    it('should work', () => {
      expect(VMDReader).to.respondTo('readHeader')
    })
  })

  describe('readFrames function', () => {
    it('should work', () => {
      expect(VMDReader).to.respondTo('readFrames')
    })
  })

  describe('readFace function', () => {
    it('should work', () => {
      expect(VMDReader).to.respondTo('readFace')
    })
  })

  describe('readCamera function', () => {
    it('should work', () => {
      expect(VMDReader).to.respondTo('readCamera')
    })
  })

  describe('readLight function', () => {
    it('should work', () => {
      expect(VMDReader).to.respondTo('readLight')
    })
  })

  describe('readShadow function', () => {
    it('should work', () => {
      expect(VMDReader).to.respondTo('readShadow')
    })
  })

  describe('readVisibilityAndIK function', () => {
    it('should work', () => {
      expect(VMDReader).to.respondTo('readVisibilityAndIK')
    })
  })

})


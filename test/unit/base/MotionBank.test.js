import MotionBank from '../../../src/js/base/MotionBank'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('MotionBank class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(MotionBank).to.respondTo('constructor')
    })
  })

  describe('addMotionReader function', () => {
    it('should work', () => {
      expect(MotionBank).to.respondTo('addMotionReader')
    })
  })

  describe('getFileID function', () => {
    it('should work', () => {
      expect(MotionBank).to.respondTo('getFileID')
    })
  })

  describe('getMotion function', () => {
    it('should work', () => {
      expect(MotionBank).to.respondTo('getMotion')
    })
  })

  describe('getMotionFromFile function', () => {
    it('should work', () => {
      expect(MotionBank).to.respondTo('getMotionFromFile')
    })
  })

})


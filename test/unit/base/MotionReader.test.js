import MotionReader from '../../../src/js/base/MotionReader'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('MotionReader class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(MotionReader).to.respondTo('constructor')
    })
  })

  describe('readMotion function', () => {
    it('should work', () => {
      expect(MotionReader).to.respondTo('readMotion')
    })
  })

  describe('readMotionFromFile function', () => {
    it('should work', () => {
      expect(MotionReader).to.respondTo('readMotionFromFile')
    })
  })

})


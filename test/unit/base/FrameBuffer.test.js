import FrameBuffer from '../../../src/js/base/FrameBuffer'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('FrameBuffer class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(FrameBuffer).to.respondTo('constructor')
    })
  })

  describe('begin function', () => {
    it('should work', () => {
      expect(FrameBuffer).to.respondTo('begin')
    })
  })

  describe('end function', () => {
    it('should work', () => {
      expect(FrameBuffer).to.respondTo('end')
    })
  })

})


import MMDAnimator from '../../../src/js/mmd/MMDAnimator'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('MMDAnimator class', () => {

  describe('updateMotion function', () => {
    it('should work', () => {
      expect(MMDAnimator).to.respondTo('updateMotion')
    })
  })

  describe('setBone function', () => {
    it('should work', () => {
      expect(MMDAnimator).to.respondTo('setBone')
    })
  })

  describe('getBezierValue function', () => {
    it('should work', () => {
      expect(MMDAnimator).to.respondTo('getBezierValue')
    })
  })

  describe('setFace function', () => {
    it('should work', () => {
      expect(MMDAnimator).to.respondTo('setFace')
    })
  })

})


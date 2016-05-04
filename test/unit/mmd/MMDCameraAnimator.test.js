import MMDCameraAnimator from '../../../src/js/mmd/MMDCameraAnimator'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('MMDCameraAnimator class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(MMDCameraAnimator).to.respondTo('constructor')
    })
  })

  describe('updateMotion function', () => {
    it('should work', () => {
      expect(MMDCameraAnimator).to.respondTo('updateMotion')
    })
  })

  describe('getBezierValue function', () => {
    it('should work', () => {
      expect(MMDCameraAnimator).to.respondTo('getBezierValue')
    })
  })

})


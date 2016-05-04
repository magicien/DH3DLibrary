import Animator from '../../../src/js/base/Animator'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('Animator class', () => {

  describe('animate function', () => {
    it('should work', () => {
      expect(Animator).to.respondTo('animate')
    })
  })

  describe('updateMotion function', () => {
    it('should work', () => {
      expect(Animator).to.respondTo('updateMotion')
    })
  })

})


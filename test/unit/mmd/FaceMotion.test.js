import FaceMotion from '../../../src/js/mmd/FaceMotion'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('FaceMotion class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(FaceMotion).to.respondTo('constructor')
    })
  })

})


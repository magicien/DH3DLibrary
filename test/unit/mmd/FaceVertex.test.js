import FaceVertex from '../../../src/js/mmd/FaceVertex'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('FaceVertex class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(FaceVertex).to.respondTo('constructor')
    })
  })

})


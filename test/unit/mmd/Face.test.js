import Face from '../../../src/js/mmd/Face'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('Face class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(Face).to.respondTo('constructor')
    })
  })

  describe('setFace function', () => {
    it('should work', () => {
      expect(Face).to.respondTo('setFace')
    })
  })

  describe('blendFace function', () => {
    it('should work', () => {
      expect(Face).to.respondTo('blendFace')
    })
  })

})


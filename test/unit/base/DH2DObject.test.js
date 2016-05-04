import DH2DObject from '../../../src/js/base/DH2DObject'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('DH2DObject class', () => {

  describe('move function', () => {
    it('should work', () => {
      expect(DH2DObject).to.respondTo('move')
    })
  })

  describe('animate function', () => {
    it('should work', () => {
      expect(DH2DObject).to.respondTo('animate')
    })
  })

  describe('render function', () => {
    it('should work', () => {
      expect(DH2DObject).to.respondTo('render')
    })
  })

})


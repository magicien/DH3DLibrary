import Vector3 from '../../../src/js/base/Vector3'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('Vector3 class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(Vector3).to.respondTo('constructor')
    })
  })

  describe('clone function', () => {
    it('should work', () => {
      expect(Vector3).to.respondTo('clone')
    })
  })

  describe('setValue function', () => {
    it('should work', () => {
      expect(Vector3).to.respondTo('setValue')
    })
  })

  describe('add function', () => {
    it('should work', () => {
      expect(Vector3).to.respondTo('add')
    })
  })

  describe('sub function', () => {
    it('should work', () => {
      expect(Vector3).to.respondTo('sub')
    })
  })

  describe('mul function', () => {
    it('should work', () => {
      expect(Vector3).to.respondTo('mul')
    })
  })

  describe('mulAdd function', () => {
    it('should work', () => {
      expect(Vector3).to.respondTo('mulAdd')
    })
  })

  describe('normalize function', () => {
    it('should work', () => {
      expect(Vector3).to.respondTo('normalize')
    })
  })

  describe('dot function', () => {
    it('should work', () => {
      expect(Vector3).to.respondTo('dot')
    })
  })

  describe('cross function', () => {
    it('should work', () => {
      expect(Vector3).to.respondTo('cross')
    })
  })

  describe('lerp function', () => {
    it('should work', () => {
      expect(Vector3).to.respondTo('lerp')
    })
  })

  describe('quaternionToEuler function', () => {
    it('should work', () => {
      expect(Vector3).to.respondTo('quaternionToEuler')
    })
  })

  describe('length function', () => {
    it('should work', () => {
      expect(Vector3).to.respondTo('length')
    })
  })

  describe('getWebGLFloatArray function', () => {
    it('should work', () => {
      expect(Vector3).to.respondTo('getWebGLFloatArray')
    })
  })

})


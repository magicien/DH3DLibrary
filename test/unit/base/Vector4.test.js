import Vector4 from '../../../src/js/base/Vector4'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('Vector4 class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(Vector4).to.respondTo('constructor')
    })
  })

  describe('clone function', () => {
    it('should work', () => {
      expect(Vector4).to.respondTo('clone')
    })
  })

  describe('setValue function', () => {
    it('should work', () => {
      expect(Vector4).to.respondTo('setValue')
    })
  })

  describe('lerp function', () => {
    it('should work', () => {
      expect(Vector4).to.respondTo('lerp')
    })
  })

  describe('slerp function', () => {
    it('should work', () => {
      expect(Vector4).to.respondTo('slerp')
    })
  })

  describe('ln function', () => {
    it('should work', () => {
      expect(Vector4).to.respondTo('ln')
    })
  })

  describe('exp function', () => {
    it('should work', () => {
      expect(Vector4).to.respondTo('exp')
    })
  })

  describe('normalize function', () => {
    it('should work', () => {
      expect(Vector4).to.respondTo('normalize')
    })
  })

  describe('createAxis function', () => {
    it('should work', () => {
      expect(Vector4).to.respondTo('createAxis')
    })
  })

  describe('cross function', () => {
    it('should work', () => {
      expect(Vector4).to.respondTo('cross')
    })
  })

  describe('eulerToQuaternion function', () => {
    it('should work', () => {
      expect(Vector4).to.respondTo('eulerToQuaternion')
    })
  })

  describe('quaternionFromMatrix function', () => {
    it('should work', () => {
      expect(Vector4).to.respondTo('quaternionFromMatrix')
    })
  })

  describe('getWebGLFloatArray function', () => {
    it('should work', () => {
      expect(Vector4).to.respondTo('getWebGLFloatArray')
    })
  })

})


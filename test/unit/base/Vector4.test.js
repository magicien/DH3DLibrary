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

  describe('rotationToQuaternion function', () => {
    it('should work', () => {
      expect(Vector4).to.respondTo('rotationToQuaternion')
    })

    it('should be able to convert rotation => quaternion => rotation', () => {
      const src = new Vector4(0.8, 0.4, 0.4, 0.5)
      const quat = new Vector4()
      const dst = new Vector4()

      quat.rotationToQuaternion(src)
      dst.quaternionToRotation(quat)

      const epsilon = 0.001
      expect(src.x).to.be.closeTo(dst.x, epsilon)
      expect(src.y).to.be.closeTo(dst.y, epsilon)
      expect(src.z).to.be.closeTo(dst.z, epsilon)
      expect(src.w).to.be.closeTo(dst.w, epsilon)
    })
  })

  describe('quaternionToRotation function', () => {
    it('should work', () => {
      expect(Vector4).to.respondTo('quaternionToRotation')
    })

    it('should be able to convert quaternion => rotation => quaternion', () => {
      const src = new Vector4(0.8, 0.4, 0.4, 0.5)
      const rot = new Vector4()
      const dst = new Vector4()

      rot.quaternionToRotation(src)
      dst.rotationToQuaternion(rot)

      const epsilon = 0.001
      expect(src.x).to.be.closeTo(dst.x, epsilon)
      expect(src.y).to.be.closeTo(dst.y, epsilon)
      expect(src.z).to.be.closeTo(dst.z, epsilon)
      expect(src.w).to.be.closeTo(dst.w, epsilon)
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


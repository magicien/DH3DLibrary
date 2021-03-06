import Matrix from '../../../src/js/base/Matrix'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('Matrix class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(Matrix).to.respondTo('constructor')
    })
  })

  describe('clone function', () => {
    it('should work', () => {
      expect(Matrix).to.respondTo('clone')
    })
  })

  describe('identity function', () => {
    it('should work', () => {
      expect(Matrix).to.respondTo('identity')
    })
  })

  describe('multiplyMatrix function', () => {
    it('should work', () => {
      expect(Matrix).to.respondTo('multiplyMatrix')
    })

    it('should calculate Matrix multiplication', () => {
      const src1 = new Matrix([
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16
      ])
      const src2 = new Matrix([
        21, 22, 23, 24,
        25, 26, 27, 28,
        29, 30, 31, 32,
        33, 34, 35, 36
      ])
      const dst = new Matrix()
      const answer = new Matrix([
        290, 300, 310, 320,
        722, 748, 774, 800,
        1154, 1196, 1238, 1280,
        1586, 1644, 1702, 1760
      ])

      dst.multiplyMatrix(src1, src2)

      expect(dst.m11).to.equal(answer.m11)
      expect(dst.m12).to.equal(answer.m12)
      expect(dst.m13).to.equal(answer.m13)
      expect(dst.m14).to.equal(answer.m14)
      expect(dst.m21).to.equal(answer.m21)
      expect(dst.m22).to.equal(answer.m22)
      expect(dst.m23).to.equal(answer.m23)
      expect(dst.m24).to.equal(answer.m24)
      expect(dst.m31).to.equal(answer.m31)
      expect(dst.m32).to.equal(answer.m32)
      expect(dst.m33).to.equal(answer.m33)
      expect(dst.m34).to.equal(answer.m34)
      expect(dst.m41).to.equal(answer.m41)
      expect(dst.m42).to.equal(answer.m42)
      expect(dst.m43).to.equal(answer.m43)
      expect(dst.m44).to.equal(answer.m44)
    })
  })

  describe('lerp function', () => {
    it('should work', () => {
      expect(Matrix).to.respondTo('lerp')
    })
  })

  describe('matrixFromQuaternion function', () => {
    it('should work', () => {
      expect(Matrix).to.respondTo('matrixFromQuaternion')
    })
  })

  describe('copyMatrix function', () => {
    it('should work', () => {
      expect(Matrix).to.respondTo('copyMatrix')
    })
  })

  describe('inverseMatrix function', () => {
    it('should work', () => {
      expect(Matrix).to.respondTo('inverseMatrix')
    })
  })

  describe('transposeMatrix function', () => {
    it('should work', () => {
      expect(Matrix).to.respondTo('transposeMatrix')
    })
  })

  describe('scale function', () => {
    it('should work', () => {
      expect(Matrix).to.respondTo('scale')
    })
  })

  describe('translate function', () => {
    it('should work', () => {
      expect(Matrix).to.respondTo('translate')
    })
  })

  describe('rotate function', () => {
    it('should work', () => {
      expect(Matrix).to.respondTo('rotate')
    })
  })

  describe('getWebGLFloatArray function', () => {
    it('should work', () => {
      expect(Matrix).to.respondTo('getWebGLFloatArray')
    })
  })

  describe('getWebGLFloatArrayTransposed function', () => {
    it('should work', () => {
      expect(Matrix).to.respondTo('getWebGLFloatArrayTransposed')
    })
  })

  describe('getArray function', () => {
    it('should work', () => {
      expect(Matrix).to.respondTo('getArray')
    })
  })

  describe('showMatrix function', () => {
    it('should work', () => {
      expect(Matrix).to.respondTo('showMatrix')
    })
  })

})


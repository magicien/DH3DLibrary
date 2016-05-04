import Bone from '../../../src/js/base/Bone'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('Bone class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(Bone).to.respondTo('constructor')
    })

    it('should initialize variables', () => {
      const bone = new Bone()
      //expect(res).to.equal(testData)
      expect(bone.name).to.equal('')
      expect(bone.englishName).to.equal('')
      expect(bone.parentNo).to.equal(-1)
      expect(bone.childNo).to.equal(-1)
      expect(bone.type).to.equal(0)
      expect(bone.ikTarget).to.equal(-1)
      // position
      expect(bone.parentBone).to.equal(null)
      // expect(bone.childBoneArray).to.equal()
      // localMatrix
      // rotate
      // scale
      // scaleMatrix
      // bonePosition
      // offset
      // offsetMatrix
      // inflMatrix
      // blendPosition
      // blendRotation
      // isKnee

    })
  })

  describe('initBoneData function', () => {
    it('should work', () => {
      expect(Bone).to.respondTo('initBoneData')
    })
  })

  describe('clone function', () => {
    it('should work', () => {
      expect(Bone).to.respondTo('clone')
    })
  })

  describe('addChild function', () => {
    it('should work', () => {
      expect(Bone).to.respondTo('addChild')
    })
  })

  describe('removeChild function', () => {
    it('should work', () => {
      expect(Bone).to.respondTo('removeChild')
    })
  })

  describe('reset function', () => {
    it('should work', () => {
      expect(Bone).to.respondTo('reset')
    })
  })

  describe('updateMatrix function', () => {
    it('should work', () => {
      expect(Bone).to.respondTo('updateMatrix')
    })
  })

  describe('updateInflMatrix function', () => {
    it('should work', () => {
      expect(Bone).to.respondTo('updateInflMatrix')
    })
  })

  describe('updateMatrixRecursive function', () => {
    it('should work', () => {
      expect(Bone).to.respondTo('updateMatrixRecursive')
    })
  })

  describe('setBlendValue function', () => {
    it('should work', () => {
      expect(Bone).to.respondTo('setBlendValue')
    })
  })

  describe('setBlendValueRecursive function', () => {
    it('should work', () => {
      expect(Bone).to.respondTo('setBlendValueRecursive')
    })
  })

})


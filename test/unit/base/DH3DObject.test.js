import DH3DObject from '../../../src/js/base/DH3DObject'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('DH3DObject class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('constructor')
    })
  })

  describe('addMoveCallback function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('addMoveCallback')
    })
  })

  describe('move function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('move')
    })
  })

  describe('getModel function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('getModel')
    })
  })

  describe('setModel function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setModel')
    })
  })

  describe('getMotion function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('getMotion')
    })
  })

  describe('setMotion function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setMotion')
    })
  })

  describe('setMotionWithBlending function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setMotionWithBlending')
    })
  })

  describe('setRenderer function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setRenderer')
    })
  })

  describe('setAnimating function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setAnimating')
    })
  })

  describe('getAnimating function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('getAnimating')
    })
  })

  describe('setLoop function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setLoop')
    })
  })

  describe('getLoop function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('getLoop')
    })
  })

  describe('setAnimator function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setAnimator')
    })
  })

  describe('setAnimationTime function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setAnimationTime')
    })
  })

  describe('getAnimationTime function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('getAnimationTime')
    })
  })

  describe('setAnimationSpeed function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setAnimationSpeed')
    })
  })

  describe('getAnimationSpeed function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('getAnimationSpeed')
    })
  })

  describe('setPosition function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setPosition')
    })
  })

  describe('setSpeed function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setSpeed')
    })
  })

  describe('setRotate function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setRotate')
    })
  })

  describe('setRotateAxis function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setRotateAxis')
    })
  })

  describe('setScale function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setScale')
    })
  })

  describe('setAutoDirection function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setAutoDirection')
    })
  })

  describe('getAutoDirection function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('getAutoDirection')
    })
  })

  describe('setMirror function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setMirror')
    })
  })

  describe('getMirror function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('getMirror')
    })
  })

  describe('setReflectionMode function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setReflectionMode')
    })
  })

  describe('getReflectionMode function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('getReflectionMode')
    })
  })

  describe('updateMaterial function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('updateMaterial')
    })
  })

  describe('getSkinArray function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('getSkinArray')
    })
  })

  describe('getDynamicSkinArray function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('getDynamicSkinArray')
    })
  })

  describe('getNumElements function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('getNumElements')
    })
  })

  describe('getTexture function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('getTexture')
    })
  })

  describe('animate function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('animate')
    })
  })

  describe('render function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('render')
    })
  })

  describe('renderMirror function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('renderMirror')
    })
  })

  describe('addMotionCallback function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('addMotionCallback')
    })
  })

  describe('removeMotionCallback function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('removeMotionCallback')
    })
  })

  describe('clearMotionCallback function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('clearMotionCallback')
    })
  })

  describe('setDirection function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setDirection')
    })
  })

  describe('getDirection function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('getDirection')
    })
  })

  describe('setMaxSpeed function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setMaxSpeed')
    })
  })

  describe('getMaxSpeed function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('getMaxSpeed')
    })
  })

  describe('setState function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('setState')
    })
  })

  describe('getState function', () => {
    it('should work', () => {
      expect(DH3DObject).to.respondTo('getState')
    })
  })

})


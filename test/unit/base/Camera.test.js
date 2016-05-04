import Camera from '../../../src/js/base/Camera'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('Camera class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('constructor')
    })
  })

  describe('identity function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('identity')
    })
  })

  describe('setMotion function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('setMotion')
    })
  })

  describe('getMotion function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('getMotion')
    })
  })

  describe('setAnimating function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('setAnimating')
    })
  })

  describe('getAnimating function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('getAnimating')
    })
  })

  describe('setLoop function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('setLoop')
    })
  })

  describe('getLoop function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('getLoop')
    })
  })

  describe('setAnimator function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('setAnimator')
    })
  })

  describe('setAnimationTime function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('setAnimationTime')
    })
  })

  describe('getAnimationTime function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('getAnimationTime')
    })
  })

  describe('setPosition function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('setPosition')
    })
  })

  describe('translate function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('translate')
    })
  })

  describe('rotate function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('rotate')
    })
  })

  describe('scale function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('scale')
    })
  })

  describe('scaleProjection function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('scaleProjection')
    })
  })

  describe('lookat function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('lookat')
    })
  })

  describe('frustum function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('frustum')
    })
  })

  describe('perspective function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('perspective')
    })
  })

  describe('ortho function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('ortho')
    })
  })

  describe('getProjectionArray function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('getProjectionArray')
    })
  })

  describe('getViewArray function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('getViewArray')
    })
  })

  describe('getProjectionViewMatrix function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('getProjectionViewMatrix')
    })
  })

  describe('getNormalMatrix function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('getNormalMatrix')
    })
  })

  describe('getPosition function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('getPosition')
    })
  })

  describe('getScreenPosition function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('getScreenPosition')
    })
  })

  describe('showCameraMatrix function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('showCameraMatrix')
    })
  })

  describe('changeCoordination function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('changeCoordination')
    })
  })

  describe('bind function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('bind')
    })
  })

  describe('setBindOffset function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('setBindOffset')
    })
  })

  describe('unbind function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('unbind')
    })
  })

  describe('update function', () => {
    it('should work', () => {
      expect(Camera).to.respondTo('update')
    })
  })

})


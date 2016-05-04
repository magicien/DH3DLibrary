import CanvasField from '../../../src/js/base/CanvasField'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('CanvasField class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('constructor')
    })
  })

  describe('getContext function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('getContext')
    })
  })

  describe('get2DContext function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('get2DContext')
    })
  })

  describe('addObject function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('addObject')
    })
  })

  describe('removeObject function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('removeObject')
    })
  })

  describe('start function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('start')
    })
  })

  describe('pause function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('pause')
    })
  })

  describe('reshape function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('reshape')
    })
  })

  describe('drawPicture function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('drawPicture')
    })
  })

  describe('drawOneFrame function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('drawOneFrame')
    })
  })

  describe('setFrameCallback function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('setFrameCallback')
    })
  })

  describe('getFPS function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('getFPS')
    })
  })

  describe('setFPS function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('setFPS')
    })
  })

  describe('getProgram function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('getProgram')
    })
  })

  describe('setProgram function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('setProgram')
    })
  })

  describe('checkGLError function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('checkGLError')
    })
  })

  describe('getCameras function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('getCameras')
    })
  })

  describe('setCamera function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('setCamera')
    })
  })

  describe('getLights function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('getLights')
    })
  })

  describe('setLights function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('setLights')
    })
  })

  describe('enableMirror function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('enableMirror')
    })
  })

  describe('disableMirror function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('disableMirror')
    })
  })

  describe('createMessageWindow function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('createMessageWindow')
    })
  })

  describe('setDropEvent function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('setDropEvent')
    })
  })

  describe('disableDropEvent function', () => {
    it('should work', () => {
      expect(CanvasField).to.respondTo('disableDropEvent')
    })
  })

})


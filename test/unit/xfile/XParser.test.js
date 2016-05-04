import XParser from '../../../src/js/xfile/XParser'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('XParser class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('constructor')
    })
  })

  describe('setParentDirName function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('setParentDirName')
    })
  })

  describe('setModel function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('setModel')
    })
  })

  describe('parse function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('parse')
    })
  })

  describe('moveIndex function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('moveIndex')
    })
  })

  describe('getString function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('getString')
    })
  })

  describe('skip function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('skip')
    })
  })

  describe('addPartialText function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('addPartialText')
    })
  })

  describe('getInteger function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('getInteger')
    })
  })

  describe('getFloat function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('getFloat')
    })
  })

  describe('getCommaOrSemicolon function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('getCommaOrSemicolon')
    })
  })

  describe('getWord function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('getWord')
    })
  })

  describe('getUUID function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('getUUID')
    })
  })

  describe('getLeftBrace function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('getLeftBrace')
    })
  })

  describe('getRightBrace function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('getRightBrace')
    })
  })

  describe('getMember function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('getMember')
    })
  })

  describe('getFilename function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('getFilename')
    })
  })

  describe('getIntegerArray function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('getIntegerArray')
    })
  })

  describe('getFloatArray function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('getFloatArray')
    })
  })

  describe('getVector3 function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('getVector3')
    })
  })

  describe('getVector4 function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('getVector4')
    })
  })

  describe('splitFaceNormals function', () => {
    it('should work', () => {
      expect(XParser).to.respondTo('splitFaceNormals')
    })
  })

})


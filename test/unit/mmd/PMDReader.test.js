import PMDReader from '../../../src/js/mmd/PMDReader'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('PMDReader class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('constructor')
    })
  })

  describe('readModelFromFile function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('readModelFromFile')
    })
  })

  describe('readModelProcess function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('readModelProcess')
    })
  })

  describe('readHeader function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('readHeader')
    })
  })

  describe('readVertex function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('readVertex')
    })
  })

  describe('readIndex function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('readIndex')
    })
  })

  describe('readMaterial function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('readMaterial')
    })
  })

  describe('readBone function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('readBone')
    })
  })

  describe('readIK function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('readIK')
    })
  })

  describe('readFace function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('readFace')
    })
  })

  describe('readFaceDisplay function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('readFaceDisplay')
    })
  })

  describe('readBoneDisplayName function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('readBoneDisplayName')
    })
  })

  describe('readBoneDisplay function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('readBoneDisplay')
    })
  })

  describe('readEnglishInfo function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('readEnglishInfo')
    })
  })

  describe('readToonTexture function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('readToonTexture')
    })
  })

  describe('readRigidBody function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('readRigidBody')
    })
  })

  describe('readConstraint function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('readConstraint')
    })
  })

  describe('updateVertexBone function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('updateVertexBone')
    })
  })

  describe('initRenderGroup function', () => {
    it('should work', () => {
      expect(PMDReader).to.respondTo('initRenderGroup')
    })
  })

})


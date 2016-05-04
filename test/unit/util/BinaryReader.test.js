import BinaryReader from '../../../src/js/util/BinaryReader'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('BinaryReader class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(BinaryReader).to.respondTo('constructor')
    })
  })

  describe('hasBytesAvailable function', () => {
    it('should work', () => {
      expect(BinaryReader).to.respondTo('hasBytesAvailable')
    })
  })

  describe('readData function', () => {
    it('should work', () => {
      expect(BinaryReader).to.respondTo('readData')
    })
  })

  describe('readInteger function', () => {
    it('should work', () => {
      expect(BinaryReader).to.respondTo('readInteger')
    })
  })

  describe('readByte function', () => {
    it('should work', () => {
      expect(BinaryReader).to.respondTo('readByte')
    })
  })

  describe('readUnsignedByte function', () => {
    it('should work', () => {
      expect(BinaryReader).to.respondTo('readUnsignedByte')
    })
  })

  describe('readShort function', () => {
    it('should work', () => {
      expect(BinaryReader).to.respondTo('readShort')
    })
  })

  describe('readUnsignedShort function', () => {
    it('should work', () => {
      expect(BinaryReader).to.respondTo('readUnsignedShort')
    })
  })

  describe('readInt function', () => {
    it('should work', () => {
      expect(BinaryReader).to.respondTo('readInt')
    })
  })

  describe('readUnsignedInt function', () => {
    it('should work', () => {
      expect(BinaryReader).to.respondTo('readUnsignedInt')
    })
  })

  describe('readFloat function', () => {
    it('should work', () => {
      expect(BinaryReader).to.respondTo('readFloat')
    })
  })

  describe('readDouble function', () => {
    it('should work', () => {
      expect(BinaryReader).to.respondTo('readDouble')
    })
  })

  describe('readString function', () => {
    it('should work', () => {
      expect(BinaryReader).to.respondTo('readString')
    })
  })

  describe('skipBytes function', () => {
    it('should work', () => {
      expect(BinaryReader).to.respondTo('skipBytes')
    })
  })

})


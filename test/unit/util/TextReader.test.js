import TextReader from '../../../src/js/util/TextReader'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('TextReader class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(TextReader).to.respondTo('constructor')
    })
  })

  describe('getText function', () => {
    it('should work', () => {
      expect(TextReader).to.respondTo('getText')
    })
  })

  describe('hasBytesAvailable function', () => {
    it('should work', () => {
      expect(TextReader).to.respondTo('hasBytesAvailable')
    })
  })

  describe('readData function', () => {
    it('should work', () => {
      expect(TextReader).to.respondTo('readData')
    })
  })

  describe('readInteger function', () => {
    it('should work', () => {
      expect(TextReader).to.respondTo('readInteger')
    })
  })

  describe('readByte function', () => {
    it('should work', () => {
      expect(TextReader).to.respondTo('readByte')
    })
  })

  describe('readUnsignedByte function', () => {
    it('should work', () => {
      expect(TextReader).to.respondTo('readUnsignedByte')
    })
  })

  describe('readShort function', () => {
    it('should work', () => {
      expect(TextReader).to.respondTo('readShort')
    })
  })

  describe('readUnsignedShort function', () => {
    it('should work', () => {
      expect(TextReader).to.respondTo('readUnsignedShort')
    })
  })

  describe('readInt function', () => {
    it('should work', () => {
      expect(TextReader).to.respondTo('readInt')
    })
  })

  describe('readUnsignedInt function', () => {
    it('should work', () => {
      expect(TextReader).to.respondTo('readUnsignedInt')
    })
  })

  describe('readFloat function', () => {
    it('should work', () => {
      expect(TextReader).to.respondTo('readFloat')
    })
  })

  describe('readDouble function', () => {
    it('should work', () => {
      expect(TextReader).to.respondTo('readDouble')
    })
  })

  describe('readString function', () => {
    it('should work', () => {
      expect(TextReader).to.respondTo('readString')
    })
  })

})


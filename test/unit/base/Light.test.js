import Light from '../../../src/js/base/Light'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('Light class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(Light).to.respondTo('constructor')
    })
  })

  describe('setType function', () => {
    it('should work', () => {
      expect(Light).to.respondTo('setType')
    })
  })

  describe('setPosition function', () => {
    it('should work', () => {
      expect(Light).to.respondTo('setPosition')
    })
  })

  describe('setAmbient function', () => {
    it('should work', () => {
      expect(Light).to.respondTo('setAmbient')
    })
  })

  describe('setDiffuse function', () => {
    it('should work', () => {
      expect(Light).to.respondTo('setDiffuse')
    })
  })

  describe('setSpecular function', () => {
    it('should work', () => {
      expect(Light).to.respondTo('setSpecular')
    })
  })

  describe('getType function', () => {
    it('should work', () => {
      expect(Light).to.respondTo('getType')
    })
  })

  describe('getPosition function', () => {
    it('should work', () => {
      expect(Light).to.respondTo('getPosition')
    })
  })

  describe('getAmbient function', () => {
    it('should work', () => {
      expect(Light).to.respondTo('getAmbient')
    })
  })

  describe('getDiffuse function', () => {
    it('should work', () => {
      expect(Light).to.respondTo('getDiffuse')
    })
  })

  describe('getSpecular function', () => {
    it('should work', () => {
      expect(Light).to.respondTo('getSpecular')
    })
  })

})


import Material from '../../../src/js/base/Material'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('Material class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(Material).to.respondTo('constructor')
    })
  })

  describe('getAmbient function', () => {
    it('should work', () => {
      expect(Material).to.respondTo('getAmbient')
    })
  })

  describe('getDiffuse function', () => {
    it('should work', () => {
      expect(Material).to.respondTo('getDiffuse')
    })
  })

  describe('getSpecular function', () => {
    it('should work', () => {
      expect(Material).to.respondTo('getSpecular')
    })
  })

  describe('getShininess function', () => {
    it('should work', () => {
      expect(Material).to.respondTo('getShininess')
    })
  })

  describe('getEmission function', () => {
    it('should work', () => {
      expect(Material).to.respondTo('getEmission')
    })
  })

  describe('getAlpha function', () => {
    it('should work', () => {
      expect(Material).to.respondTo('getAlpha')
    })
  })

  describe('clearCache function', () => {
    it('should work', () => {
      expect(Material).to.respondTo('clearCache')
    })
  })

})


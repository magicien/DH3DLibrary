import RenderGroup from '../../../src/js/base/RenderGroup'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('RenderGroup class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(RenderGroup).to.respondTo('constructor')
    })
  })

  describe('getBoneData function', () => {
    it('should work', () => {
      expect(RenderGroup).to.respondTo('getBoneData')
    })
  })

  describe('getIndexData function', () => {
    it('should work', () => {
      expect(RenderGroup).to.respondTo('getIndexData')
    })
  })

  describe('getAmbient function', () => {
    it('should work', () => {
      expect(RenderGroup).to.respondTo('getAmbient')
    })
  })

  describe('getDiffuse function', () => {
    it('should work', () => {
      expect(RenderGroup).to.respondTo('getDiffuse')
    })
  })

  describe('getSpecular function', () => {
    it('should work', () => {
      expect(RenderGroup).to.respondTo('getSpecular')
    })
  })

  describe('getShininess function', () => {
    it('should work', () => {
      expect(RenderGroup).to.respondTo('getShininess')
    })
  })

})


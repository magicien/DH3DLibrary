import Model from '../../../src/js/base/Model'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('Model class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(Model).to.respondTo('constructor')
    })
  })

  describe('destroy function', () => {
    it('should work', () => {
      expect(Model).to.respondTo('destroy')
    })
  })

  describe('copy function', () => {
    it('should work', () => {
      expect(Model).to.respondTo('copy')
    })
  })

  describe('cloneForLoading function', () => {
    it('should work', () => {
      expect(Model).to.respondTo('cloneForLoading')
    })
  })

  describe('clone function', () => {
    it('should work', () => {
      expect(Model).to.respondTo('clone')
    })
  })

  describe('cloneBoneRecursive function', () => {
    it('should work', () => {
      expect(Model).to.respondTo('cloneBoneRecursive')
    })
  })

  describe('cloneRenderGroup function', () => {
    it('should work', () => {
      expect(Model).to.respondTo('cloneRenderGroup')
    })
  })

  describe('getSkinArray function', () => {
    it('should work', () => {
      expect(Model).to.respondTo('getSkinArray')
    })
  })

  describe('getDynamicSkinArray function', () => {
    it('should work', () => {
      expect(Model).to.respondTo('getDynamicSkinArray')
    })
  })

})


import ModelBank from '../../../src/js/base/ModelBank'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('ModelBank class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(ModelBank).to.respondTo('constructor')
    })
  })

  describe('addModelReader function', () => {
    it('should work', () => {
      expect(ModelBank).to.respondTo('addModelReader')
    })
  })

  describe('getFileID function', () => {
    it('should work', () => {
      expect(ModelBank).to.respondTo('getFileID')
    })
  })

  describe('getModel function', () => {
    it('should work', () => {
      expect(ModelBank).to.respondTo('getModel')
    })
  })

  describe('getModelFromFile function', () => {
    it('should work', () => {
      expect(ModelBank).to.respondTo('getModelFromFile')
    })
  })

  describe('getModelForRenderer function', () => {
    it('should work', () => {
      expect(ModelBank).to.respondTo('getModelForRenderer')
    })
  })

})


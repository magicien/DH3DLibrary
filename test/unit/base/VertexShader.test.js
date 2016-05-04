import VertexShader from '../../../src/js/base/VertexShader'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('VertexShader class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(VertexShader).to.respondTo('constructor')
    })
  })

  describe('getName function', () => {
    it('should work', () => {
      expect(VertexShader).to.respondTo('getName')
    })
  })

  describe('getShader function', () => {
    it('should work', () => {
      expect(VertexShader).to.respondTo('getShader')
    })
  })

  describe('bindAttribute function', () => {
    it('should work', () => {
      expect(VertexShader).to.respondTo('bindAttribute')
    })
  })

  describe('bindAttribute2 function', () => {
    it('should work', () => {
      expect(VertexShader).to.respondTo('bindAttribute2')
    })
  })

  describe('bufferDynamicVertexData function', () => {
    it('should work', () => {
      expect(VertexShader).to.respondTo('bufferDynamicVertexData')
    })
  })

  describe('setAttribPointer function', () => {
    it('should work', () => {
      expect(VertexShader).to.respondTo('setAttribPointer')
    })
  })

  describe('setLightData function', () => {
    it('should work', () => {
      expect(VertexShader).to.respondTo('setLightData')
    })
  })

  describe('setMaterialData function', () => {
    it('should work', () => {
      expect(VertexShader).to.respondTo('setMaterialData')
    })
  })

  describe('getVertexData function', () => {
    it('should work', () => {
      expect(VertexShader).to.respondTo('getVertexData')
    })
  })

  describe('getDynamicVertexData function', () => {
    it('should work', () => {
      expect(VertexShader).to.respondTo('getDynamicVertexData')
    })
  })

})


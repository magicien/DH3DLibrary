import ToonVertexShader from '../../../../src/js/renderer/toon/ToonVertexShader'
import chai from '../../../../node_modules/chai/chai'
import sinon from '../../../../node_modules/sinon'
import sinon_chai from '../../../../node_modules/sinon-chai'
import mocha_sinon from '../../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('ToonVertexShader class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(ToonVertexShader).to.respondTo('constructor')
    })
  })

  describe('bindAttribute function', () => {
    it('should work', () => {
      expect(ToonVertexShader).to.respondTo('bindAttribute')
    })
  })

  describe('bindAttribute2 function', () => {
    it('should work', () => {
      expect(ToonVertexShader).to.respondTo('bindAttribute2')
    })
  })

  describe('bufferDynamicVertexData function', () => {
    it('should work', () => {
      expect(ToonVertexShader).to.respondTo('bufferDynamicVertexData')
    })
  })

  describe('setAttribPointer function', () => {
    it('should work', () => {
      expect(ToonVertexShader).to.respondTo('setAttribPointer')
    })
  })

  describe('setLightData function', () => {
    it('should work', () => {
      expect(ToonVertexShader).to.respondTo('setLightData')
    })
  })

  describe('setMaterialData function', () => {
    it('should work', () => {
      expect(ToonVertexShader).to.respondTo('setMaterialData')
    })
  })

  describe('setClipPlane function', () => {
    it('should work', () => {
      expect(ToonVertexShader).to.respondTo('setClipPlane')
    })
  })

  describe('getVertexData function', () => {
    it('should work', () => {
      expect(ToonVertexShader).to.respondTo('getVertexData')
    })
  })

  describe('getDynamicVertexData function', () => {
    it('should work', () => {
      expect(ToonVertexShader).to.respondTo('getDynamicVertexData')
    })
  })

})


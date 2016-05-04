import SimpleVertexShader from '../../../../src/js/renderer/simple/SimpleVertexShader'
import chai from '../../../../node_modules/chai/chai'
import sinon from '../../../../node_modules/sinon'
import sinon_chai from '../../../../node_modules/sinon-chai'
import mocha_sinon from '../../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('SimpleVertexShader class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(SimpleVertexShader).to.respondTo('constructor')
    })
  })

  describe('bindAttribute function', () => {
    it('should work', () => {
      expect(SimpleVertexShader).to.respondTo('bindAttribute')
    })
  })

  describe('bindAttribute2 function', () => {
    it('should work', () => {
      expect(SimpleVertexShader).to.respondTo('bindAttribute2')
    })
  })

  describe('bufferDynamicVertexData function', () => {
    it('should work', () => {
      expect(SimpleVertexShader).to.respondTo('bufferDynamicVertexData')
    })
  })

  describe('setAttribPointer function', () => {
    it('should work', () => {
      expect(SimpleVertexShader).to.respondTo('setAttribPointer')
    })
  })

  describe('setLightData function', () => {
    it('should work', () => {
      expect(SimpleVertexShader).to.respondTo('setLightData')
    })
  })

  describe('setMaterialData function', () => {
    it('should work', () => {
      expect(SimpleVertexShader).to.respondTo('setMaterialData')
    })
  })

  describe('setClipPlane function', () => {
    it('should work', () => {
      expect(SimpleVertexShader).to.respondTo('setClipPlane')
    })
  })

  describe('getVertexData function', () => {
    it('should work', () => {
      expect(SimpleVertexShader).to.respondTo('getVertexData')
    })
  })

  describe('getDynamicVertexData function', () => {
    it('should work', () => {
      expect(SimpleVertexShader).to.respondTo('getDynamicVertexData')
    })
  })

})


import ShaderBank from '../../../src/js/base/ShaderBank'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('ShaderBank class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(ShaderBank).to.respondTo('constructor')
    })
  })

  describe('registShader function', () => {
    it('should work', () => {
      expect(ShaderBank).to.respondTo('registShader')
    })
  })

  describe('getShader function', () => {
    it('should work', () => {
      expect(ShaderBank).to.respondTo('getShader')
    })
  })

  describe('getShaderOfContext function', () => {
    it('should work', () => {
      expect(ShaderBank).to.respondTo('getShaderOfContext')
    })
  })

})


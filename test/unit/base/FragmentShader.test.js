import FragmentShader from '../../../src/js/base/FragmentShader'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('FragmentShader class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(FragmentShader).to.respondTo('constructor')
    })
  })

  describe('getName function', () => {
    it('should work', () => {
      expect(FragmentShader).to.respondTo('getName')
    })
  })

  describe('getShader function', () => {
    it('should work', () => {
      expect(FragmentShader).to.respondTo('getShader')
    })
  })

  describe('bindAttribute function', () => {
    it('should work', () => {
      expect(FragmentShader).to.respondTo('bindAttribute')
    })
  })

  describe('setLightData function', () => {
    it('should work', () => {
      expect(FragmentShader).to.respondTo('setLightData')
    })
  })

  describe('setMaterialData function', () => {
    it('should work', () => {
      expect(FragmentShader).to.respondTo('setMaterialData')
    })
  })

})


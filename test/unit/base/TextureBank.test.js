import TextureBank from '../../../src/js/base/TextureBank'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('TextureBank class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(TextureBank).to.respondTo('constructor')
    })
  })

  describe('setContext function', () => {
    it('should work', () => {
      expect(TextureBank).to.respondTo('setContext')
    })
  })

  describe('getTextureID function', () => {
    it('should work', () => {
      expect(TextureBank).to.respondTo('getTextureID')
    })
  })

})


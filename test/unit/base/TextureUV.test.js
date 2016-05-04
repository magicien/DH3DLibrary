import TextureUV from '../../../src/js/base/TextureUV'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('TextureUV class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(TextureUV).to.respondTo('constructor')
    })
  })

  describe('setValue function', () => {
    it('should work', () => {
      expect(TextureUV).to.respondTo('setValue')
    })
  })

})


import Renderer from '../../../src/js/base/Renderer'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('Renderer class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(Renderer).to.respondTo('constructor')
    })
  })

  describe('setCamera function', () => {
    it('should work', () => {
      expect(Renderer).to.respondTo('setCamera')
    })
  })

  describe('setLight function', () => {
    it('should work', () => {
      expect(Renderer).to.respondTo('setLight')
    })
  })

  describe('setClearColor function', () => {
    it('should work', () => {
      expect(Renderer).to.respondTo('setClearColor')
    })
  })

  describe('render function', () => {
    it('should work', () => {
      expect(Renderer).to.respondTo('render')
    })
  })

  describe('renderMirror function', () => {
    it('should work', () => {
      expect(Renderer).to.respondTo('renderMirror')
    })
  })

  describe('getContext function', () => {
    it('should work', () => {
      expect(Renderer).to.respondTo('getContext')
    })
  })

  describe('getVertexData function', () => {
    it('should work', () => {
      expect(Renderer).to.respondTo('getVertexData')
    })
  })

  describe('enableStencil function', () => {
    it('should work', () => {
      expect(Renderer).to.respondTo('enableStencil')
    })
  })

  describe('disableStencil function', () => {
    it('should work', () => {
      expect(Renderer).to.respondTo('disableStencil')
    })
  })

})


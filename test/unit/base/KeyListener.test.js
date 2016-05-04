import KeyListener from '../../../src/js/base/KeyListener'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('KeyListener class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(KeyListener).to.respondTo('constructor')
    })
  })

  describe('setEnable function', () => {
    it('should work', () => {
      expect(KeyListener).to.respondTo('setEnable')
    })
  })

  describe('setDisable function', () => {
    it('should work', () => {
      expect(KeyListener).to.respondTo('setDisable')
    })
  })

  describe('keyDownCallback function', () => {
    it('should work', () => {
      expect(KeyListener).to.respondTo('keyDownCallback')
    })
  })

  describe('keyUpCallback function', () => {
    it('should work', () => {
      expect(KeyListener).to.respondTo('keyUpCallback')
    })
  })

  describe('setKeyDownCallback function', () => {
    it('should work', () => {
      expect(KeyListener).to.respondTo('setKeyDownCallback')
    })
  })

  describe('setKeyUpCallback function', () => {
    it('should work', () => {
      expect(KeyListener).to.respondTo('setKeyUpCallback')
    })
  })

  describe('resetKeyNewState function', () => {
    it('should work', () => {
      expect(KeyListener).to.respondTo('resetKeyNewState')
    })
  })

  describe('resetKeyState function', () => {
    it('should work', () => {
      expect(KeyListener).to.respondTo('resetKeyState')
    })
  })

  describe('getKeyState function', () => {
    it('should work', () => {
      expect(KeyListener).to.respondTo('getKeyState')
    })
  })

  describe('getKeyNewState function', () => {
    it('should work', () => {
      expect(KeyListener).to.respondTo('getKeyNewState')
    })
  })

  describe('getAnyKeyState function', () => {
    it('should work', () => {
      expect(KeyListener).to.respondTo('getAnyKeyState')
    })
  })

})


import MessageWindow from '../../../src/js/base/MessageWindow'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('MessageWindow class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('constructor')
    })
  })

  describe('animate function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('animate')
    })
  })

  describe('render function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('render')
    })
  })

  describe('setupTextContext function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('setupTextContext')
    })
  })

  describe('setupBalloonContext function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('setupBalloonContext')
    })
  })

  describe('drawBalloon function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('drawBalloon')
    })
  })

  describe('open function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('open')
    })
  })

  describe('close function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('close')
    })
  })

  describe('getContext function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('getContext')
    })
  })

  describe('setContext function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('setContext')
    })
  })

  describe('getCanvas function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('getCanvas')
    })
  })

  describe('setCanvas function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('setCanvas')
    })
  })

  describe('getIcon function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('getIcon')
    })
  })

  describe('setIcon function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('setIcon')
    })
  })

  describe('getOffset function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('getOffset')
    })
  })

  describe('setOffset function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('setOffset')
    })
  })

  describe('getScreenOffset function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('getScreenOffset')
    })
  })

  describe('setScreenOffset function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('setScreenOffset')
    })
  })

  describe('getMessage function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('getMessage')
    })
  })

  describe('setMessage function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('setMessage')
    })
  })

  describe('getMaxWidth function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('getMaxWidth')
    })
  })

  describe('setMaxWidth function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('setMaxWidth')
    })
  })

  describe('getState function', () => {
    it('should work', () => {
      expect(MessageWindow).to.respondTo('getState')
    })
  })

})


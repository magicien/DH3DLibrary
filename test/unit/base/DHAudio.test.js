import DHAudio from '../../../src/js/base/DHAudio'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('DHAudio class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(DHAudio).to.respondTo('constructor')
    })
  })

  describe('canPlayType function', () => {
    it('should work', () => {
      expect(DHAudio).to.respondTo('canPlayType')
    })
  })

  describe('canPlayMP3 function', () => {
    it('should work', () => {
      expect(DHAudio).to.respondTo('canPlayMP3')
    })
  })

  describe('canPlayOGG function', () => {
    it('should work', () => {
      expect(DHAudio).to.respondTo('canPlayOGG')
    })
  })

  describe('setSound function', () => {
    it('should work', () => {
      expect(DHAudio).to.respondTo('setSound')
    })
  })

  describe('setListener function', () => {
    it('should work', () => {
      expect(DHAudio).to.respondTo('setListener')
    })
  })

  describe('setSoundSource function', () => {
    it('should work', () => {
      expect(DHAudio).to.respondTo('setSoundSource')
    })
  })

  describe('play function', () => {
    it('should work', () => {
      expect(DHAudio).to.respondTo('play')
    })
  })

  describe('playDistanceDirection function', () => {
    it('should work', () => {
      expect(DHAudio).to.respondTo('playDistanceDirection')
    })
  })

  describe('playAt function', () => {
    it('should work', () => {
      expect(DHAudio).to.respondTo('playAt')
    })
  })

  describe('pause function', () => {
    it('should work', () => {
      expect(DHAudio).to.respondTo('pause')
    })
  })

})


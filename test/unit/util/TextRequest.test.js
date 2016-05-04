import TextRequest from '../../../src/js/util/TextRequest'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('TextRequest class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(TextRequest).to.respondTo('constructor')
    })
  })

  describe('getWithCharset function', () => {
    it('should work', () => {
      expect(TextRequest).to.respondTo('getWithCharset')
    })
  })

  describe('postWithCharset function', () => {
    it('should work', () => {
      expect(TextRequest).to.respondTo('postWithCharset')
    })
  })

})


import AjaxRequest from '../../../src/js/util/AjaxRequest'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('AjaxRequest class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(AjaxRequest).to.respondTo('constructor')
    })
  })

  describe('get function', () => {
    it('should work', () => {
      expect(AjaxRequest).to.respondTo('get')
    })
  })

  describe('post function', () => {
    it('should work', () => {
      expect(AjaxRequest).to.respondTo('post')
    })
  })

  describe('request function', () => {
    it('should work', () => {
      expect(AjaxRequest).to.respondTo('request')
    })
  })

})


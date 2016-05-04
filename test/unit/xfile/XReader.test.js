import XReader from '../../../src/js/xfile/XReader'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('XReader class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(XReader).to.respondTo('constructor')
    })
  })

  describe('readModel function', () => {
    it('should work', () => {
      expect(XReader).to.respondTo('readModel')
    })
  })

  describe('readModelFromFile function', () => {
    it('should work', () => {
      expect(XReader).to.respondTo('readModelFromFile')
    })
  })

  describe('readModelProcess function', () => {
    it('should work', () => {
      expect(XReader).to.respondTo('readModelProcess')
    })
  })

})


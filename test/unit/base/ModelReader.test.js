import ModelReader from '../../../src/js/base/ModelReader'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('ModelReader class', () => {

  describe('readModel function', () => {
    it('should work', () => {
      expect(ModelReader).to.respondTo('readModel')
    })
  })

  describe('readModelFromFile function', () => {
    it('should work', () => {
      expect(ModelReader).to.respondTo('readModelFromFile')
    })
  })

})


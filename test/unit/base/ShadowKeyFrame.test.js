import ShadowKeyFrame from '../../../src/js/base/ShadowKeyFrame'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('ShadowKeyFrame class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(ShadowKeyFrame).to.respondTo('constructor')
    })
  })

})


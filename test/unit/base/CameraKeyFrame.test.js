import CameraKeyFrame from '../../../src/js/base/CameraKeyFrame'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('CameraKeyFrame class', () => {

  describe('constructor function', () => {
    it('should work', () => {
      expect(CameraKeyFrame).to.respondTo('constructor')
    })
  })

})


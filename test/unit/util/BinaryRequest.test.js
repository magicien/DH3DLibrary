import BinaryRequest from '../../../src/js/util/BinaryRequest'
import chai from '../../../node_modules/chai/chai'
import sinon from '../../../node_modules/sinon'
import sinon_chai from '../../../node_modules/sinon-chai'
import mocha_sinon from '../../../node_modules/mocha-sinon'

const expect = chai.expect
const server = sinon.fakeServer.create()

describe('BinaryRequest class', () => {
  before(() => {
    sinon.FakeXMLHttpRequest.prototype.overrideMimeType = () => null
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
  })

  describe('constructor function', () => {
    it('should work', () => {
      expect(BinaryRequest).to.respondTo('constructor')
    })
  })

  // FIXME: move to integration test
  /*
  it('should read binary data from url', () => {
    const testData = '123'
    const dataPath = "/data/testData.dat"

    server.respondWith("GET", dataPath, [ 
      200,
      { "Content-Type": "application/octet-stream" },
      testData
    ])

    let promise = BinaryRequest.get(dataPath)
      .then((res) => {
        expect(res).to.equal(testData)
      })
    server.respond();

    return promise
  })
  */
})


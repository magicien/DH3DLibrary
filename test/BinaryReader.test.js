// import BinaryReader from '../src/js/util/BinaryReader'
import BinaryRequest from '../src/js/util/BinaryRequest'
import chai from '../node_modules/chai/chai'

const expect = chai.expect

describe('BinaryReader class test:', () => {
  it('should read binary data from url', () => {
    const testData = '123'
    let data = null
    BinaryRequest.get('/data/testData')
      .then((res) => {
        data = res
        expect(data).to.equal(testData)
      })
  })
})


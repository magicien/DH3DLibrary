import Vector3 from '../src/js/base/Vector3'
import chai from '../node_modules/chai/chai'

const expect = chai.expect

describe('Vector3 class test:', () => {
  it ('should set value (0,0,0) for default instance', () => {
    const v = new Vector3()
    expect(v.x).to.equal(0)
    expect(v.y).to.equal(0)
    expect(v.z).to.equal(0)
  })
})


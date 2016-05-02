import Vector3 from '../../src/js/base/Vector3'
import chai from '../../node_modules/chai/chai'

const expect = chai.expect

describe('Vector3 class test:', () => {
  it ('should set value (0,0,0) for default instance', () => {
    const v = new Vector3()
    expect(v.x).to.equal(0)
    expect(v.y).to.equal(0)
    expect(v.z).to.equal(0)
  })

  it ('should set initial value for instance', () => {
    const v = new Vector3(1, 2, 3)
    expect(v.x).to.equal(1)
    expect(v.y).to.equal(2)
    expect(v.z).to.equal(3)
  })

  it ('should be able to copy values by clone function', () => {
    const src = new Vector3(4, 5, 6)
    const dst = src.clone()
    src.x = src.y = src.z = 0

    expect(dst.x).to.equal(4)
    expect(dst.y).to.equal(5)
    expect(dst.z).to.equal(6)
  })

  it ('should be able to set values', () => {
    const v = new Vector3(10, 20, 30)

    v.setValue(1)
    expect(v.x).to.equal(1)
    expect(v.y).to.equal(0)
    expect(v.z).to.equal(0)

    v.setValue(2, 3)
    expect(v.x).to.equal(2)
    expect(v.y).to.equal(3)
    expect(v.z).to.equal(0)

    v.setValue(4, 5, 6)
    expect(v.x).to.equal(4)
    expect(v.y).to.equal(5)
    expect(v.z).to.equal(6)
  })

  it ('should be able to set value with Vector3 object', () => {
    const src = new Vector3(1, 2, 3)
    const dst = new Vector3(4, 5, 6)
    dst.setValue(src)
    expect(dst.x).to.equal(1)
    expect(dst.y).to.equal(2)
    expect(dst.z).to.equal(3)
  })

  it ('should add two Vector3 values', () => {
    const src1 = new Vector3(12, 34, -56)
    const src2 = new Vector3(31, -41, 59)
    const dst = new Vector3(11, 22, 33)
    dst.add(src1, src2)
    expect(dst.x).to.equal( 12 + 31)
    expect(dst.y).to.equal( 34 - 41)
    expect(dst.z).to.equal(-56 + 59)
  })
    
})


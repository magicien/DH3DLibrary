'use strict'

/**
 * Vector4 class
 * @access public
 */
export default class Vector4 {
  /**
   * constructor
   * @access public
   * @param {float} x -
   * @param {float} y -
   * @param {float} z -
   * @param {float} w -
   * @constructor
   */
  constructor(x = 0.0, y = 0.0, z = 0.0, w = 0.0) {
    this.setValue(x, y, z, w)
  }

  clone() {
    return new Vector4(this.x, this.y, this.z, this.w)
  }

  setValue(x, y = 0.0, z = 0.0, w = 0.0) {
    if((x instanceof Vector4) || (x instanceof Object && x.w !== null)){
      this.x = x.x
      this.y = x.y
      this.z = x.z
      this.w = x.w
    }else{
      this.x = x || 0.0
      this.y = y || 0.0
      this.z = z || 0.0
      this.w = w || 0.0
    }
  }

  lerp(src1, src2, rate) {
    this.x = src1.x + rate * (src2.x - src1.x)
    this.y = src1.y + rate * (src2.y - src1.y)
    this.z = src1.z + rate * (src2.z - src1.z)
    this.w = src1.w + rate * (src2.w - src1.w)
  }

  slerp(src1, src2, rate) {
    const qr = src1.x * src2.x + src1.y * src2.y + src1.z * src2.z + src1.w * src2.w

    if(qr < 0){
      this.x = src1.x - (src1.x + src2.x) * rate
      this.y = src1.y - (src1.y + src2.y) * rate
      this.z = src1.z - (src1.z + src2.z) * rate
      this.w = src1.w - (src1.w + src2.w) * rate
    }else{
      this.x = src1.x + (src2.x - src1.x) * rate
      this.y = src1.y + (src2.y - src1.y) * rate
      this.z = src1.z + (src2.z - src1.z) * rate
      this.w = src1.w + (src2.w - src1.w) * rate
    }
    this.normalize()
  }

  ln(src) {
    const v = new Vector4()
    v.normalize(src)

    const n = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
    if(n === 0){
      this.x = 0
      this.y = 0
      this.z = 0
      this.w = 0
      return
    }
    const theta = Math.atan2(n, v.w) / n

    this.x = theta * v.x
    this.y = theta * v.y
    this.z = theta * v.z
    this.w = 0
  }

  exp(src) {
    const n = Math.sqrt(src.x * src.x + src.y * src.y + src.z * src.z)
    
    if(n > 0.0){
      const sinn = Math.sin(n)
      this.x = sinn * src.x / n
      this.y = sinn * src.y / n
      this.z = sinn * src.z / n
      this.w = Math.cos(n)
    }else{
      this.x = 0.0
      this.y = 0.0
      this.z = 0.0
      this.w = 1.0
    }
  }

  normalize(src = this) {
    const square = 1.0 / Math.sqrt(src.x * src.x + src.y * src.y + src.z * src.z + src.w * src.w)

    this.x = src.x * square
    this.y = src.y * square
    this.z = src.z * square
    this.w = src.w * square
  }

  createAxis(axis, rotAngle) {
    if(Math.abs(rotAngle) < 0.0001){
      this.x = 0.0
      this.y = 0.0
      this.z = 0.0
      this.w = 1.0
    }else{
      const angle = rotAngle * 0.5
      const temp = Math.sin(angle)

      this.x = axis.x * temp
      this.y = axis.y * temp
      this.z = axis.z * temp
      this.w = Math.cos(angle)
    }
  }

  cross(src1, src2) {
    const x = src1.w * src2.x + src1.x * src2.w + src1.y * src2.z - src1.z * src2.y
    const y = src1.w * src2.y - src1.x * src2.z + src1.y * src2.w + src1.z * src2.x
    const z = src1.w * src2.z + src1.x * src2.y - src1.y * src2.x + src1.z * src2.w
    const w = src1.w * src2.w - src1.x * src2.x - src1.y * src2.y - src1.z * src2.z

    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }

  eulerToQuaternion(eulerAngle) {
    const xRadian = eulerAngle.x * 0.5
    const yRadian = eulerAngle.y * 0.5
    const zRadian = eulerAngle.z * 0.5
    const sinX = Math.sin(xRadian)
    const cosX = Math.cos(xRadian)
    const sinY = Math.sin(yRadian)
    const cosY = Math.cos(yRadian)
    const sinZ = Math.sin(zRadian)
    const cosZ = Math.cos(zRadian)

    this.x = sinX * cosY * cosZ - cosX * sinY * sinZ
    this.y = cosX * sinY * cosZ + sinX * cosY * sinZ
    this.z = cosX * cosY * sinZ - sinX * sinY * cosZ
    this.w = cosX * cosY * cosZ + sinX * sinY * sinZ
  }

  rotationToQuaternion(rot){
    if(rot.x == 0 && rot.y == 0 && rot.z == 0){
      this.x = 0
      this.y = 0
      this.z = 0
      this.w = 1
    }else{
      const r = 1.0 / Math.sqrt(rot.x * rot.x + rot.y * rot.y + rot.z * rot.z)
      const cosW = Math.cos(rot.w)
      const sinW = Math.sin(rot.w) * r
      this.x = rot.x * sinW
      this.y = rot.y * sinW
      this.z = rot.z * sinW
      this.w = cosW
    }
  }

  quaternionToRotation(quat){
    if(quat.x == 0 && quat.y == 0 && quat.z == 0){
      this.x = 0
      this.y = 0
      this.z = 0
      this.w = 0
    }else{
      this.x = quat.x
      this.y = quat.y
      this.z = quat.z

      if(quat.w > 1){
        quat.w = 1.0
      }else if(quat.w < -1){
        quat.w = -1.0
      }

      const w = Math.acos(quat.w)

      if(isNaN(w)){
        this.w = 0
      }else{
        this.w = w
      }
    }
  }

  transform(vec, matrix){
    const rx = vec.x * matrix.m11 + vec.y * matrix.m21 + vec.z * matrix.m31 + vec.w * matrix.m41
    const ry = vec.x * matrix.m12 + vec.y * matrix.m22 + vec.z * matrix.m32 + vec.w * matrix.m42
    const rz = vec.x * matrix.m13 + vec.y * matrix.m23 + vec.z * matrix.m33 + vec.w * matrix.m43
    const rw = vec.x * matrix.m14 + vec.y * matrix.m24 + vec.z * matrix.m34 + vec.w * matrix.m44

    this.x = rx
    this.y = ry
    this.z = rz
    this.w = rw
  }

  quaternionFromMatrix(mat) {
    const mx = mat.m11 - mat.m22 - mat.m33
    const my = mat.m22 - mat.m11 - mat.m33
    const mz = mat.m33 - mat.m11 - mat.m22
    const mw = mat.m11 + mat.m22 + mat.m33

    let biggestIndex = 0
    let mval = mw
    if(mx > mval) {
      mval = mx
      biggestIndex = 1
    }
    if(my > mval) {
      mval = my
      biggestIndex = 2
    }
    if(mz > mval) {
      mval = mz
      biggestIndex = 3
    }

    const biggestVal = Math.sqrt(mval + 1.0) * 0.5
    const mult = 0.25 / biggestVal

    switch(biggestIndex) {
      case 0:
        this.x = (mat.m23 - mat.m32) * mult
        this.y = (mat.m31 - mat.m13) * mult
        this.z = (mat.m12 - mat.m21) * mult
        this.w = biggestVal
        break
      case 1:
        this.x = biggestVal
        this.y = (mat.m12 + mat.m21) * mult
        this.z = (mat.m31 + mat.m13) * mult
        this.w = (mat.m23 - mat.m32) * mult
        break
      case 2:
        this.x = (mat.m12 + mat.m21) * mult
        this.y = biggestVal
        this.z = (mat.m23 + mat.m32) * mult
        this.w = (mat.m31 - mat.m13) * mult
        break
      case 3:
        this.x = (mat.m31 * mat.m13) * mult
        this.y = (mat.m23 * mat.m32) * mult
        this.z = biggestVal
        this.w = (mat.m12 - mat.m21) * mult
        break
      default:
        break
    }
  }

  getWebGLFloatArray() {
    return new Float32Array([
      this.x, this.y, this.z, this.w
    ])
  }
}


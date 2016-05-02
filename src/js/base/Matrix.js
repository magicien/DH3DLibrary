'use strict'

import Vector3 from './Vector3'
// import Vector4 from './Vector4'

/**
 * matrix class
 * @access public
 */
export default class Matrix {
  /**
   * constructor
   * @access public
   * @constructor
   * @param {Matrix|array} matrix - a
   */
  constructor(matrix) {
    if(matrix instanceof Matrix){
      this.copyMatrix(matrix)
    }else if(typeof matrix === 'object') {
      if('length' in matrix && matrix.length >= 16){
        /** @type {float} */ this.m11 = matrix[ 0]
        /** @type {float} */ this.m12 = matrix[ 1]
        /** @type {float} */ this.m13 = matrix[ 2]
        /** @type {float} */ this.m14 = matrix[ 3]
        /** @type {float} */ this.m21 = matrix[ 4]
        /** @type {float} */ this.m22 = matrix[ 5]
        /** @type {float} */ this.m23 = matrix[ 6]
        /** @type {float} */ this.m24 = matrix[ 7]
        /** @type {float} */ this.m31 = matrix[ 8]
        /** @type {float} */ this.m32 = matrix[ 9]
        /** @type {float} */ this.m33 = matrix[10]
        /** @type {float} */ this.m34 = matrix[11]
        /** @type {float} */ this.m41 = matrix[12]
        /** @type {float} */ this.m42 = matrix[13]
        /** @type {float} */ this.m43 = matrix[14]
        /** @type {float} */ this.m44 = matrix[15]
      }
    }else{
      // default
      this.identity()
    }
  }

  clone() {
    return new Matrix(this)
  }

  /**
   * reset matrix
   * @access public
   * @returns {void}
   */
  identity() {
    this.m11 = 1
    this.m12 = 0
    this.m13 = 0
    this.m14 = 0
    this.m21 = 0
    this.m22 = 1
    this.m23 = 0
    this.m24 = 0
    this.m31 = 0
    this.m32 = 0
    this.m33 = 1
    this.m34 = 0
    this.m41 = 0
    this.m42 = 0
    this.m43 = 0
    this.m44 = 1
  }

  /**
   * multiply matrix (src1 x src2), set result to this matrix
   * @access public
   * @param {Matrix} src1 - 
   * @param {Matrix} src2 - 
   * @returns {void}
   */
  multiplyMatrix(src1, src2) {
    const m11 = src1.m11 * src2.m11 + src1.m12 * src2.m21 + src1.m13 * src2.m31 + src1.m14 * src2.m41
    const m12 = src1.m11 * src2.m12 + src1.m12 * src2.m22 + src1.m13 * src2.m32 + src1.m14 * src2.m42
    const m13 = src1.m11 * src2.m13 + src1.m12 * src2.m23 + src1.m13 * src2.m33 + src1.m14 * src2.m43
    const m14 = src1.m11 * src2.m14 + src1.m12 * src2.m24 + src1.m13 * src2.m34 + src1.m14 * src2.m44
    const m21 = src1.m21 * src2.m11 + src1.m22 * src2.m21 + src1.m23 * src2.m31 + src1.m24 * src2.m41
    const m22 = src1.m21 * src2.m12 + src1.m22 * src2.m22 + src1.m23 * src2.m32 + src1.m24 * src2.m42
    const m23 = src1.m21 * src2.m13 + src1.m22 * src2.m23 + src1.m23 * src2.m33 + src1.m24 * src2.m43
    const m24 = src1.m21 * src2.m14 + src1.m22 * src2.m24 + src1.m23 * src2.m34 + src1.m24 * src2.m44
    const m31 = src1.m31 * src2.m11 + src1.m32 * src2.m21 + src1.m33 * src2.m31 + src1.m34 * src2.m41
    const m32 = src1.m31 * src2.m12 + src1.m32 * src2.m22 + src1.m33 * src2.m32 + src1.m34 * src2.m42
    const m33 = src1.m31 * src2.m13 + src1.m32 * src2.m23 + src1.m33 * src2.m33 + src1.m34 * src2.m43
    const m34 = src1.m31 * src2.m14 + src1.m32 * src2.m24 + src1.m33 * src2.m34 + src1.m34 * src2.m44
    const m41 = src1.m41 * src2.m11 + src1.m42 * src2.m21 + src1.m43 * src2.m31 + src1.m44 * src2.m41
    const m42 = src1.m41 * src2.m12 + src1.m42 * src2.m22 + src1.m43 * src2.m32 + src1.m44 * src2.m42
    const m43 = src1.m41 * src2.m13 + src1.m42 * src2.m23 + src1.m43 * src2.m33 + src1.m44 * src2.m43
    const m44 = src1.m41 * src2.m14 + src1.m42 * src2.m24 + src1.m43 * src2.m34 + src1.m44 * src2.m44

    this.m11 = m11
    this.m12 = m12
    this.m13 = m13
    this.m14 = m14
    this.m21 = m21
    this.m22 = m22
    this.m23 = m23
    this.m24 = m24
    this.m31 = m31
    this.m32 = m32
    this.m33 = m33
    this.m34 = m34
    this.m41 = m41
    this.m42 = m42
    this.m43 = m43
    this.m44 = m44
  }

  /**
   * blend 2 matrices.
   * if rate is 0, result is equal to src1.
   * if rate is 1, result is equal to src2.
   * @access public
   * @param {Matrix} src1 -
   * @param {Matrix} src2 -
   * @param {float} rate -
   * @returns {void}
   */
  lerp(src1, src2, rate) {
    this.m11 = src1.m11 + rate * (src1.m11 - src2.m11)
    this.m12 = src1.m12 + rate * (src1.m12 - src2.m12)
    this.m13 = src1.m13 + rate * (src1.m13 - src2.m13)
    this.m14 = src1.m14 + rate * (src1.m14 - src2.m14)
    this.m21 = src1.m21 + rate * (src1.m21 - src2.m21)
    this.m22 = src1.m22 + rate * (src1.m22 - src2.m22)
    this.m23 = src1.m23 + rate * (src1.m23 - src2.m23)
    this.m24 = src1.m24 + rate * (src1.m24 - src2.m24)
    this.m31 = src1.m31 + rate * (src1.m31 - src2.m31)
    this.m32 = src1.m32 + rate * (src1.m32 - src2.m32)
    this.m33 = src1.m33 + rate * (src1.m33 - src2.m33)
    this.m34 = src1.m34 + rate * (src1.m34 - src2.m34)
    this.m41 = src1.m41 + rate * (src1.m41 - src2.m41)
    this.m42 = src1.m42 + rate * (src1.m42 - src2.m42)
    this.m43 = src1.m43 + rate * (src1.m43 - src2.m43)
    this.m44 = src1.m44 + rate * (src1.m44 - src2.m44)
  }

  /**
   * set rotation matrix from quaternion
   * @access public
   * @param {Vector4} quat - Quaternion
   * @returns {void}
   */
  matrixFromQuaternion(quat) {
    const x2 = quat.x * quat.x * 2.0
    const y2 = quat.y * quat.y * 2.0
    const z2 = quat.z * quat.z * 2.0
    const xy = quat.x * quat.y * 2.0
    const yz = quat.y * quat.z * 2.0
    const zx = quat.z * quat.x * 2.0
    const xw = quat.x * quat.w * 2.0
    const yw = quat.y * quat.w * 2.0
    const zw = quat.z * quat.w * 2.0

    this.m11 = 1.0 - y2 - z2
    this.m12 = xy + zw
    this.m13 = zx - yw
    this.m14 = 0.0
    this.m21 = xy - zw
    this.m22 = 1.0 - z2 - x2
    this.m23 = yz + xw
    this.m24 = 0.0
    this.m31 = zx + yw
    this.m32 = yz - xw
    this.m33 = 1.0 - x2 - y2
    this.m34 = 0.0
    this.m41 = 0.0
    this.m42 = 0.0
    this.m43 = 0.0
    this.m44 = 1.0
  }

  /**
   * copy matrix
   * @access public
   * @param {Matrix} src -
   * @returns {void}
   */
  copyMatrix(src) {
    this.m11 = src.m11
    this.m12 = src.m12
    this.m13 = src.m13
    this.m14 = src.m14
    this.m21 = src.m21
    this.m22 = src.m22
    this.m23 = src.m23
    this.m24 = src.m24
    this.m31 = src.m31
    this.m32 = src.m32
    this.m33 = src.m33
    this.m34 = src.m34
    this.m41 = src.m41
    this.m42 = src.m42
    this.m43 = src.m43
    this.m44 = src.m44
  }

  /**
   * inverse matrix
   * @access public
   * @param {Matrix} src - 
   * @returns {void}
   */
  inverseMatrix(src) {
    const temp = new Matrix(src)
    let buf = 0
    let w1 = Math.abs(temp.m11)
    let w2 = Math.abs(temp.m21)
    let w3 = Math.abs(temp.m31)
    let w4 = Math.abs(temp.m41)
    let max = w1 > w2 ? w1 : w2
    if(max < w3) max = w3

    this.identity()
    // 1
    if(max < w4){
      buf = 1.0 / temp.m41
      w1 = temp.m11
      w2 = temp.m12
      w3 = temp.m13
      w4 = temp.m14
      temp.m12 = temp.m42 * buf
      temp.m13 = temp.m43 * buf
      temp.m14 = temp.m44 * buf
      temp.m41 = w1
      temp.m42 = w2
      temp.m43 = w3
      temp.m44 = w4
      this.m11 = 0.0
      this.m14 = buf
      this.m41 = 1.0
      this.m44 = 0.0
    }else if(max === w1){
      buf = 1.0 / temp.m11
      temp.m12 *= buf
      temp.m13 *= buf
      temp.m14 *= buf
      this.m11 = buf
    }else if(max === w2){
      buf = 1.0 / temp.m21
      w1 = temp.m11
      w2 = temp.m12
      w3 = temp.m13
      w4 = temp.m14
      temp.m12 = temp.m22 * buf
      temp.m13 = temp.m23 * buf
      temp.m14 = temp.m24 * buf
      temp.m21 = w1
      temp.m22 = w2
      temp.m23 = w3
      temp.m24 = w4
      this.m11 = 0.0
      this.m12 = buf
      this.m21 = 1.0
      this.m22 = 0.0
    }else{
      buf = 1.0 / temp.m31
      w1 = temp.m11
      w2 = temp.m12
      w3 = temp.m13
      w4 = temp.m14
      temp.m12 = temp.m32 * buf
      temp.m13 = temp.m33 * buf
      temp.m14 = temp.m34 * buf
      temp.m31 = w1
      temp.m32 = w2
      temp.m33 = w3
      temp.m34 = w4
      this.m11 = 0.0
      this.m13 = buf
      this.m31 = 1.0
      this.m33 = 0.0
    }

    buf = temp.m21
    temp.m22 -= temp.m12 * buf
    temp.m23 -= temp.m13 * buf
    temp.m24 -= temp.m14 * buf
    this.m21 -= this.m11 * buf
    this.m22 -= this.m12 * buf
    this.m23 -= this.m13 * buf
    this.m24 -= this.m14 * buf

    buf = temp.m31
    temp.m32 -= temp.m12 * buf
    temp.m33 -= temp.m13 * buf
    temp.m34 -= temp.m14 * buf
    this.m31 -= this.m11 * buf
    this.m32 -= this.m12 * buf
    this.m33 -= this.m13 * buf
    this.m34 -= this.m14 * buf

    buf = temp.m41
    temp.m42 -= temp.m12 * buf
    temp.m43 -= temp.m13 * buf
    temp.m44 -= temp.m14 * buf
    this.m41 -= this.m11 * buf
    this.m42 -= this.m12 * buf
    this.m43 -= this.m13 * buf
    this.m44 -= this.m14 * buf

    // 2
    w2 = Math.abs(temp.m22)
    w3 = Math.abs(temp.m32)
    w4 = Math.abs(temp.m42)
    max = w2 > w3 ? w2 : w3
    if(max < w4){
      buf = 1.0 / temp.m42
      w2 = temp.m22
      w3 = temp.m23
      w4 = temp.m24
      temp.m23 = temp.m43 * buf
      temp.m24 = temp.m44 * buf
      temp.m42 = w2
      temp.m43 = w3
      temp.m44 = w4
      w1 = this.m21
      w2 = this.m22
      w3 = this.m23
      w4 = this.m24
      this.m21 = this.m41 * buf
      this.m22 = this.m42 * buf
      this.m23 = this.m43 * buf
      this.m24 = this.m44 * buf
      this.m41 = w1
      this.m42 = w2
      this.m43 = w3
      this.m44 = w4
    }else if(w2 > w3){
      buf = 1.0 / temp.m22
      temp.m23 *= buf
      temp.m24 *= buf
      this.m21 *= buf
      this.m22 *= buf
      this.m23 *= buf
      this.m24 *= buf
    }else{
      buf = 1.0 / temp.m32
      w2 = temp.m22
      w3 = temp.m23
      w4 = temp.m24
      temp.m23 = temp.m33 * buf
      temp.m24 = temp.m34 * buf
      temp.m32 = w2
      temp.m33 = w3
      temp.m34 = w4
      w1 = this.m21
      w2 = this.m22
      w3 = this.m23
      w4 = this.m24
      this.m21 = this.m31 * buf
      this.m22 = this.m32 * buf
      this.m23 = this.m33 * buf
      this.m24 = this.m34 * buf
      this.m31 = w1
      this.m32 = w2
      this.m33 = w3
      this.m34 = w4
    }

    buf = temp.m12
    temp.m13 -= temp.m23 * buf
    temp.m14 -= temp.m24 * buf
    this.m11 -= this.m21 * buf
    this.m12 -= this.m22 * buf
    this.m13 -= this.m23 * buf
    this.m14 -= this.m24 * buf

    buf = temp.m32
    temp.m33 -= temp.m23 * buf
    temp.m34 -= temp.m24 * buf
    this.m31 -= this.m21 * buf
    this.m32 -= this.m22 * buf
    this.m33 -= this.m23 * buf
    this.m34 -= this.m24 * buf

    buf = temp.m42
    temp.m43 -= temp.m23 * buf
    temp.m44 -= temp.m24 * buf
    this.m41 -= this.m21 * buf
    this.m42 -= this.m22 * buf
    this.m43 -= this.m23 * buf
    this.m44 -= this.m24 * buf

    // 3
    if(Math.abs(temp.m33) > Math.abs(temp.m43)){
      buf = 1.0 / temp.m33
      temp.m34 *= buf
      this.m31 *= buf
      this.m32 *= buf
      this.m33 *= buf
      this.m34 *= buf
    }else{
      buf = 1.0 / temp.m43
      w3 = temp.m33
      w4 = temp.m34
      temp.m34 = temp.m44 * buf
      temp.m43 = w3
      temp.m44 = w4
      w1 = this.m31
      w2 = this.m32
      w3 = this.m33
      w4 = this.m34
      this.m31 = this.m41 * buf
      this.m32 = this.m42 * buf
      this.m33 = this.m43 * buf
      this.m34 = this.m44 * buf
      this.m41 = w1
      this.m42 = w2
      this.m43 = w3
      this.m44 = w4
    }
    buf = temp.m13
    temp.m14 -= temp.m34 * buf
    this.m11 -= this.m31 * buf
    this.m12 -= this.m32 * buf
    this.m13 -= this.m33 * buf
    this.m14 -= this.m34 * buf

    buf = temp.m23
    temp.m24 -= temp.m34 * buf
    this.m21 -= this.m31 * buf
    this.m22 -= this.m32 * buf
    this.m23 -= this.m33 * buf
    this.m24 -= this.m34 * buf

    buf = temp.m43
    temp.m44 -= temp.m34 * buf
    this.m41 -= this.m31 * buf
    this.m42 -= this.m32 * buf
    this.m43 -= this.m33 * buf
    this.m44 -= this.m34 * buf

    // 4
    buf = 1.0 / temp.m44
    this.m41 *= buf
    this.m42 *= buf
    this.m43 *= buf
    this.m44 *= buf

    buf = temp.m14
    this.m11 -= this.m41 * buf
    this.m12 -= this.m42 * buf
    this.m13 -= this.m43 * buf
    this.m14 -= this.m44 * buf

    buf = temp.m24
    this.m21 -= this.m41 * buf
    this.m22 -= this.m42 * buf
    this.m23 -= this.m43 * buf
    this.m24 -= this.m44 * buf

    buf = temp.m34
    this.m31 -= this.m41 * buf
    this.m32 -= this.m42 * buf
    this.m33 -= this.m43 * buf
    this.m34 -= this.m44 * buf
  }

  /**
   * transpose matrix
   * @access public
   * @param {Matrix} src -
   * @returns {void}
   */
  transposeMatrix(src) {
    this.m11 = src.m11
    this.m12 = src.m21
    this.m13 = src.m31
    this.m14 = src.m41
    this.m21 = src.m12
    this.m22 = src.m22
    this.m23 = src.m32
    this.m24 = src.m42
    this.m31 = src.m13
    this.m32 = src.m23
    this.m33 = src.m33
    this.m34 = src.m43
    this.m41 = src.m14
    this.m42 = src.m24
    this.m43 = src.m34
    this.m44 = src.m44
  }

  /**
   * scale matrix
   * @access public
   * @param {Matrix} mat -
   * @param {float} x -
   * @param {float} y -
   * @param {float} z -
   * @returns {void}
   */
  scale(mat, x, y, z) {
    const r = new Matrix()
    r.identity()

    if(!(mat instanceof Object) && z === null){
      r.m11 = mat
      r.m22 = x
      r.m33 = y

      this.multiplyMatrix(this, r)
    }else{
      r.m11 = x
      r.m22 = y
      r.m33 = z

      this.multiplyMatrix(mat, r)
    }
  }

  /**
   * translate matrix
   * @access public
   * @param {Matrix} mat -
   * @param {float} x -
   * @param {float} y -
   * @param {float} z -
   * @returns {void}
   */
  translate(mat, x, y, z) {
    const r = new Matrix()
    r.identity()
    r.m14 = x
    r.m24 = y
    r.m34 = z

    this.multiplyMatrix(mat, r)
  }

  /**
   * rotate matrix
   * @access public
   * @param {Matrix} mat - 
   * @param {float} angle -
   * @param {float} x -
   * @param {float} y -
   * @param {float} z - 
   * @returns {void}
   */
  rotate(mat, angle, x, y, z) {
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    const v = new Vector3(x, y, z)
    const r = new Matrix()

    v.normalize()
    const nx = v.x
    const ny = v.y
    const nz = v.z

    r.m11 = nx * nx * (1.0-c) + c
    r.m12 = nx * ny * (1.0-c) - nz * s
    r.m13 = nx * nz * (1.0-c) + ny * s
    r.m14 = 0.0
    r.m21 = ny * nx * (1.0-c) + nz * s
    r.m22 = ny * ny * (1.0-c) + c
    r.m23 = ny * nz * (1.0-c) - nx * s
    r.m24 = 0.0
    r.m31 = nz * nx * (1.0-c) - ny * s
    r.m32 = nz * ny * (1.0-c) + nx * s
    r.m33 = nz * nz * (1.0-c) + c
    r.m34 = 0.0
    r.m41 = 0.0
    r.m42 = 0.0
    r.m43 = 0.0
    r.m44 = 1.0

    this.multiplyMatrix(mat, r)
  }

  /**
   * get Float32Array format value of matrix for WebGL
   * @access public
   * @returns {Float32Array} matrix value
   */
  getWebGLFloatArray() {
    return new Float32Array([
      this.m11, this.m12, this.m13, this.m14,
      this.m21, this.m22, this.m23, this.m24,
      this.m31, this.m32, this.m33, this.m34,
      this.m41, this.m42, this.m43, this.m44
    ])
  }

  /**
   * get Float32Array format value of transposed matrix for WebGL
   * @access public
   * @returns {Float32Array} transposed matrix value
   */
  getWebGLFloatArrayTransposed() {
    return new Float32Array([
      this.m11, this.m21, this.m31, this.m41,
      this.m12, this.m22, this.m32, this.m42,
      this.m13, this.m23, this.m33, this.m43,
      this.m14, this.m24, this.m34, this.m44
    ])
  }

  /**
   * get array format value of matrix for WebGL
   * @access public
   * @returns {array} matrix value
   */
  getArray() {
    return [
      this.m11, this.m12, this.m13, this.m14,
      this.m21, this.m22, this.m23, this.m24,
      this.m31, this.m32, this.m33, this.m34,
      this.m41, this.m42, this.m43, this.m44
    ]
  }

  /**
   * show matrix value to console for debug
   * @access public
   * @returns {void}
   */
  showMatrix() {
    /*
    console.log('matrix:<br />\n'
       + this.m11 + ' ' + this.m12 + ' ' + this.m13 + ' ' + this.m14 + '<br />\n'
       + this.m21 + ' ' + this.m22 + ' ' + this.m23 + ' ' + this.m24 + '<br />\n'
       + this.m31 + ' ' + this.m32 + ' ' + this.m33 + ' ' + this.m34 + '<br />\n'
       + this.m41 + ' ' + this.m42 + ' ' + this.m43 + ' ' + this.m44 + '<br />\n'
    )
    */
  }
}


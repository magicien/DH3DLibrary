'use strict'

/**
 * 3 params vector class
 * @access public
 */
export default class Vector3 {
  /**
   * constructor
   * @access public
   * @constructor
   * @param {float} x - X value, default is 0.0
   * @param {float} y - Y value, default is 0.0
   * @param {float} z - Z value, default is 0.0
   */
  constructor(x = 0.0, y = 0.0, z = 0.0) {
    this.setValue(x, y, z)
  }

  clone() {
    return new Vector3(this.x, this.y, this.z)
  }

  /**
   * set vector value
   * @access public
   * @param {float|Vector3} x - x value, or Vector3 object to copy.
   *        if first param is Vector3, second/third params are ignored.
   * @param {float} y - y value, default is 0.0
   * @param {float} z - z value, default is 0.0
   * @returns {void}
   * @example
   * var v1 = new Vector3(1.0, 2.0, 3.0)
   * var v2 = new Vector3()
   * var v2.setValue(v1)
   * // v2 is {x:1.0, y:2.0, z:3.0}
   */
  setValue(x, y = 0.0, z = 0.0) {
    if((x instanceof Vector3) || (x instanceof Object && x.z !== null)){
      this.x = x.x
      this.y = x.y
      this.z = x.z
    }else{
      this.x = x
      this.y = y
      this.z = z
    }
  }

  /**
   * add 2 vectors. result is set to this matrix.
   * @access public
   * @param {Vector3} vec1 -
   * @param {Vector3} vec2 -
   * @returns {void}
   */
  add(vec1, vec2) {
    this.x = vec1.x + vec2.x
    this.y = vec1.y + vec2.y
    this.z = vec1.z + vec2.z
  }

  /**
   *
   * @access public
   * @param {Vector3} vec1 -
   * @param {Vector3} vec2 -
   * @returns {void}
   */
  sub(vec1, vec2) {
    this.x = vec1.x - vec2.x
    this.y = vec1.y - vec2.y
    this.z = vec1.z - vec2.z
  }
  
  /**
   *
   * @access public
   * @param {Vector3} vec1 -
   * @param {float} rate -
   * @returns {void}
   */
  mul(vec1, rate) {
    this.x = vec1.x * rate
    this.y = vec1.y * rate
    this.z = vec1.z * rate
  }

  /**
   *
   * @access public
   * @param {Vector3} vec1 -
   * @param {Vector3} vec2 -
   * @param {float} rate -
   * @returns {void}
   */
  mulAdd(vec1, vec2, rate) {
    this.x = vec1.x + vec2.x * rate
    this.y = vec1.y + vec2.y * rate
    this.z = vec1.z + vec2.z * rate
  }

  /**
   *
   * @access public
   * @param {Vector3} src - optional
   * @returns {void}
   */
  normalize(src = this) {
    const square = 1.0 / Math.sqrt(src.x * src.x + src.y * src.y + src.z * src.z)

    this.x = src.x * square
    this.y = src.y * square
    this.z = src.z * square
  }

  /**
   *
   * @access public
   * @param {Vector3} vec -
   * @returns {float} result of dot
   */
  dot(vec) {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z
  }

  /**
   *
   * @access public
   * @param {Vector3} vec1 -
   * @param {Vector3} vec2 -
   * @returns {void} 
   */
  cross(vec1, vec2) {
    const rx = vec1.y * vec2.z - vec1.z * vec2.y
    const ry = vec1.z * vec2.x - vec1.x * vec2.z
    const rz = vec1.x * vec2.y - vec1.y * vec2.x
    this.x = rx
    this.y = ry
    this.z = rz
  }

  /**
   *
   * @access public
   * @param {Vector3} vec1 -
   * @param {Vector3} vec2 -
   * @param {float} rate -
   * @returns {void} 
   */
  lerp(vec1, vec2, rate) {
    this.x = vec1.x + rate * (vec2.x - vec1.x)
    this.y = vec1.y + rate * (vec2.y - vec1.y)
    this.z = vec1.z + rate * (vec2.z - vec1.z)
  }

  /**
   * multiply inverse matrix to this vector
   * @access public
   * @param {Vector3} vec - Vector3 object to cross
   * @param {Matrix} mat - Matrix object to cross
   * @param {boolean} includeTranslate - if it's true, it includes translation factors (m14, m24, m34)
   * @returns {void}
   */
  inverseCross(vec, mat, includeTranslate = false) {
    let x = vec.x * mat.m11 + vec.y * mat.m12 + vec.z * mat.m13
    let y = vec.x * mat.m21 + vec.y * mat.m22 + vec.z * mat.m23
    let z = vec.x * mat.m31 + vec.y * mat.m32 + vec.z * mat.m33

    if(includeTranslate){
      x += mat.m14
      y += mat.m24
      z += mat.m34
    }

    this.x = x
    this.y = y
    this.z = z
  }

  /**
   *
   * @access public
   * @param {Vector3} vec -
   * @param {Matrix} matrix -
   * @returns {void} 
   */
  transform(vec, matrix) {
    const rx = vec.x * matrix.m11 + vec.y * matrix.m21 + vec.z * matrix.m31 + matrix.m41
    const ry = vec.x * matrix.m12 + vec.y * matrix.m22 + vec.z * matrix.m32 + matrix.m42
    const rz = vec.x * matrix.m13 + vec.y * matrix.m23 + vec.z * matrix.m33 + matrix.m43

    this.x = rx
    this.y = ry
    this.z = rz
  }

  /**
   *
   * @access public
   * @param {Vector3} vec -
   * @param {Matrix} matrix -
   * @returns {void} 
   */
  rotate(vec, matrix){
    const rx = vec.x * matrix.m11 + vec.y * matrix.m21 + vec.z * matrix.m31
    const ry = vec.x * matrix.m12 + vec.y * matrix.m22 + vec.z * matrix.m32
    const rz = vec.x * matrix.m13 + vec.y * matrix.m23 + vec.z * matrix.m33

    this.x = rx
    this.y = ry
    this.z = rz
  }

  /**
   *
   * @access public
   * @param {Vector4} quat -
   * @returns {void} 
   */
  quaternionToEuler(quat) {
    const x2 = quat.x + quat.x
    const y2 = quat.y + quat.y
    const z2 = quat.z + quat.z
    const xz2 = quat.x * z2
    const wy2 = quat.w * y2
    let temp = -(xz2 - wy2)

    if(temp >= 1.0){
      temp = 1.0
    }else if(temp <= -1.0){
      temp = -1.0
    }

    const yRadian = Math.sin(temp)
    const xx2 = quat.x * x2
    const xy2 = quat.x * y2
    const zz2 = quat.z * z2
    const wz2 = quat.w * z2

    if(yRadian < Math.PI * 0.5){
      if(yRadian > -Math.PI * 0.5){
        const yz2 = quat.y * z2
        const wx2 = quat.w * x2
        const yy2 = quat.y * y2
        this.x = Math.atan2(yz2 + wx2, 1.0 - (xx2 + yy2))
        this.y = yRadian
        this.z = Math.atan2(xy2 + wz2, 1.0 - (xx2 + zz2))
      }else{
        this.x = -Math.atan2(xy2 - wz2, 1.0 - (xx2 + zz2))
        this.y = yRadian
        this.z = 0
      }
    }else{
      this.x = Math.atan2(xy2 - wz2, 1.0 - (xx2 + zz2))
      this.y = yRadian
      this.z = 0
    }
  }

  /**
   * calc a length of vector
   * @access public
   * @returns {float} length of vector
   */
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  /**
   * get Float32Array format of vector value
   * @access public
   * @returns {Float32Array} vector value
   */
  getWebGLFloatArray() {
    return new Float32Array([
      this.x, this.y, this.z
    ])
  }
}


'use strict'

import CameraMotion from './CameraMotion'
import CameraMotionBank from './CameraMotionBank'
import Matrix from './Matrix'
import Vector3 from './Vector3'

/**
 * Camera class
 * @access public
 */
export default class Camera {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    /** @type {Vector3} */
    this.position = new Vector3()

    /** @type {Matrix} */
    this.projMat = new Matrix()

    /** @type {Matrix} */
    this.viewMat = new Matrix()


    /** @type {DH3DObject} */
    this.bindObj = null

    /** @type {float} */
    this.distance = 20.0

    /** @type {float} */
    this.bindXAngle = 0.0

    /** @type {float} */
    this.bindYAngle = 0.0

    /** @type {Vector3} */
    this.bindOffset = new Vector3()

    /** @type {float} */
    this._aspect = 1.0
    /** @type {string} */
    this._mode = ''

    /** @type {Motion} */
    this._motion = null

    /** @type {Animator} */
    this._animator = null

    /** @type {boolean} */
    this._animating = false

    /** @type {float} */
    this._animationTime = 0

    /** @type {float} */
    this._animationFrame = 0
    // this._motionBlendStep = 0
    // this._motionBlendCount = 0

    /** @type {Matrix} */
    this._projViewMat = new Matrix()

    this.identity()
  }

  /**
   * reset camera position and matrix
   * @access public
   * @returns {void}
   */
  identity() {
    this.position.setValue(0, 0, 0)
    this.projMat.identity()
    this.viewMat.identity()
  }

  /**
   * set motion to object
   * @access public
   * @param {Motion} motion -
   * @returns {void}
   */
  setMotion(motion) {
    if(this._motion){
      this._motion.destroy()
    }

    if(motion === null){
      return false
    }

    if(motion instanceof CameraMotion){
      this._motion = motion
      return true
    }

    return CameraMotionBank.getMotion(motion).then((m) => this.setMotion(m))
  }

  /**
   * get motion of object
   * @access public
   * @returns {Motion} - motion
   */
  getMotion() {
    return this._motion
  }

  /**
   * set animation
   * @access public
   * @param {bool} animating - 
   * @returns {void}
   */
  setAnimating(animating = true) {
    if(animating){
      this._animating = true
    }else{
      this._animating = false
    }
  }

  /**
   * get animation state
   * @access public
   * @returns {bool} - true if it's animating
   */
  getAnimating() {
    return this._animating
  }

  /**
   * set animation loop
   * @access public
   * @param {bool} loop - 
   * @returns {void}
   */
  setLoop(loop = true) {
    if(loop) {
      this._loop = true
    }else{
      this._loop = false
    }
  }

  /**
   * get loop state
   * @access public
   * @returns {bool} - true if loop is enabled
   */
  getLoop() {
    return this._loop
  }

  /**
   * set animator to object
   * @access public
   * @param {Animator} animator -
   * @returns {void}
   */
  setAnimator(animator) {
    this._animator = animator
  }

  /**
   * set animation time (sec)
   * @access public
   * @param {float} time - animation time
   * @returns {void}
   */
  setAnimationTime(time) {
    this._animationTime = time
  }

  /**
   * get animation time (sec)
   * @access public
   * @returns {float} - animation time
   */
  getAnimationTime() {
    return this._animationTime
  }


  /**
   * set camera position
   * @access public
   * @param {float} x - x position of camera
   * @param {float} y - y position of camera
   * @param {float} z - z position of camera
   * @returns {void}
   */
  setPosition(x, y, z) {
    this.translate(x - this.position.x, y - this.position.y, z - this.position.z)
  }

  /**
   * move camera position
   * @access public
   * @param {float} x - x value of camera transition
   * @param {float} y - y value of camera transition
   * @param {float} z - z value of camera transition
   * @returns {void}
   */
  translate(x, y, z) {
    this.viewMat.translate(this.viewMat, -x, -y, -z)
    this.position.x += x
    this.position.y += y
    this.position.z += z
  }

  /**
   * rotate camera
   * @access public
   * @param {float} angle - rotation angle in radian
   * @param {float} x - x value of axis of rotation
   * @param {float} y - y value of axis of rotation
   * @param {float} z - z value of axis of rotation
   * @returns {void}
   */
  rotate(angle, x, y, z) {
    this.viewMat.rotate(this.viewMat, angle, x, y, z)
  }

  /**
   * scale view matrix: zoom up/down 
   * @access public
   * @param {float} x - x value of scale
   * @param {float} y - y value of scale
   * @param {float} z - z value of scale
   * @returns {void}
   */
  scale(x, y, z) {
    this.viewMat.scale(this.viewMat, x, y, z)
  }

  /**
   * scale projection matrix 
   * @access public
   * @param {float} x - x value of scale
   * @param {float} y - y value of scale
   * @param {float} z - z value of scale
   * @returns {void}
   */
  scaleProjection(x, y, z) {
    this.projMat.scale(this.projMat, x, y, z)
  }

  /**
   * change camera matrix to look at the given point
   * @access public
   * @param {float} eyeX - 
   * @param {float} eyeY -
   * @param {float} eyeZ -
   * @param {float} centerX -
   * @param {float} centerY -
   * @param {float} centerZ -
   * @param {float} upX -
   * @param {float} upY -
   * @param {float} upZ -
   * @returns {void}
   */
  lookat(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
    const s = new Vector3()
    const u = new Vector3()
    const f = new Vector3()
    const up = new Vector3()
    const mat = new Matrix()

    f.x = centerX - eyeX
    f.y = centerY - eyeY
    f.z = centerZ - eyeZ
    f.normalize()

    up.x = upX
    up.y = upY
    up.z = upZ
    //up.normalize()

    s.cross(f, up)
    u.cross(s, f)

    s.normalize()
    u.normalize()

    mat.m11 = s.x
    mat.m12 = s.y
    mat.m13 = s.z
    mat.m14 = 0
    mat.m21 = u.x
    mat.m22 = u.y
    mat.m23 = u.z
    mat.m24 = 0
    mat.m31 = -f.x
    mat.m32 = -f.y
    mat.m33 = -f.z
    mat.m34 = 0
    mat.m41 = 0
    mat.m42 = 0
    mat.m43 = 0
    mat.m44 = 1

    this.viewMat = mat
    this.viewMat.translate(this.viewMat, -eyeX, -eyeY, -eyeZ)
    this.position.setValue(eyeX, eyeY, eyeZ)
  }

  /**
   *
   * @access public
   * @param {float} left -
   * @param {float} right -
   * @param {float} bottom -
   * @param {float} top -
   * @param {float} nearVal -
   * @param {float} farVal -
   * @returns {void}
   */
  frustum(left, right, bottom, top, nearVal, farVal) {
    const mat = new Matrix()

    mat.m11 = 2 * nearVal / (right - left)
    mat.m12 = 0
    mat.m13 = (right + left) / (right - left)
    mat.m14 = 0
    mat.m21 = 0
    mat.m22 = 2 * nearVal / (top - bottom)
    mat.m23 = (top + bottom) / (top - bottom)
    mat.m24 = 0
    mat.m31 = 0
    mat.m32 = 0
    mat.m33 = -(farVal + nearVal) / (farVal - nearVal)
    mat.m34 = -2 * farVal * nearVal / (farVal - nearVal)
    mat.m41 = 0
    mat.m42 = 0
    mat.m43 = -1
    mat.m44 = 0

    this.projMat = mat
    this._mode = 'frustum'
  }

  /**
   *
   * @access public
   * @param {float} fovy -
   * @param {float} aspect -
   * @param {float} nearVal -
   * @param {float} farVal -
   * @returns {void}
   */
  perspective(fovy, aspect, nearVal, farVal) {
    const mat = new Matrix()
    const cot = 1.0 / Math.tan(fovy * Math.PI / 360.0)
    this._aspect = aspect

    mat.m11 = cot / aspect
    mat.m12 = 0
    mat.m13 = 0
    mat.m14 = 0
    mat.m21 = 0
    mat.m22 = cot
    mat.m23 = 0
    mat.m24 = 0
    mat.m31 = 0
    mat.m32 = 0
    mat.m33 = -(farVal + nearVal) / (farVal - nearVal)
    mat.m34 = -2 * farVal * nearVal / (farVal - nearVal)
    mat.m41 = 0
    mat.m42 = 0
    mat.m43 = -1
    mat.m44 = 0

    this.projMat = mat
    this._mode = 'perspective'
  }

  /**
   *
   * @access public
   * @param {float} left -
   * @param {float} right -
   * @param {float} bottom -
   * @param {float} top -
   * @param {float} nearVal -
   * @param {float} farVal -
   * @returns {void}
   */
  ortho(left, right, bottom, top, nearVal, farVal) {
    const mat = new Matrix()
    this._aspect = Math.abs((bottom - top) / (right - left))

    mat.m11 = 2 / (right - left)
    mat.m12 = 0
    mat.m13 = 0
    mat.m14 = -(right + left) / (right - left)
    mat.m21 = 0
    mat.m22 = 2 / (top - bottom)
    mat.m23 = 0
    mat.m24 = -(top + bottom) / (top - bottom)
    mat.m31 = 0
    mat.m32 = 0
    mat.m33 = -2 / (farVal - nearVal)
    mat.m34 = -(farVal + nearVal) / (farVal - nearVal)
    mat.m41 = 0
    mat.m42 = 0
    mat.m43 = 0
    mat.m44 = 1

    this.projMat = mat
    this._mode = 'ortho'
  }

  /**
   * get projection array for WebGL
   * @access public
   * @returns {Float32Array} projection matrix value
   */
  getProjectionArray() {
    return this.projMat.getWebGLFloatArray()
  }

  /**
   * get view array for WebGL
   * @access public
   * @returns {Float32Array} view matrix value
   */
  getViewArray() {
    return this.viewMat.getWebGLFloatArray()
  }

  /**
   * get projection matrix
   * @access public
   * @returns {Float32Array} projection view matrix
   */
  getProjectionViewMatrix() {
    this._projViewMat.multiplyMatrix(this.projMat, this.viewMat)

    return this._projViewMat.getWebGLFloatArrayTransposed()
  }

  /**
   * get normal matrix
   * @access public
   * @returns {Float32Array} normal matrix
   */
  getNormalMatrix() {
    // モデルビュー行列の左上3x3の逆転置行列
    const m = this.viewMat
    let buf = 0
    const m11 = m.m11; let m12 = m.m12; let m13 = m.m13
    let m21 = m.m21;   let m22 = m.m22; let m23 = m.m23
    let m31 = m.m31;   let m32 = m.m32; let m33 = m.m33
    let r11 = 1.0;     let r12 = 0.0;   let r13 = 0.0
    let r21 = 0.0;     let r22 = 1.0;   let r23 = 0.0
    let r31 = 0.0;     let r32 = 0.0;   let r33 = 1.0

    let w1 = Math.abs(m11)
    let w2 = Math.abs(m21)
    let w3 = Math.abs(m31)
    const max = w1 > w2 ? w1 : w2

    if(max < w3){
      buf = 1.0 / m31
      // m
      w1 = m11
      w2 = m12
      w3 = m13
      // m11 = 1.0
      m12 = m32 * buf
      m13 = m33 * buf
      m31 = w1
      m32 = w2
      m33 = w3
      // r
      r11 = 0.0
      r13 = buf
      r31 = 1.0
      r33 = 0.0
    }else if(w1 < w2){
      buf = 1.0 / m21
      // m
      w1 = m11
      w2 = m12
      w3 = m13
      // m11 = 1.0
      m12 = m22 * buf
      m13 = m23 * buf
      m21 = w1
      m22 = w2
      m23 = w3
      // r
      r11 = 0.0
      r12 = buf
      r21 = 1.0
      r22 = 0.0
    }else{
      buf = 1.0 / m11
      m12 *= buf
      m13 *= buf
      r11 = buf
    }
    m22 -= m12 * m21
    m23 -= m13 * m21
    r21 -= r11 * m21
    r22 -= r12 * m21
    r23 -= r13 * m21

    m32 -= m12 * m31
    m33 -= m13 * m31
    r31 -= r11 * m31
    r32 -= r12 * m31
    r33 -= r13 * m31

    if(Math.abs(m22) > Math.abs(m32)){
      buf = 1.0 / m22
      // m
      // m22 = 1.0
      m23 *= buf
      r21 *= buf
      r22 *= buf
      r23 *= buf
    }else{
      buf = 1.0 / m32
      w2 = m22
      w3 = m23
      // m22 = 1.0
      m23 = m33 * buf
      m32 = w2
      m33 = w3
      w1 = r21
      w2 = r22
      w3 = r23
      r21 = r31 * buf
      r22 = r32 * buf
      r23 = r33 * buf
      r31 = w1
      r32 = w2
      r33 = w3
    }
    m13 -= m23 * m12
    r11 -= r21 * m12
    r12 -= r22 * m12
    r13 -= r23 * m12

    m33 -= m23 * m32
    r31 -= r21 * m32
    r32 -= r22 * m32
    r33 -= r23 * m32


    buf = 1.0 / m33
    r31 *= buf
    r32 *= buf
    r33 *= buf

    r11 -= r31 * m13
    r12 -= r32 * m13
    r13 -= r33 * m13

    r21 -= r31 * m23
    r22 -= r32 * m23
    r23 -= r33 * m23

    return new Float32Array([
      r11, r21, r31,
      r12, r22, r32,
      r13, r23, r33
    ])
  }

  /**
   * get position array for WebGL
   * @access public
   * @returns {Float32Array} position value
   */
  getPosition() {
    return this.position.getWebGLFloatArray()
  }

  /**
   * get screen position from world position
   * @access public
   * @param {Vector3} pos - world position
   * @returns {Vector3} screen position 
   */
  getScreenPosition(pos) {
    const sPos = new Vector3()

    this._projViewMat.multiplyMatrix(this.projMat, this.viewMat)
    const m = this._projViewMat

    sPos.x = m.m11 * pos.x
           + m.m12 * pos.y
           + m.m13 * pos.z
           + m.m14
    sPos.y = m.m21 * pos.x
           + m.m22 * pos.y
           + m.m23 * pos.z
           + m.m24
    sPos.z = m.m31 * pos.x
           + m.m32 * pos.y
           + m.m33 * pos.z
           + m.m34
    const w = 1.0 / (
             m.m41 * pos.x
           + m.m42 * pos.y
           + m.m43 * pos.z
           + m.m44)
    sPos.x *= w
    sPos.y *= w
    sPos.z *= w

    return sPos
  }

  /**
   * show camera matrix for debug
   * @access public
   * @returns {void}
   */
  showCameraMatrix() {
    /*
    console.log('cameraMatrix:\n'
            + 'projectionMatrix:\n'
            + this.projMat.m11 + ' ' + this.projMat.m12 + ' ' + this.projMat.m13 + ' ' + this.projMat.m14 + '\n'
            + this.projMat.m21 + ' ' + this.projMat.m22 + ' ' + this.projMat.m23 + ' ' + this.projMat.m24 + '\n'
            + this.projMat.m31 + ' ' + this.projMat.m32 + ' ' + this.projMat.m33 + ' ' + this.projMat.m34 + '\n'
            + this.projMat.m41 + ' ' + this.projMat.m42 + ' ' + this.projMat.m43 + ' ' + this.projMat.m44 + '\n'
            + 'viewMatrix:\n'
            + this.viewMat.m11 + ' ' + this.viewMat.m12 + ' ' + this.viewMat.m13 + ' ' + this.viewMat.m14 + '\n'
            + this.viewMat.m21 + ' ' + this.viewMat.m22 + ' ' + this.viewMat.m23 + ' ' + this.viewMat.m24 + '\n'
            + this.viewMat.m31 + ' ' + this.viewMat.m32 + ' ' + this.viewMat.m33 + ' ' + this.viewMat.m34 + '\n'
            + this.viewMat.m41 + ' ' + this.viewMat.m42 + ' ' + this.viewMat.m43 + ' ' + this.viewMat.m44 + '\n')
    */
  }

  /**
   * change coordination
   * @access public
   * @returns {void}
   */
  changeCoordination() {
    const vm = this.viewMat
    vm.m13 = -vm.m13
    vm.m23 = -vm.m23
    vm.m33 = -vm.m33
    vm.m43 = -vm.m43
  }

  /**
   * bind camera to object
   * @access public
   * @param {DH3DObject} dhObject -
   * @returns {void}
   */
  bind(dhObject) {
    this.bindObj = dhObject
  }

  /**
   * set offset between camera and binded object
   * @access public
   * @param {float} x -
   * @param {float} y -
   * @param {float} z -
   * @returns {void}
   */
  setBindOffset(x, y, z) {
    this.bindOffset.x = x
    this.bindOffset.y = y
    this.bindOffset.z = z
  }

  /**
   * unbind object
   * @access public
   * @returns {void}
   */
  unbind() {
    this.bindObj = null
  }

  /**
   * update camera position and matrix
   * @access public
   * @param {float} elapsedTime - elapsedTime
   * @returns {void}
   */
  update(elapsedTime) {
    if(this._animating){
      if(this._animator){
        this._animator.animate(this, elapsedTime)
      }
    }else if(this.bindObj){
      const objPos = this.bindObj._position
      const ox = objPos.x + this.bindOffset.x
      const oy = objPos.y + this.bindOffset.y
      const oz = objPos.z + this.bindOffset.z
      const cx = ox - this.distance * Math.cos(this.bindXAngle) * Math.sin(this.bindYAngle)
      const cy = oy - this.distance * Math.sin(this.bindXAngle)
      const cz = oz - this.distance * Math.cos(this.bindXAngle) * Math.cos(this.bindYAngle)

      this.lookat(cx, cy, cz,
                  ox, oy, oz,
                  0, 1, 0)
    }
  }
}


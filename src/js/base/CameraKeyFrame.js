'use strict'

/**
 * CameraKeyFrame class
 * @access public
 */
export default class CameraKeyFrame {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    /** @type {int} */
    this.frameNo = -1

    /** @type {Vector3} */
    this.position = null

    /** @type {Vector4} */
    this.rotate = null

    /** @type {float} */
    this.distance = null

    /** @type {Array<float>} */
    this.interpolation = null

    /** @type {float} */
    this.angle = null

    /** @type {boolean} */
    this.perspective = false
  }
}

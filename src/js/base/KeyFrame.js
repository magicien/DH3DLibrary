'use strict'

/**
 * KeyFrame class
 * @access public
 */
export default class KeyFrame {
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

    /** @type {Array<float>} */
    this.interpolation = null
  }
}


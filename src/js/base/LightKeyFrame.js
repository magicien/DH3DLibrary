'use strict'

/**
 * LightKeyFrame class
 * @access public
 */
export default class LightKeyFrame {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    /** @type {int} */
    this.frameNo = -1

    /** @type {Vector4} */
    this.color = null

    /** @type {Vector3} */
    this.position = null
  }
}


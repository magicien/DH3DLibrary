'use strict'

/**
 * CameraMotion class
 * @access public
 */
export default class CameraMotion {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    /** @type {string} */
    this.hashName = ''

    /** @type {boolean} */
    this.loaded = false

    /** @type {function} */
    this.onload = null

    // motion

    /** @type {Array<Motion>} */
    this.motionArray = []

    /** @type {int} */
    this.frameLength = 0

    /** @type {float} */
    this.defaultFPS = 0

    /** @type {boolean} */
    this.loop = false
  }

  /**
   * copy this motion object
   * @access public
   * @returns {CameraMotion} - new motion object
   */
  clone() {
    return this
  }

  /**
   * set motion data
   * @access public
   * @param {Motion} motion - 
   * @returns {void}
   */
  copy(motion) {
    this.motionArray = motion.motionArray
    this.frameLength = motion.frameLength
    this.defaultFPS  = motion.defaultFPS
    this.loop        = motion.loop
  }
}

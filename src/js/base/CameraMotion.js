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
    this.hashName = ''
    this.loaded = false
    this.onload = null

    // motion
    this.motionArray = null

    this.frameLength = 0
    this.defaultFPS = 0
    this.loop = false
  
    this.motionArray = []
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

'use strict'

/**
 * Motion class
 * @access public
 */
export default class Motion {
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
    this.motionArray = new Map()

    this.frameLength = 0
    this.defaultFPS = 0
    this.loop = false
  }

  clone() {
    return this
  }

  destroy() {
  }

  copy(motion) {
    this.motionArray = motion.motionArray
    this.frameLength = motion.frameLength
    this.defaultFPS  = motion.defaultFPS
    this.loop        = motion.loop
  }
}

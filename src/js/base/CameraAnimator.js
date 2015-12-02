'use strict'

/**
 * CameraAnimator class
 * @access public
 */
export default class CameraAnimator {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
  }

  /**
   * 
   * @access public
   * @param {Camera} camera - camera 
   * @param {float} elapsedTime - elapsed time from previous frame (sec)
   * @returns {void}
   */
  animate(camera, elapsedTime) {
    this.updateMotion(camera, elapsedTime)
  }

  /**
   * update camera status
   * @access public
   * @param {Camera} camera - camera used
   * @param {float} elapsedTime - elapsed time from previous frame (sec)
   * @returns {void}
   */
  updateMotion(camera, elapsedTime) {
  }
}

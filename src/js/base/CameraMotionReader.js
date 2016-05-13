'use strict'

/**
 * CameraMotionReader class
 * @access public
 */
export default class CameraMotionReader {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
  }

  /**
   * read motion data from given URL
   * @access public
   * @param {string|File} url - URL of motion data or File object
   * @returns {CameraMotion|null} - motion data
   */
  readMotion(url) {
    return null
  }

  /**
   * read motion data from given File object
   * @access public
   * @param {File} file - File object of motion data
   * @returns {CameraMotion|null} - motion data
   */
  readMotionFromFile(file) {
    return null
  }
}


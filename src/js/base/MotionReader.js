'use strict'

/**
 * MotionReader class
 * @access public
 */
export default class MotionReader {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
  }

  readMotion(url) {
    return null
  }

  readMotionFromFile(file) {
    return null
  }
}

MotionReader.canRead = (file) => {
  return false
}

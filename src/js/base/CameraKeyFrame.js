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
    this.frameNo = -1
    this.position = null
    this.rotate = null
    this.distance = null
    this.interpolation = null
    this.angle = null
    this.parspective = false
  }
}

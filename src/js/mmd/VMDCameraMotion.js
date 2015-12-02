'use strict'

import CameraMotion from '../base/CameraMotion'

/**
 * VMDCameraMotion class
 * @access public
 */
export default class VMDCameraMotion extends CameraMotion {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    super()

    // Header
    this.name = ''

    this.defaultFPS = 30
  }
}

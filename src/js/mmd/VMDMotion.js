'use strict'

import Motion from '../base/Motion'

/**
 * VMDMotion class
 * @access public
 */
export default class VMDMotion extends Motion {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    super()

    this.name = ''
    this.faceMotionArray = new Map()
    this.defaultFPS = 30

    this.shadowArray = []
    this.ikArray = []
  }
}

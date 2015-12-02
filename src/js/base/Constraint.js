'use strict'

/**
 * Constraint class
 * @access public
 */
export default class Constraint {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    this.name = ''
    this.bodyA = 0
    this.bodyB = 0
    this.position = []
    this.rotate = []
    this.constraintPos1 = []
    this.constraintPos2 = []
    this.constraintRot1 = []
    this.constraintRot2 = []
    this.springPos = []
    this.springRot = []
  }
}


'use strict'

/**
 * RigidBody class
 * @access public
 */
export default class RigidBody {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
  // FIXME: field name
    this.name = ''
    this.boneIndex = 0
    this.groupIndex = 0
    this.groupTarget = 0
    this.shapeType = 0
    this.shapeW = 0.0
    this.shapeH = 0.0
    this.shapeD = 0.0
    this.position = null
    this.rotate = null
    this.weight = 0.0
    this.positionDim = 0.0
    this.rotateDim = 0.0
    this.recoil = 0.0
    this.friction = 0.0
    this.type = 0

  }
}


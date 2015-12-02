'use strict'

import Matrix from './Matrix'
import Vector3 from './Vector3'
import TextureUV from './TextureUV'

/**
 * Skin class
 * @access public
 */
export default class Skin {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    // Vertex
    this.position = null          // vec3
    this.normal = null            // vec3
    this.textureUV = null         // vec2

    this.currentPosition = null
    this.currentNormal = null
    this.currentTextureUV = null

    this.renderGroup = null
    this.boneNum = null
    this.bones = null
    this.skinWeight = null
    this.boneIndex = null

    // etc.
    this.edge = 0

    this.tempMatrix = new Matrix()

    this.currentPosition = new Vector3()
    this.currentNormal = new Vector3()
    this.currentTextureUV = new TextureUV()

    this.bones = []
    this.boneNum = []
    this.skinWeight = []
    this.boneIndex = []
  }
}



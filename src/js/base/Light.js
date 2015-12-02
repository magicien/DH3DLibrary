'use strict'

import Vector3 from './Vector3'
import Vector4 from './Vector4'

/**
 * Light class
 * @access public
 */
export default class Light {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    this.LIGHT_TYPE_DIRECTIONAL = 1

    this.type = 0
    this.position = new Vector3()
    this.ambient = new Vector4()
    this.diffuse = new Vector4()
    this.specular = new Vector4()

    this._positionCache = new Float32Array([0, 0, 0])
    this._ambientCache  = new Float32Array([0, 0, 0, 0])
    this._diffuseCache  = new Float32Array([0, 0, 0, 0])
    this._specularCache = new Float32Array([0, 0, 0, 0])
  }

  setType(type) {
    this.type = type
  }

  setPosition(x, y, z) {
    this.position.x = x
    this.position.y = y
    this.position.z = z

    this._positionCache = new Float32Array([x, y, z])
  }

  setAmbient(r, g, b, a) {
    this.ambient.x = r
    this.ambient.y = g
    this.ambient.z = b
    this.ambient.w = a

    this._ambientCache = new Float32Array([r, g, b, a])
  }

  setDiffuse(r, g, b, a) {
    this.diffuse.x = r
    this.diffuse.y = g
    this.diffuse.z = b
    this.diffuse.w = a

    this._diffuseCache = new Float32Array([r, g, b, a])
  }

  setSpecular(r, g, b, a) {
    this.specular.x = r
    this.specular.y = g
    this.specular.z = b
    this.specular.w = a

    this._specularCache = new Float32Array([r, g, b, a])
  }

  getType() {
    return this.type
  }

  getPosition() {
    return this._positionCache
  }

  getAmbient() {
    return this._ambientCache
  }

  getDiffuse() {
    return this._diffuseCache
  }

  getSpecular() {
    return this._specularCache
  }
}


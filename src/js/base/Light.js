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

  /**
   * get type of light
   * @access public
   * @returns {int} - type of light
   */
  getType() {
    return this.type
  }

  /**
   * set type of light
   * @access public
   * @param {int} type - type of light
   * @returns {void}
   */
  setType(type) {
    this.type = type
  }

  /**
   * set position of Light
   * @access public
   * @param {float} x - X value
   * @param {float} y - Y value
   * @param {float} z - Z value
   * @returns {void}
   */
  setPosition(x, y, z) {
    this.position.x = x
    this.position.y = y
    this.position.z = z

    this._positionCache = new Float32Array([x, y, z])
  }

  /**
   * set ambient value
   * @access public
   * @param {float} r - red value (0.0 - 1.0)
   * @param {float} g - green value (0.0 - 1.0)
   * @param {float} b - blue value (0.0 - 1.0)
   * @param {float} a - alpha value (0.0 - 1.0)
   * @returns {void}
   */
  setAmbient(r, g, b, a) {
    this.ambient.x = r
    this.ambient.y = g
    this.ambient.z = b
    this.ambient.w = a

    this._ambientCache = new Float32Array([r, g, b, a])
  }

  /**
   * set diffuse value
   * @access public
   * @param {float} r - red value (0.0 - 1.0)
   * @param {float} g - green value (0.0 - 1.0)
   * @param {float} b - blue value (0.0 - 1.0)
   * @param {float} a - alpha value (0.0 - 1.0)
   * @returns {void}
   */
  setDiffuse(r, g, b, a) {
    this.diffuse.x = r
    this.diffuse.y = g
    this.diffuse.z = b
    this.diffuse.w = a

    this._diffuseCache = new Float32Array([r, g, b, a])
  }

  /**
   * set specular value
   * @access public
   * @param {float} r - red value (0.0 - 1.0)
   * @param {float} g - green value (0.0 - 1.0)
   * @param {float} b - blue value (0.0 - 1.0)
   * @param {float} a - alpha value (0.0 - 1.0)
   * @returns {void}
   */
  setSpecular(r, g, b, a) {
    this.specular.x = r
    this.specular.y = g
    this.specular.z = b
    this.specular.w = a

    this._specularCache = new Float32Array([r, g, b, a])
  }

  /**
   * get position of light
   * @access public
   * @returns {Float32Array} - position of light
   */
  getPosition() {
    return this._positionCache
  }

  /**
   * get ambient value
   * @access public
   * @returns {Float32Array} - ambient value
   */
  getAmbient() {
    return this._ambientCache
  }

  /**
   * get diffuse value
   * @access public
   * @returns {Float32Array} - diffuse value
   */
  getDiffuse() {
    return this._diffuseCache
  }

  /**
   * get specular value
   * @access public
   * @returns {Float32Array} - specular value
   */
  getSpecular() {
    return this._specularCache
  }
}


'use strict'

import Vector4 from './Vector4'

/**
 * Material class
 * @access public
 */
export default class Material {
  /**
   * constructor
   * @access public
   * @constructor
   * @param {Material} m - 
   */
  constructor(m) {
    this.ambient = null
    this.diffuse = null
    this.specular = null
    this.shininess = 1.0
    this.emission = null
    this.alpha = 1.0
    this.toonIndex = 0
    this.edge = 0
    this.textureFileName = ''
    this.sphereFileName = ''
    this.toonFileName = ''

    this.texture = null
    this.texture_repeat = true
    this.sphere = null
    this.toon = null

    this._ambientCache = null
    this._diffuseCache = null
    this._specularCache = null
    this._emissionCache = null

    if(m instanceof Material){
      this.ambient = new Vector4(m.ambient)
      this.diffuse = new Vector4(m.diffuse)
      this.specular = new Vector4(m.specular)
      this.shininess = m.shininess
      this.emission = new Vector4(m.emission)
      this.alpha = m.alpha
      this.toonIndex = m.toonIndex
      this.edge = m.edge
      this.textureFileName = m.textureFileName
      this.sphereFileName = m.sphereFileName

      this.texture = m.texture
      this.texture_repeat = m.texture_repeat
      this.sphere = m.sphere
    }
  }

  /**
   * get ambient value
   * @access public
   * @returns {Float32Array} - ambient value
   */
  getAmbient() {
    if(!this._ambientCache){
      this._ambientCache = new Float32Array([
        this.ambient.x,
        this.ambient.y,
        this.ambient.z,
        this.ambient.w
      ])
    }
    return this._ambientCache
  }

  /**
   * get diffuse value
   * @access public
   * @returns {Float32Array} - diffuse value
   */
  getDiffuse() {
    if(!this._diffuseCache){
      this._diffuseCache = new Float32Array([
        this.diffuse.x,
        this.diffuse.y,
        this.diffuse.z,
        this.diffuse.w
      ])
    }
    return this._diffuseCache
  }

  /**
   * get specular value
   * @access public
   * @returns {Float32Array} - specular value
   */
  getSpecular() {
    if(!this._specularCache){
      this._specularCache = new Float32Array([
        this.specular.x,
        this.specular.y,
        this.specular.z,
        this.specular.w
      ])
    }
    return this._specularCache
  }

  /**
   * get shininess value
   * @access public
   * @returns {float} - shininess value
   */
  getShininess() {
    return this.shininess
  }

  /**
   * get emission value
   * @access public
   * @returns {Float32Array} - emission value
   */
  getEmission() {
    if(!this._emissionCache){
      this._emissionCache = new Float32Array([
        this.emission.x,
        this.emission.y,
        this.emission.z,
        this.emission.w
      ])
    }
    return this._emissionCache
  }

  /**
   * get alpha value
   * @access public
   * @returns {float} - alpha value
   */
  getAlpha() {
    return this.alpha
  }

  /**
   * clear cache
   * @access public
   * @returns {void}
   */
  clearCache() {
    // FIXME
    this._ambientCache = null
    this._diffuseCache = null
    this._specularCache = null
    this._emissionCache = null
  }

}

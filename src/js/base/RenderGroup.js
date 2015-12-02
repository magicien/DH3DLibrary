'use strict'

/**
 * RenderGroup class
 * @access public
 */
export default class RenderGroup {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    this.material = null
    this.boneArray = null
    this.indices = null
    this.indexBuffer = null

    this._indexDataCache = null
  
    this.indices = []
  }

  getBoneData() {
  }

  getIndexData() {
    if(!this._indexDataCache){
      this._indexDataCache = new Uint16Array(this.indices)
    }
    return this._indexDataCache
  }

  getAmbient() {
    return this.material.getAmbient()
  }

  getDiffuse() {
    return this.material.getDiffuse()
  }

  getSpecular() {
    return this.material.getSpecular()
  }

  getShininess() {
    return this.material.getShininess()
  }

}

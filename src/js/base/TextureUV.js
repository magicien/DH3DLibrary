'use strict'

/**
 * TextureUV class
 * @access public
 */
export default class TextureUV {
  /**
   * constructor
   * @access public
   * @param {float} u -
   * @param {float} v -
   * @constructor
   */
  constructor(u, v) {
    this.u = 0.0
    this.v = 0.0

    this.setValue(u, v)
  }

  setValue(u, v) {
    //if(u instanceof TextureUV || (u instanceof Object && u.v !== undefined)){
    if(u instanceof TextureUV || u instanceof Object){
      this.u = u.u
      this.v = u.v || 0.0
    }else{
      this.u = u || 0.0
      this.v = v || 0.0
    }
  }

}

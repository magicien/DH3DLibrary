'use strict'

/**
 * ObjectLoadMonitor class
 * @access public
 */
export default class ObjectLoadMonitor {
  /**
   * constructor
   * @access public
   * @param {Array} objs -
   * @param {Hash} options -
   * @constructor
   */
  constructor(objs, options) {
    this._objs = null
    this._loaded = false
    this._onload = null

    const monitor = this
    if(objs){
      this._objs = objs
      this._objs.forEach( (obj) => {
        if(obj != null){
          obj.onload = () => {
            //obj.loaded = true
            monitor.check()
          }
        }
      })
    }else{
      this._objs = []
    }

    if(options){
      this._onload = options.onload
    }
    this.check()
  }

  check() {
    let loaded = true
    this._objs.forEach( (obj) => {
      let isImage = false
      try{
        if(obj instanceof HTMLImageElement){
          isImage = true
        }
      }catch(e){
        if(obj instanceof Image){
          isImage = true
        }
      }
      if(isImage){
        if(!obj.complete){
          loaded = false
        }
      }else if(obj == null || !obj.loaded){
        loaded = false
      }
    })
    this._loaded = loaded
    if(loaded){
      if(this._onload){
        this._onload()
      }
    }
  }

// FIXME: implementation
  add(obj) {
  }

// FIXME: implementation
  remove(obj) {
  }
}

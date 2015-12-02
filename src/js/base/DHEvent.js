'use strict'

/**
 * DHEvent class
 * @access public
 */
export default class DHEvent {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    this._eventFunc = null
  }

  delete() {
  }

  start() {
    if(this._eventFunc){
      this._eventFunc(this)
    }
  }

  setEventCallback(func) {
    this._eventFunc = func
  }

  getEventCallback() {
    return this._eventFunc
  }
}


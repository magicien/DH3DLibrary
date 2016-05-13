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

  /**
   * delete event
   * @access public
   * @returns {void}
   */
  delete() {
    // FIXME: implement
  }

  /**
   * start event
   * @access public
   * @returns {void}
   */
  start() {
    if(this._eventFunc){
      this._eventFunc(this)
    }
  }

  /**
   * get event callback function
   * @access public
   * @returns {Function} - callback function
   */
  getEventCallback() {
    return this._eventFunc
  }

  /**
   * set event callback function
   * @access public
   * @param {Function} func - callback function
   * @returns {void}
   */
  setEventCallback(func) {
    this._eventFunc = func
  }
}


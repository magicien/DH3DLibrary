'use strict'

/**
 * KeyListener class
 * @access public
 */
export default class KeyListener {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    this._enable = false
    this._keyState = null
    this._keyNewState = null
    this._anyKey = false

    this._userKeyDownCallback = null
    this._userKeyUpCallback = null

    this._keyState = []
    this._keyNewState = []

    this.setEnable()
  }

  setEnable(flag = true) {
    if(!flag){
      this._enable = false
    }else{
      this._enable = true
      const obj = this
      /*
      Event.observe(window.document, 'keydown',
                     (event) => {obj.keyDownCallback(event)}, false)
      Event.observe(window.document, 'keyup',
                     (event) => {obj.keyUpCallback(event)}, false)
      */
      document.addEventListener('keydown', (event) => { obj.keyDownCallback(event) }, false)
      document.addEventListener('keyup',   (event) => { obj.keyUpCallback(event)   }, false)
    }
  }

  setDisable() {
    this.setEnable(false)
  }

  keyDownCallback(event = window.event) {
    let keyChar = this._keyHash.get(event.keyCode)
    if(keyChar === null)
      keyChar = String.fromCharCode(event.keyCode)

    if(!this._keyState[keyChar]){
      this._keyNewState[keyChar] = true
    }
    this._keyState[keyChar] = true
    this._anyKey = true

    if(this._userKeyDownCallback){
      this._userKeyDownCallback(event)
    }
  }

  keyUpCallback(event = window.event) {
    let keyChar = this._keyHash.get(event.keyCode)
    if(keyChar === null)
      keyChar = String.fromCharCode(event.keyCode)

    this._keyState[keyChar] = false

    if(this._userKeyUpCallback){
      this._userKeyUpCallback(event)
    }
  }

  setKeyDownCallback(func) {
    this._userKeyDownCallback = func
  }

  setKeyUpCallback(func) {
    this._userKeyUpCallback = func
  }

  resetKeyNewState() {
    const obj = this
    Object.keys(this._keyState).forEach( (k) => {
      obj._keyNewState[k] = false
    })
    this._anyKey = false
  }

  resetKeyState() {
    const obj = this
    Object.keys(this._keyState).forEach( (k) => {
      obj._keyState[k] = false
    })
    this.resetKeyNewState()
  }

  getKeyState(keyCode) {
    return this._keyState[keyCode]
  }

  getKeyNewState(keyCode) {
    return this._keyNewState[keyCode]
  }

  getAnyKeyState() {
    return this._anyKey
  }
}

KeyListener.prototype._keyHash = new Map([
  [  8, 'Backspace'],
  [  9, 'Tab'],
  [ 13, 'Enter'],
  [ 16, 'Shift'],
  [ 17, 'Ctrl'],
  [ 18, 'Alt'],
  [ 19, 'Pause'],
  [ 20, 'CapsLock'],
  [ 27, 'Esc'],
  [ 32, 'Space'],
  [ 33, 'PageUp'],
  [ 34, 'PageDown'],
  [ 35, 'End'],
  [ 36, 'Home'],
  [ 37, 'Left'],
  [ 38, 'Up'],
  [ 39, 'Right'],
  [ 40, 'Down'],
  [ 44, 'PrntScrn'],
  [ 45, 'Insert'],
  [ 46, 'Delete'],
  [144, 'NumLock'],
  [145, 'ScrollLock']
])
 

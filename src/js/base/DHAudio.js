'use strict'

import Matrix from './Matrix'
import Vector3 from './Vector3'
import Camera from './Camera'
import DH3DObject from './DH3DObject'

/**
 * DHAudio class
 * @access public
 */
export default class DHAudio {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    this._loaded = false
    this._leftLoaded = false
    this._rightLoaded = false

    this._stereo = false
    this._leftSnd = null
    this._rightSnd = null
    this._volume = 100.0
    this._distanceRatio = 1.0

    this._work = new Audio()

    this._listener = null
    this._sndSrc = null
  }

  /**
   * check if browser can play the given type of sound file
   * @access public
   * @param {string} type - String of type
   * @returns {boolean} - true: can play, false: can't play
   */
  canPlayType(type) {
    return this._work.canPlayType(type)
  }

  /**
   * check if it can play MP3 file
   * @access public
   * @returns {boolean} - true: can play MP3 file, false: can't play MP3 file
   */
  canPlayMP3() {
    return this.canPlayType('audio/mpeg')
  }

  /**
   * check if it can play OGG file
   * @access public
   * @returns {boolean} - true: can play OGG file, false: can't play OGG file
   */
  canPlayOGG() {
    return this.canPlayType('audio/ogg')
  }

  /**
   * set sound file to play
   * @access public
   * @param {HTMLAudioElement} leftSnd - Sound file for left side
   * @param {HTMLAudioElement} rightSnd - Sound file for right side
   * @returns {boolean} - true: success, false: failure (likely can't play given files)
   */
  setSound(leftSnd, rightSnd) {
    this._loaded = false
    if(!leftSnd){
      this._leftSnd = null
      this._rightSnd = null
      return false
    }
    const obj = this
    if(leftSnd){
      this._leftSnd = new Audio()
      this._leftLoaded = false
      this._leftSnd.addEventListener('canplaythrough', () => {
        obj._leftLoaded = true
        obj._checkLoaded() 
      }, true)
      this._leftSnd.loop = false
    }else{
      return false
    }

    if(rightSnd){
      this._rightSnd = new Audio()
      this._rightSnd.addEventListener('canplaythrough', () => { 
        obj._rightLoaded = true
        obj._checkLoaded() 
      }, true)
      this._rightSnd.src = rightSnd
      this._rightSnd.loop = false
      this._stereo = true
    }else{
      this._rightSnd = null
      this._stereo = false
    }

    this._leftSnd.src = leftSnd
    if(this._stereo){
      this._rightSnd.src = rightSnd
    }

    return true
  }

  /**
   * check if sound file is loaded
   * @access private
   * @returns {boolean} - true: already loaded, false: not yet
   */
  _checkLoaded() {
    if(this._loaded){
      return true
    }

    if(this.stereo){
      if(this._leftLoaded && this._rightLoaded){
        this._loaded = true
      }
    }else{
      if(this._leftLoaded){
        this._loaded = true
      }
    }
    return this._loaded
  }

  /**
   * set listener object
   * @access public
   * @param {Camera} listener - listener object
   * @returns {boolean} - true: success, false: failure
   */
  setListener(listener) {
    if(listener instanceof Camera || listener === null){
      this._listener = listener
      return true
    }
    return false
  }

  /**
   * set sound source
   * @access public
   * @param {DH3DObject} sndSrc - sound source
   * @returns {boolean} - true: success, false: failure
   */
  setSoundSource(sndSrc) {
    if(sndSrc instanceof DH3DObject || sndSrc === null) {
      this._sndSrc = sndSrc
      return true
    }
    return false
  }

  /**
   * play sound
   * @access public
   * @returns {boolean} - true: success, false: failure
   */
  play() {
    if(!this._loaded){
      return false
    }

    if(this._stereo){
      if(this._sndSrc && this._listener){
        this.playAt(this._listener, this._sndSrc)
      }else{
        this._leftSnd.currentTime = 0
        this._rightSnd.currentTime = 0
        this._leftSnd.play()
        this._rightSnd.play()
      }
    }else{
      this._leftSnd.currentTime = 0
      this._leftSnd.play()
    }
    return true
  }

  /**
   * play sound from given distance and direction
   * @access public
   * @param {float} distance - distance from sound source
   * @param {float} direction - 0: left, 1: right
   * @returns {float} - true: success, false: failure
   */
  playDistanceDirection(distance, direction) {
    if(!this._loaded){
      return false
    }

    const volume = Math.pow(10, -0.15 * distance * this._distanceRatio) * this._volume * 0.01
    if(this._stereo){
      this._rightSnd.pause()
      this._leftSnd.pause()
      this._rightSnd.currentTime = 0
      this._leftSnd.currentTime  = 0

      const angle = Math.PI * 0.5 * direction
      this._rightSnd.volume = Math.sin(angle) * volume
      this._leftSnd.volume  = Math.cos(angle) * volume
      if(angle > 0.5){
        this._rightSnd.play()
        this._leftSnd.play()
      }else{
        this._leftSnd.play()
        this._rightSnd.play()
      }
    }else{
      this._leftSnd.pause()
      this._leftSnd.currentTime = 0

      this._leftSnd.volume = volume
      this._leftSnd.play()
    }

    return true
  }

  /**
   * play sound
   * @access public
   * @returns {boolean} - true: success, false: failure
   */
  playAt() {
    if(!this._loaded){
      return false
    }

    /*
    const spos // the position of sound
    const lpos // the position of the eye point of listener
    const cpos // the position of the reference point
    const upos // the direction of the up vector
    */

    let distance  = 0 // distance
    let direction = 0 // direction

    //const args = this.playAt.arguments
    const args = arguments
    if(args.length === 2){
      if(args[0] instanceof Camera && args[1] instanceof DH3DObject){
        const camera = args[0]
        const sndObj = args[1]
        //const mat = new Matrix(camera.viewMat)

        const cameraPos = camera.position
        const sndPos = sndObj._position
        const viewPos = new Vector3()

        viewPos.transform(sndPos, camera.viewMat)

        //cpos = new Vector3(lpos.x - mat.m31, lpos.y - mat.m32, lpos.z - mat.m33)
        //upos = new Vector3(mat.m21, mat.m22, mat.m23)

        const f = new Vector3()
        f.sub(sndPos, cameraPos)
        distance = f.length()
        direction = (viewPos.x / Math.sqrt(viewPos.x * viewPos.x + viewPos.z * viewPos.z) + 1.0) * 0.5
      }else{
        return false
      }
    }else{
      return false
    }

    return this.playDistanceDirection(distance, direction)
  }

  /**
   * pause sound
   * @access public
   * @returns {boolean} - true: success, false: failure
   */
  pause() {
    if(!this._loaded){
      return false
    }

    if(this._leftSnd){
      this._leftSnd.pause()
    }
    if(this._rightSnd){
      this._rightSnd.pause()
    }

    return true
  }
}


'use strict'

import Vector3 from './Vector3'
import Vector4 from './Vector4'
import DHEvent from './DHEvent'
import Model from './Model'
import ModelBank from './ModelBank'
import Motion from './Motion'
import MotionBank from './MotionBank'

/**
 * DH3DObject basic class
 * @access public
 */
export default class DH3DObject {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    this._model = null
    this._motion = null
    this._renderer = null
    this._animator = null
    this._eventArray = [] // FIXME: not use
    this._motionEventArray = []

    this._moveCallbacks = []

    this._animationTime = 0.0
    this._animationFrame = 0.0
    this._animationSpeed = 1.0
    this._animating = false
    this._loop = false

    this._force = new Vector3(0, 0, 0)
    this._speed = new Vector3(0, 0, 0)
    this._position = new Vector3(0, 0, 0)
    this._direction = 0
    this._maxSpeed = 10.0

    this._state = null

    this._motionStep = 0.0
    this._motionCount = 0.0

    // motion blending
    this._motionBlendCount = 0.0
    this._motionBlendStep = 0.0

    this._autoDirection = false
    this._mirror = false
    this._reflectionMode = false
  }

  /**
   * set callback function for each move
   * @access public
   * @param {Function} func - callback which is called each frame
   * @return {number} 0: success, -1: failure (func is not function)
   */
  addMoveCallback(func) {
    if(typeof func !== 'function'){
      return -1
    }

    this._moveCallbacks.push(func)
    return 0
  }

  /**
   * remove callback function for each move
   * @access public
   * @param {Function} func - callback which is called each frame
   * @return {number} 0: success, -1: failure (func is not registered)
   */
  removeMoveCallback(func){
    const i = this._moveCallbacks.indexOf(func)
    if(i < 0){
      return -1
    }

    this._moveCallbacks.splice(i, 1)
    return 0
  }

  /**
   * move object
   * @access public
   * @param {float} elapsedTime - elapsed time (seconds) from previous frame
   * @returns {void}
   */
  move(elapsedTime) {
    // FIXME: params
    const friction = 10.0 * elapsedTime

    if(friction < 1.0){
      this._speed.mulAdd(this._speed, this._speed, -friction)
    }else{
      this._speed.setValue(0, 0, 0)
    }
    
    this._speed.mulAdd(this._speed, this._force, 5.0 * elapsedTime)
    const speedVal = this._speed.length()
    if(speedVal > this._maxSpeed){
      this._speed.mul(this._speed, this._maxSpeed / speedVal)
    }

    this._position.mulAdd(this._position, this._speed, elapsedTime)

    const myObj = this
    this._moveCallbacks.forEach( (func) => {
      func(myObj, elapsedTime)
    })

    this._model.rootBone.offset.setValue(this._position)

    if(this._autoDirection){
      const axis = new Vector3(0.0, 1.0, 0.0)
      if(this._force.z > 0.001 || this._force.z < -0.001){
        this._direction = Math.atan(this._force.x / this._force.z)
        if(this._force.z < 0){
          this._direction += Math.PI
        }
      }else if(this._force.x > 0.001){
        this._direction = Math.PI * 0.5
      }else if(this._force.x < -0.001){
        this._direction = Math.PI * -0.5
      }
      this._model.rootBone.rotate.createAxis(axis, this._direction)
    }
  }

  /**
   * get Model object
   * @access public
   * @returns {Model} - model object
   */
  getModel() {
    return this._model
  }

  /**
   * set Model object
   * @access public
   * @param {Model} model - Model object. Set null to delete object
   * @returns {void}
   */
  setModel(model = null) {
    if(this._model){
      this._model.destroy()
    }

    if(model === null){
      return false
    }

    if(model instanceof Model){
      if(this._renderer && model.renderer !== this._renderer){
        return ModelBank.getModelForRenderer(model.hashName, this._renderer)
          .then((m) => { this._model = m })
          .catch((error) => { console.error(`model load error: ${error}`) })
      }

      this._model = model
      return true
    }

    return ModelBank.getModel(model).then((m) => this.setModel(m))
  }

  /**
   * get Motion object
   * @access public
   * @returns {Motion} - Motion object
   */
  getMotion() {
    return this._motion
  }

  /**
   * set Motion object
   * @access public
   * @param {Motion} motion - Motion object. Set null to delete object
   * @returns {void}
   */
  setMotion(motion = null) {
    if(this._motion){
      this._motion.destroy()
    }

    if(motion === null){
      return false
    }

    if(motion instanceof Motion){
      this._motion = motion
      return true
    }

    return MotionBank.getMotion(motion).then((m) => this.setMotion(m))
  }

  /**
   * set Motion object to blend with current motion
   * @access public
   * @param {Motion} motion - Motion object to blend
   * @param {float} blendCount - number of frames to complete transition
   * @returns {void}
   */
  setMotionWithBlending(motion, blendCount) {
    this._motion = motion
    this._motionBlendCount = 1.0
    this._motionBlendStep = 1.0 / blendCount
    this._model.rootBone.setBlendValueRecursive()
  }

  /**
   * get Renderer object
   * @access public
   * @returns {Renderer} - Renderer object
   */
  getRenderer() {
    return this._renderer
  }

  /**
   * set Renderer object
   * @access public
   * @param {Renderer} renderer - Renderer object
   * @returns {void}
   */
  setRenderer(renderer) {
    this._renderer = renderer

    if(this._model && this._model.renderer !== renderer){
      return ModelBank.getModelForRenderer(this._model.hashName, renderer)
        .then((m) => { this._model = m })
        .catch((error) => { console.error(`model load error: ${error}`) })
    }

    return true
  }

  /**
   * get animating state
   * @access public
   * @returns {boolean} - true: enable animation, false: disable animation
   */
  getAnimating() {
    return this._animating
  }

  /**
   * set animating state
   * @access public
   * @param {boolean} animating - true: enable animation, false: disable animation
   * @returns {void}
   */
  setAnimating(animating = true) {
    if(animating){
      this._animating = true
    }else{
      this._animating = false
    }
  }

  /**
   * get loop state
   * @access public
   * @returns {boolean} - true: enable loop, false: disable loop
   */
  getLoop() {
    return this._loop
  }

  /**
   * set loop state
   * @access public
   * @param {boolean} loop - true: enable loop, false: disable loop
   * @returns {void}
   */
  setLoop(loop = true) {
    if(loop){
      this._loop = true
    }else{
      this._loop = false
    }
  }

  /**
   * get Animator object
   * @access public
   * @returns {Animator} - Animator object
   */
  getAnimator() {
    return this._animator
  }

  /**
   * set Animator object
   * @access public
   * @param {Animator} animator - Animator object
   * @returns {void}
   */
  setAnimator(animator) {
    this._animator = animator
  }

  /**
   * get animation time
   * @access public
   * @returns {float} - animation time (seconds)
   */
  getAnimationTime() {
    return this._animationTime
  }

  /**
   * set animation time
   * @access public
   * @param {float} time - animation time (seconds)
   * @returns {void}
   */
  setAnimationTime(time) {
    this._animationTime = time
  }

  /**
   * get animation speed
   * @access public
   * @returns {float} - animation speed: normal speed is 1.0
   */
  getAnimationSpeed() {
    return this._animationSpeed
  }

  /**
   * set animation speed
   * @access public
   * @param {float} speed - animation speed: normal speed is 1.0
   * @returns {void}
   */
  setAnimationSpeed(speed) {
    this._animationSpeed = speed
  }

  /**
   * get object position
   * @access public
   * @returns {Vector3} - object position
   */
  getPosition() {
    return this._position
  }

  /**
   * set object position
   * @access public
   * @param {Vector3|float} x - object position (Vector3 object or X value)
   * @param {float} y - Y value
   * @param {float} z - Z value
   * @returns {void}
   */
  setPosition(x, y, z) {
    if(x instanceof Vector3){
      this._position.x = x.x
      this._position.y = x.y
      this._position.z = x.z
    }else{
      this._position.x = x
      this._position.y = y
      this._position.z = z
    }
  }

  /**
   * get object speed
   * @access public
   * @returns {Vector3} - object speed
   */
  getSpeed() {
    return this._speed
  }

  /**
   * set object speed
   * @access public
   * @param {Vector3|float} x - object speed (Vector3 object or X value)
   * @param {float} y - Y value of speed
   * @param {float} z - Z value of speed
   * @returns {void}
   */
  setSpeed(x, y, z) {
    if(x instanceof Vector3){
      this._speed.x = x.x
      this._speed.y = x.y
      this._speed.z = x.z
    }else{
      this._speed.x = x
      this._speed.y = y
      this._speed.z = z
    }
  }

  /**
   * get quaternion for rotation
   * @access public
   * @returns {Vector4} - quaternion
   */
  getRotate() {
    return this._model.rootBone.rotate
  }

  /**
   * set quaternion for rotation
   * @access public
   * @param {Vector4|float} x - quaternion (Vector4 or X value)
   * @param {float} y - Y value
   * @param {float} z - Z value
   * @param {float} w - W value
   * @returns {void}
   */
  setRotate(x, y, z, w) {
    const rot = this._model.rootBone.rotate
    if(x instanceof Vector4){
      rot.x = x.x
      rot.y = x.y
      rot.z = x.z
      rot.w = x.w
      rot.normalize()
    }else{
      rot.x = x
      rot.y = y
      rot.z = z
      rot.w = w
      rot.normalize()
    }
  }

  setRotateAxis(axis, rotAngle) {
    this._model.rootBone.rotate.createAxis(axis, rotAngle)
  }

  setScale(x, y, z) {
    const scale = this._model.rootBone.scale
    if(y === undefined && z === undefined){
      scale.x = x
      scale.y = x
      scale.z = x
    }else{
      scale.x = x
      scale.y = y
      scale.z = z
    }
  }

  getAutoDirection() {
    return this._autoDirection
  }

  setAutoDirection(autoDirection = true) {
    if(autoDirection){
      this._autoDirection = true
    }else{
      this._autoDirection = false
    }
  }

  getMirror() {
    return this._mirror
  }

  setMirror(flag) {
    this._mirror = flag
  }

  getReflectionMode() {
    return this._reflectionMode
  }

  setReflectionMode(flag) {
    this._reflectionMode = flag
  }

  updateMaterial() {
    this._model.materialArray.forEach( (mat) => {
      mat.clearCache()
    })
  }

  getSkinArray() {
    if(this._model){
      return this._model.getSkinArray()
    }
    return null
  }

  getDynamicSkinArray() {
    if(this._model){
      return this._model.getDynamicSkinArray()
    }
    return null
  }

  getNumElements() {
    if(this._model){
      return this._model.indexArray.length / 3
    }
    return 0
  }

  // FIXME: implementation
  getTexture() {
    if(this._model){
      return null
    }
    return null
  }

  animate(elapsedTime) {
    const animationTimeBefore = this._animationTime
    if(this._animator){
      this._animator.animate(this, elapsedTime)
    }else{
      // ボーンの行列更新のみ行う
      this._model.rootBone.updateMatrixRecursive()
    }
    const animationTimeAfter = this._animationTime

    const obj = this
    this._motionEventArray.forEach( (me) => {
      if(animationTimeBefore < me.time && me.time <= animationTimeAfter){
        if(!me.state || me.state === obj._state){
          me.start()
        }
      }
    })
  }

  render() {
    if(this._renderer)
      this._renderer.render(this)
  }

  renderMirror(reflectionObjectArray) {
    if(this._renderer){
      this._renderer.renderMirror(this, reflectionObjectArray)
    }
  }

  addMotionCallback(func, time, state) {
    const motionEvent = new DHEvent()
    motionEvent.time = time
    motionEvent.state = state
    motionEvent.setEventCallback(func)

    this._motionEventArray.push(motionEvent)
  }

  removeMotionCallback(func, time, state) {
    const arr = this._motionEventArray
    let target = null
    arr.forEach( (me) => {
      if(me.time === time && me.state === state
         && me.getEventCallback() === func){
        target = me
        me.delete()
      }
    })
    if(target){
      this._motionEventArray = arr.filter((ev) => (ev !== target))
    }
  }

  clearMotionCallback() {
    const arr = this._motionEventArray
    arr.forEach( (me) => {
      me.delete()
    })
    arr.length = 0
  }

  getDirection() {
    return this._direction
  }

  setDirection(direction) {
    this._direction = direction
  }

  getMaxSpeed() {
    return this._maxSpeed
  }

  setMaxSpeed(maxSpeed) {
    this._maxSpeed = maxSpeed
  }

  getState() {
    return this._state
  }

  setState(state) {
    this._state = state
  }
}

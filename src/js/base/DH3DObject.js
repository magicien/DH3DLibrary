'use strict'

import Vector3 from './Vector3'
import Vector4 from './Vector4'
import DHEvent from './DHEvent'
import ModelBank from './ModelBank'

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
   * @param {function} func - callback which is called each frame
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
   * @param {function} func - callback which is called each frame
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

  move(elapsedTime) {
    // FIXME: params
    const gravity = new Vector3(0, -9.8, 0)
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

  getModel() {
    return this._model
  }

  setModel(model) {
    if(this._model){
      this._model.destroy()
    }

    // FIXME: setModel function must be synchronous function
    if(this._renderer && model.renderer !== this._renderer){
      //this._model = ModelBank.getModelForRenderer(model.hashName, this._renderer)
      ModelBank.getModelForRenderer(model.hashName, this._renderer)
        .then((m) => { this._model = m })
        .catch((error) => { console.error(`model load error: ${error}`) })
    }else{
      this._model = model
    }
  }

  setMotion(motion) {
    this._motion = motion
  }

  setMotionWithBlending(motion, blendCount) {
    this._motion = motion
    this._motionBlendCount = 1.0
    this._motionBlendStep = 1.0 / blendCount
    this._model.rootBone.setBlendValueRecursive()
  }

  setRenderer(renderer) {
    // FIXME: setModel function must be synchronous function
    if(this._model && this._model.renderer !== renderer){
      //this._model = ModelBank.getModelForRenderer(this._model.hashName, renderer)
      ModelBank.getModelForRenderer(this._model.hashName, renderer)
        .then((m) => { this._model = m })
        .catch((error) => { console.error(`model load error: ${error}`) })
    }
    this._renderer = renderer
  }

  setAnimating(animating = true) {
    if(animating){
      this._animating = true
    }else{
      this._animating = false
    }
  }

  getAnimating() {
    return this._animating
  }

  setLoop(loop = true) {
    if(loop){
      this._loop = true
    }else{
      this._loop = false
    }
  }

  getLoop() {
    return this._loop
  }

  setAnimator(animator) {
    this._animator = animator
  }

  setAnimationTime(time) {
    this._animationTime = time
  }

  getAnimationTime() {
    return this._animationTime
  }

  setAnimationSpeed(speed) {
    this._animationSpeed = speed
  }

  getAnimationSpeed() {
    return this._animationSpeed
  }

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
    if(y == null && z == null){
      scale.x = x
      scale.y = x
      scale.z = x
    }else{
      scale.x = x
      scale.y = y
      scale.z = z
    }
  }

  setAutoDirection(autoDirection = true) {
    if(autoDirection){
      this._autoDirection = true
    }else{
      this._autoDirection = false
    }
  }

  getAutoDirection() {
    return this._autoDirection
  }

  setMirror(flag) {
    this._mirror = flag
  }

  getMirror() {
    return this._mirror
  }

  setReflectionMode(flag) {
    this._reflectionMode = flag
  }

  getReflectionMode() {
    return this._reflectionMode
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
      //this._motionEventArray = arr.without(target)
      this._motionEventArray = arr.filter((ev) => { return ev !== target })
    }
  }

  clearMotionCallback() {
    const arr = this._motionEventArray
    arr.forEach( (me) => {
      me.delete()
    })
    arr.length = 0
  }

  setDirection(direction) {
    this._direction = direction
  }

  getDirection() {
    return this._direction
  }

  setMaxSpeed(maxSpeed) {
    this._maxSpeed = maxSpeed
  }

  getMaxSpeed() {
    return this._maxSpeed
  }

  setState(state) {
    this._state = state
  }

  getState() {
    return this._state
  }
}

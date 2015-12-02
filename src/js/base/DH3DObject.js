/*--------------------------------------------------------------------------------
 * DH3DLibrary DH3DObject.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var DH3DObject = Class.create({
  _model: null,
  _motion: null,
  _renderer: null,
  _animator: null,
  _eventArray: $A(), // FIXME: not use
  _motionEventArray: $A(),

  _moveCallbacks: null,

  _animationTime: 0.0,
  _animationFrame: 0.0,
  _animating: false,
  _loop: false,

  _force: null,
  _speed: null,
  _position: null,
  _direction: 0,
  _maxSpeed: 10.0,

  _state: null,

  // motion blending
  _motionBlendCount: 0.0,
  _motionBlendStep: 0.0,

  _autoDirection: false,
  _mirror: false,
  _reflectionMode: false,

  initialize: function() {
    this._position = new DHVector3(0, 0, 0);
    this._force = new DHVector3(0, 0, 0);
    this._speed = new DHVector3(0, 0, 0);

    this._motionStep = 0.0;
    this._motionCount = 0.0;

    this._motionEventArray = $A();
    this._moveCallbacks = $A();
  },

  addMoveCallback: function(func){
    if(typeof(func) != "function"){
      return -1;
    }

    this._moveCallbacks.push(func);
    return 0;
  },

  removeMoveCallback: function(func){
    var i = this._moveCallbacks.indexOf(func);
    if(i < 0){
      return -1;
    }

    this._moveCallbacks.splice(i, 1);
    return 0;
  },

  move: function(elapsedTime) {
    // FIXME: params
    var gravity = new DHVector3(0, -9.8, 0);
    var friction = 10.0 * elapsedTime;

    if(friction < 1.0){
      this._speed.mulAdd(this._speed, this._speed, -friction);
    }else{
      this._speed.setValue(0, 0, 0);
    }
    
    this._speed.mulAdd(this._speed, this._force, 5.0 * elapsedTime);
    var speedVal = this._speed.length();
    if(speedVal > this._maxSpeed){
      this._speed.mul(this._speed, this._maxSpeed / speedVal);
    }

    this._position.mulAdd(this._position, this._speed, elapsedTime);

    var myObj = this;
    this._moveCallbacks.each( function(func){
      func(myObj, elapsedTime);
    });

    this._model.rootBone.offset.setValue(this._position);

    if(this._autoDirection){
      var axis = new DHVector3(0.0, 1.0, 0.0);
      if(this._force.z > 0.001 || this._force.z < -0.001){
        this._direction = Math.atan(this._force.x / this._force.z);
        if(this._force.z < 0){
          this._direction += Math.PI;
        }
      }else if(this._force.x > 0.001){
        this._direction = Math.PI * 0.5;
      }else if(this._force.x < -0.001){
        this._direction = Math.PI * -0.5;
      }
      this._model.rootBone.rotate.createAxis(axis, this._direction);
    }
  },

  setModel: function(model) {
    if(this._model){
      this._model.destroy();
    }

    if(this._renderer && model.renderer != this._renderer){
      this._model = ModelBank.getModelForRenderer(model.hashName, this._renderer);
    }else{
      this._model = model;
    }
  },

  setMotion: function(motion) {
    this._motion = motion;
  },

  setMotionWithBlending: function(motion, blendCount) {
    this._motion = motion;
    this._motionBlendCount = 1.0;
    this._motionBlendStep = 1.0 / blendCount;
    this._model.rootBone.setBlendValueRecursive();
  },

  setRenderer: function(renderer) {
    if(this._model && this._model.renderer != renderer){
      this._model = ModelBank.getModelForRenderer(this._model.hashName, renderer);
    }
    this._renderer = renderer;
  },

  setAnimating: function(animating) {
    if(animating || animating == undefined){
      this._animating = true;
    }else{
      this._animating = false;
    }
  },

  getAnimating: function() {
    return this._animating;
  },

  setLoop: function(loop) {
    if(loop || loop == undefined){
      this._loop = true;
    }else{
      this._loop = false;
    }
  },

  getLoop: function() {
    return this._loop;
  },

  setAnimator: function(animator) {
    this._animator = animator;
  },

  setAnimationTime: function(time) {
    this._animationTime = time;
  },

  getAnimationTime: function() {
    return this._animationTime;
  },

  setPosition: function(x, y, z) {
    if(x instanceof DHVector3){
      this._position.x = x.x;
      this._position.y = x.y;
      this._position.z = x.z;
    }else{
      this._position.x = x;
      this._position.y = y;
      this._position.z = z;
    }
  },

  setSpeed: function(x, y, z) {
    if(x instanceof DHVector3){
      this._speed.x = x.x;
      this._speed.y = x.y;
      this._speed.z = x.z;
    }else{
      this._speed.x = x;
      this._speed.y = y;
      this._speed.z = z;
    }
  },

  setRotate: function(x, y, z, w) {
    var rot = this._model.rootBone.rotate;
    if(x instanceof DHVector4){
      rot.x = x.x;
      rot.y = x.y;
      rot.z = x.z;
      rot.w = x.w;
      rot.normalize();
    }else{
      rot.x = x;
      rot.y = y;
      rot.z = z;
      rot.w = w;
      rot.normalize();
    }
  },

  setRotateAxis: function(axis, rotAngle) {
    this._model.rootBone.rotate.createAxis(axis, rotAngle);
  },

  setScale: function(x, y, z) {
    if(y == null && z == null){
      y = x;
      z = x;
    }
    var scale = this._model.rootBone.scale;
    scale.x = x;
    scale.y = y;
    scale.z = z;
  },

  setAutoDirection: function(autoDirection) {
    if(autoDirection || autoDirection == undefined){
      this._autoDirection = true;
    }else{
      this._autoDirection = false;
    }
  },

  getAutoDirection: function() {
    return this._autoDirection;
  },

  setMirror: function(flag) {
    this._mirror = flag;
  },

  getMirror: function() {
    return this._mirror;
  },

  setReflectionMode: function(flag) {
    this._reflectionMode = flag;
  },

  getReflectionMode: function() {
    return this._reflectionMode;
  },

  updateMaterial: function() {
    this._model.materialArray.each( function(mat){
      mat.clearCache();
    });
  },

  getSkinArray: function() {
    if(this._model){
      return this._model.getSkinArray();
    }
    return null;
  },

  getDynamicSkinArray: function() {
    if(this._model){
      return this._model.getDynamicSkinArray();
    }
    return null;
  },

  getNumElements: function() {
    if(this._model){
      return (this._model.indexArray.length / 3);
    }
    return 0;
  },

  // FIXME: implementation
  getTexture: function() {
    if(this._model){

    }
  },

  animate: function(elapsedTime) {
    var animationTimeBefore = this._animationTime;
    if(this._animator){
      this._animator.animate(this, elapsedTime);
    }else{
      // ボーンの行列更新のみ行う
      this._model.rootBone.updateMatrixRecursive();
    }
    var animationTimeAfter = this._animationTime;

    var obj = this;
    this._motionEventArray.each( function(me){
      if(animationTimeBefore < me.time && me.time <= animationTimeAfter){
        if(!me.state || me.state == obj._state){
          me.start();
        }
      }
    });
  },

  render: function() {
    if(this._renderer)
      this._renderer.render(this);
  },

  renderMirror: function(reflectionObjectArray) {
    if(this._renderer){
      this._renderer.renderMirror(this, reflectionObjectArray);
    }
  },

  addMotionCallback: function(func, time, state) {
    var motionEvent = new DHEvent();
    motionEvent.time = time;
    motionEvent.state = state;
    motionEvent.setEventCallback(func);

    this._motionEventArray.push(motionEvent);
  },

  removeMotionCallback: function(func, time, state) {
    var arr = this._motionEventArray;
    var target = null;
    arr.each( function(me){
      if(me.time == time && me.state == state
         && me.getEventCallback() == func){
        target = me;
        me.delete();
      }
    });
    if(target){
      this._motionEventArray = arr.without(target);
    }
  },

  clearMotionCallback: function() {
    var arr = this._motionEventArray;
    arr.each( function(me){
      me.delete();
    });
    arr.clear();
  },

  setDirection: function(direction) {
    this._direction = direction;
  },

  getDirection: function() {
    return this._direction;
  },

  setMaxSpeed: function(maxSpeed) {
    this._maxSpeed = maxSpeed;
  },

  getMaxSpeed: function() {
    return this._maxSpeed;
  },

  setState: function(state) {
    this._state = state;
  },

  getState: function() {
    return this._state;
  },
});


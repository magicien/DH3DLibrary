/*--------------------------------------------------------------------------------
 * DH3DLibrary DH3DObject.js v0.1.0
 * Copyright (c) 2010-2011 DarkHorse
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

  initialize: function() {
    this._position = new DHVector3(0, 0, 0);
    this._force = new DHVector3(0, 0, 0);
    this._speed = new DHVector3(0, 0, 0);

    this._motionStep = 0.0;
    this._motionCount = 0.0;

    this._motionEventArray = $A();
  },

  move: function(elapsedTime) {
    // FIXME: params
    var gravity = new DHVector3(0, -9.8, 0);
    var friction = 5.0 * elapsedTime;

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
    this._model.rootBone.offset.setValue(this._position);

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
  },

  setModel: function(model) {
    if(this._model){
      this._model.destroy();
    }

    if(this._renderer && model._renderer != this._renderer){
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

    this._motionEventArray.each( function(me){
      if(animationTimeBefore < me.time && me.time <= animationTimeAfter){
        me.start();
      }
    });
  },

  render: function() {
    if(this._renderer)
      this._renderer.render(this);
  },

  addMotionCallback: function(func, time) {
    var motionEvent = new DHEvent();
    motionEvent.time = time;
    motionEvent.setEventCallback(func);

    this._motionEventArray.push(motionEvent);
  },

  removeMotionCallback: function(func, time) {
    var arr = this._motionEventArray;
    var target = null;
    arr.each( function(me){
      if(me.time == time && me.getEventCallback() == func){
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
});


/*--------------------------------------------------------------------------------
 * DH3DLibrary DH3DObject.js v0.1.0
 * Copyright (c) 2010-2011 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var DH3DObject = Class.create({
  model: null,
  motion: null,
  renderer: null,
  animator: null,
  eventArray: $A(), // FIXME: not use
  motionEventArray: $A(),

  animationTime: 0.0,
  animationFrame: 0.0,
  animating: false,
  loop: false,

  force: null,
  speed: null,
  position: null,
  direction: 0,
  maxSpeed: 10.0,

  state: null,

  // motion blending
  motionBlendCount: 0.0,
  motionBlendStep: 0.0,


  initialize: function() {
    this.position = new DHVector3(0, 0, 0);
    this.force = new DHVector3(0, 0, 0);
    this.speed = new DHVector3(0, 0, 0);

    this.motionStep = 0.0;
    this.motionCount = 0.0;

    this.motionEventArray = $A();
  },

  move: function(elapsedTime) {
    // FIXME: params
    var gravity = new DHVector3(0, -9.8, 0);
    var friction = 5.0 * elapsedTime;

    if(friction < 1.0){
      this.speed.mulAdd(this.speed, this.speed, -friction);
    }else{
      this.speed.setValue(0, 0, 0);
    }
    
    this.speed.mulAdd(this.speed, this.force, 5.0 * elapsedTime);
    var speedVal = this.speed.length();
    if(speedVal > this.maxSpeed){
      this.speed.mul(this.speed, this.maxSpeed / speedVal);
    }

    this.position.mulAdd(this.position, this.speed, elapsedTime);
    this.model.rootBone.offset.setValue(this.position);

    var axis = new DHVector3(0.0, 1.0, 0.0);
    if(this.force.z > 0.001 || this.force.z < -0.001){
      this.direction = Math.atan(this.force.x / this.force.z);
      if(this.force.z < 0){
        this.direction += Math.PI;
      }
    }else if(this.force.x > 0.001){
      this.direction = Math.PI * 0.5;
    }else if(this.force.x < -0.001){
      this.direction = Math.PI * -0.5;
    }
    this.model.rootBone.rotate.createAxis(axis, this.direction);
  },

  setModel: function(model) {
    if(this.model){
      this.model.destroy();
    }

    if(this.renderer && model.renderer != this.renderer){
      this.model = ModelBank.getModelForRenderer(model.hashName, this.renderer);
    }else{
      this.model = model;
    }
  },

  setMotion: function(motion) {
    this.motion = motion;
  },

  setMotionWithBlending: function(motion, blendCount) {
    this.motion = motion;
    this.motionBlendCount = 1.0;
    this.motionBlendStep = 1.0 / blendCount;
    this.model.rootBone.setBlendValueRecursive();
  },

  setRenderer: function(renderer) {
    if(this.model && this.model.renderer != renderer){
      this.model = ModelBank.getModelForRenderer(this.model.hashName, renderer);
    }
    this.renderer = renderer;
  },

  setAnimator: function(animator) {
    this.animator = animator;
  },

  setAnimationTime: function(time) {
    this.animationTime = time;
  },

  setPosition: function(x, y, z) {
    if(x instanceof DHVector3){
      this.position.x = x.x;
      this.position.y = x.y;
      this.position.z = x.z;
    }else{
      this.position.x = x;
      this.position.y = y;
      this.position.z = z;
    }
  },

  setSpeed: function(x, y, z) {
    if(x instanceof DHVector3){
      this.speed.x = x.x;
      this.speed.y = x.y;
      this.speed.z = x.z;
    }else{
      this.speed.x = x;
      this.speed.y = y;
      this.speed.z = z;
    }
  },

  setRotate: function(x, y, z, w) {
    var rot = this.model.rootBone.rotate;
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
    var scale = this.model.rootBone.scale;
    scale.x = x;
    scale.y = y;
    scale.z = z;
  },

  getSkinArray: function() {
    if(this.model){
      return this.model.getSkinArray();
    }
    return null;
  },

  getDynamicSkinArray: function() {
    if(this.model){
      return this.model.getDynamicSkinArray();
    }
    return null;
  },

  getNumElements: function() {
    if(this.model){
      return (this.model.indexArray.length / 3);
    }
    return 0;
  },

  // FIXME: implementation
  getTexture: function() {
    if(this.model){

    }
  },

  getAnimationTime: function() {
    return this.animationTime;
  },


  animate: function(elapsedTime) {
    var animationTimeBefore = this.animationTime;
    if(this.animator){
      this.animator.animate(this, elapsedTime);
    }else{
      // ボーンの行列更新のみ行う
      this.model.rootBone.updateMatrixRecursive();
    }
    var animationTimeAfter = this.animationTime;

    this.motionEventArray.each( function(me){
      if(animationTimeBefore < me.time && me.time <= animationTimeAfter){
        me.start();
      }
    });
  },

  render: function() {
    if(this.renderer)
      this.renderer.render(this);
  },

  addMotionCallback: function(func, time) {
    var motionEvent = new DHEvent();
    motionEvent.time = time;
    motionEvent.setEventCallback(func);

    this.motionEventArray.push(motionEvent);
  },

  removeMotionCallback: function(func, time) {
    var arr = this.motionEventArray;
    var target = null;
    arr.each( function(me){
      if(me.time == time && me.getEventCallback() == func){
        target = me;
        me.delete();
      }
    });
    if(target){
      this.motionEventArray = arr.without(target);
    }
  },

  clearMotionCallback: function() {
    var arr = this.motionEventArray;
    arr.each( function(me){
      me.delete();
    });
    arr.clear();
  },
});


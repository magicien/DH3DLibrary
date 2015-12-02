/*--------------------------------------------------------------------------------
 * DH3DLibrary DHVector3.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var DHVector3 = Class.create({
  x: 0.0,
  y: 0.0,
  z: 0.0,

  initialize: function(x, y, z) {
    this.setValue(x, y, z);
  },

  setValue: function(x, y, z) {
    if((x instanceof DHVector3) || (x instanceof Object && x.z != undefined)){
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    }else{
      this.x = x || 0.0;
      this.y = y || 0.0;
      this.z = z || 0.0;
    }
  },

  add: function(vec1, vec2) {
    this.x = vec1.x + vec2.x;
    this.y = vec1.y + vec2.y;
    this.z = vec1.z + vec2.z;
  },

  sub: function(vec1, vec2) {
    this.x = vec1.x - vec2.x;
    this.y = vec1.y - vec2.y;
    this.z = vec1.z - vec2.z;
  },
  
  mul: function(vec1, rate) {
    this.x = vec1.x * rate;
    this.y = vec1.y * rate;
    this.z = vec1.z * rate;
  },

  mulAdd: function(vec1, vec2, rate) {
    this.x = vec1.x + vec2.x * rate;
    this.y = vec1.y + vec2.y * rate;
    this.z = vec1.z + vec2.z * rate;
  },

  normalize: function(src) {
    if(src == undefined)
      src = this;

    var square = 1.0 / Math.sqrt(src.x * src.x + src.y * src.y + src.z * src.z);

    this.x = src.x * square;
    this.y = src.y * square;
    this.z = src.z * square;
  },

  dot: function(vec) {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z;
  },

  cross: function(vec1, vec2) {
    var rx, ry, rz;
    rx = vec1.y * vec2.z - vec1.z * vec2.y;
    ry = vec1.z * vec2.x - vec1.x * vec2.z;
    rz = vec1.x * vec2.y - vec1.y * vec2.x;
    this.x = rx;
    this.y = ry;
    this.z = rz;
  },

  lerp: function(vec1, vec2, rate) {
    this.x = vec1.x + rate * (vec2.x - vec1.x);
    this.y = vec1.y + rate * (vec2.y - vec1.y);
    this.z = vec1.z + rate * (vec2.z - vec1.z);
  },

  transform: function(vec, matrix){
    var rx, ry, rz;
    rx = vec.x * matrix.m11 + vec.y * matrix.m21 + vec.z * matrix.m31 + matrix.m41;
    ry = vec.x * matrix.m12 + vec.y * matrix.m22 + vec.z * matrix.m32 + matrix.m42;
    rz = vec.x * matrix.m13 + vec.y * matrix.m23 + vec.z * matrix.m33 + matrix.m43;

    this.x = rx;
    this.y = ry;
    this.z = rz;
  },

  rotate: function(vec, matrix){
    var rx, ry, rz;

    rx = vec.x * matrix.m11 + vec.y * matrix.m21 + vec.z * matrix.m31;
    ry = vec.x * matrix.m12 + vec.y * matrix.m22 + vec.z * matrix.m32;
    rz = vec.x * matrix.m13 + vec.y * matrix.m23 + vec.z * matrix.m33;

    this.x = rx;
    this.y = ry;
    this.z = rz;
  },

  quaternionToEuler: function(quat) {
    var x2 = quat.x + quat.x;
    var y2 = quat.y + quat.y;
    var z2 = quat.z + quat.z;
    var xz2 = quat.x * z2;
    var wy2 = quat.w * y2;
    var temp = -(xz2 - wy2);

    if(temp >= 1.0){
      temp = 1.0;
    }else if(temp <= -1.0){
      temp = -1.0;
    }

    var yRadian = Math.sin(temp);
    var xx2 = quat.x * x2;
    var xy2 = quat.x * y2;
    var zz2 = quat.z * z2;
    var wz2 = quat.w * z2;

    if(yRadian < Math.PI * 0.5){
      if(yRadian > -Math.PI * 0.5){
        var yz2 = quat.y * z2;
        var wx2 = quat.w * x2;
        var yy2 = quat.y * y2;
        this.x = Math.atan2(yz2 + wx2, 1.0 - (xx2 + yy2));
        this.y = yRadian;
        this.z = Math.atan2(xy2 + wz2, 1.0 - (xx2 + zz2));
      }else{
        this.x = -Math.atan2(xy2 - wz2, 1.0 - (xx2 + zz2));
        this.y = yRadian;
        this.z = 0;
      }
    }else{
      this.x = Math.atan2(xy2 - wz2, 1.0 - (xx2 + zz2));
      this.y = yRadian;
      this.z = 0;
    }
  },

  length: function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  },

  getWebGLFloatArray: function() {
    return new Float32Array([
      this.x, this.y, this.z
    ]);
  },
});


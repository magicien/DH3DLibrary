/*--------------------------------------------------------------------------------
 * DH3DLibrary DHVector4.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var DHVector4 = Class.create({
  x: 0.0,
  y: 0.0,
  z: 0.0,
  w: 0.0,

  initialize: function(x, y, z, w) {
    this.setValue(x, y, z, w);
  },

  setValue: function(x, y, z, w) {
    if((x instanceof DHVector4) || (x instanceof Object && x.w != undefined)){
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
      this.w = x.w;
    }else{
      this.x = x || 0.0;
      this.y = y || 0.0;
      this.z = z || 0.0;
      this.w = w || 0.0;
    }
  },

  lerp: function(src1, src2, rate) {
    this.x = src1.x + rate * (src2.x - src1.x);
    this.y = src1.y + rate * (src2.y - src1.y);
    this.z = src1.z + rate * (src2.z - src1.z);
    this.w = src1.w + rate * (src2.w - src1.w);
  },

  slerp: function(src1, src2, rate) {
    var qr = src1.x * src2.x + src1.y * src2.y + src1.z * src2.z + src1.w * src2.w;

    if(qr < 0){
      this.x = src1.x - (src1.x + src2.x) * rate;
      this.y = src1.y - (src1.y + src2.y) * rate;
      this.z = src1.z - (src1.z + src2.z) * rate;
      this.w = src1.w - (src1.w + src2.w) * rate;
    }else{
      this.x = src1.x + (src2.x - src1.x) * rate;
      this.y = src1.y + (src2.y - src1.y) * rate;
      this.z = src1.z + (src2.z - src1.z) * rate;
      this.w = src1.w + (src2.w - src1.w) * rate;
    }
    this.normalize();
  },


  ln: function(src) {
    var v = new DHVector4();
    v.normalize(src);

    var n = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    if(n == 0){
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 0;
      return;
    }
    var theta = Math.atan2(n, v.w) / n;

    this.x = theta * v.x;
    this.y = theta * v.y;
    this.z = theta * v.z;
    this.w = 0;
  },

  exp: function(src) {
    var n = Math.sqrt(src.x * src.x + src.y * src.y + src.z * src.z);
    
    if(n > 0.0){
      var sinn = Math.sin(n);
      this.x = sinn * src.x / n;
      this.y = sinn * src.y / n;
      this.z = sinn * src.z / n;
      this.w = Math.cos(n);
    }else{
      this.x = 0.0;
      this.y = 0.0;
      this.z = 0.0;
      this.w = 1.0;
    }
  },

  normalize: function(src) {
    if(src == undefined)
      src = this;

    var square = 1.0 / Math.sqrt(src.x * src.x + src.y * src.y + src.z * src.z + src.w * src.w);

    this.x = src.x * square;
    this.y = src.y * square;
    this.z = src.z * square;
    this.w = src.w * square;
  },

  createAxis: function(axis, rotAngle) {
    if(Math.abs(rotAngle) < 0.0001){
      this.x = 0.0;
      this.y = 0.0;
      this.z = 0.0;
      this.w = 1.0;
    }else{
      rotAngle *= 0.5;
      var temp = Math.sin(rotAngle);

      this.x = axis.x * temp;
      this.y = axis.y * temp;
      this.z = axis.z * temp;
      this.w = Math.cos(rotAngle);
    }
  },

  cross: function(src1, src2) {
    var x = src1.w * src2.x + src1.x * src2.w + src1.y * src2.z - src1.z * src2.y;
    var y = src1.w * src2.y - src1.x * src2.z + src1.y * src2.w + src1.z * src2.x;
    var z = src1.w * src2.z + src1.x * src2.y - src1.y * src2.x + src1.z * src2.w;
    var w = src1.w * src2.w - src1.x * src2.x - src1.y * src2.y - src1.z * src2.z;

    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  },

  eulerToQuaternion: function(eulerAngle) {
    var xRadian = eulerAngle.x * 0.5;
    var yRadian = eulerAngle.y * 0.5;
    var zRadian = eulerAngle.z * 0.5;
    var sinX = Math.sin(xRadian);
    var cosX = Math.cos(xRadian);
    var sinY = Math.sin(yRadian);
    var cosY = Math.cos(yRadian);
    var sinZ = Math.sin(zRadian);
    var cosZ = Math.cos(zRadian);

    this.x = sinX * cosY * cosZ - cosX * sinY * sinZ;
    this.y = cosX * sinY * cosZ + sinX * cosY * sinZ;
    this.z = cosX * cosY * sinZ - sinX * sinY * cosZ;
    this.w = cosX * cosY * cosZ + sinX * sinY * sinZ;
  },

  transform: function(vec, matrix){
    var rx, ry, rz, rw;
    rx = vec.x * matrix.m11 + vec.y * matrix.m21 + vec.z * matrix.m31 + vec.w * matrix.m41;
    ry = vec.x * matrix.m12 + vec.y * matrix.m22 + vec.z * matrix.m32 + vec.w * matrix.m42;
    rz = vec.x * matrix.m13 + vec.y * matrix.m23 + vec.z * matrix.m33 + vec.w * matrix.m43;
    rw = vec.x * matrix.m14 + vec.y * matrix.m24 + vec.z * matrix.m34 + vec.w * matrix.m44;

    this.x = rx;
    this.y = ry;
    this.z = rz;
    this.w = rw;
  },

  quaternionFromMatrix: function(mat) {
    var mx = mat.m11 - mat.m22 - mat.m33;
    var my = mat.m22 - mat.m11 - mat.m33;
    var mz = mat.m33 - mat.m11 - mat.m22;
    var mw = mat.m11 + mat.m22 + mat.m33;

    var biggestIndex = 0;
    var mval = mw;
    if(mx > mval) {
      mval = mx;
      biggestIndex = 1;
    }
    if(my > mval) {
      mval = my;
      biggestIndex = 2;
    }
    if(mz > mval) {
      mval = mz;
      biggestIndex = 3;
    }

    var biggestVal = Math.sqrt(mval + 1.0) * 0.5;
    var mult = 0.25 / biggestVal;

    switch(biggestIndex) {
      case 0:
        this.x = (mat.m23 - mat.m32) * mult;
        this.y = (mat.m31 - mat.m13) * mult;
        this.z = (mat.m12 - mat.m21) * mult;
        this.w = biggestVal;
        break;
      case 1:
        this.x = biggestVal;
        this.y = (mat.m12 + mat.m21) * mult;
        this.z = (mat.m31 + mat.m13) * mult;
        this.w = (mat.m23 - mat.m32) * mult;
        break;
      case 2:
        this.x = (mat.m12 + mat.m21) * mult;
        this.y = biggestVal;
        this.z = (mat.m23 + mat.m32) * mult;
        this.w = (mat.m31 - mat.m13) * mult;
        break;
      case 3:
        this.x = (mat.m31 * mat.m13) * mult;
        this.y = (mat.m23 * mat.m32) * mult;
        this.z = biggestVal;
        this.w = (mat.m12 - mat.m21) * mult;
        break;
    }
  },

  getWebGLFloatArray: function() {
    return new Float32Array([
      this.x, this.y, this.z, this.w
    ]);
  },

});


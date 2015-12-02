/*--------------------------------------------------------------------------------
 * DH3DLibrary DHMatrix.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var DHMatrix = Class.create({
  m11: 1.0,
  m12: 0.0,
  m13: 0.0,
  m14: 0.0,
  m21: 0.0,
  m22: 1.0,
  m23: 0.0,
  m24: 0.0,
  m31: 0.0,
  m32: 0.0,
  m33: 1.0,
  m34: 0.0,
  m41: 0.0,
  m42: 0.0,
  m43: 0.0,
  m44: 1.0,

  initialize: function(matrix) {

    if(matrix instanceof DHMatrix){
      this.m11 = matrix.m11;
      this.m12 = matrix.m12;
      this.m13 = matrix.m13;
      this.m14 = matrix.m14;
      this.m21 = matrix.m21;
      this.m22 = matrix.m22;
      this.m23 = matrix.m23;
      this.m24 = matrix.m24;
      this.m31 = matrix.m31;
      this.m32 = matrix.m32;
      this.m33 = matrix.m33;
      this.m34 = matrix.m34;
      this.m41 = matrix.m41;
      this.m42 = matrix.m42;
      this.m43 = matrix.m43;
      this.m44 = matrix.m44;
    }else if(typeof matrix == 'object') {
      if('length' in matrix && matrix.length >= 16){
        this.m11 = matrix[ 0];
        this.m12 = matrix[ 1];
        this.m13 = matrix[ 2];
        this.m14 = matrix[ 3];
        this.m21 = matrix[ 4];
        this.m22 = matrix[ 5];
        this.m23 = matrix[ 6];
        this.m24 = matrix[ 7];
        this.m31 = matrix[ 8];
        this.m32 = matrix[ 9];
        this.m33 = matrix[10];
        this.m34 = matrix[11];
        this.m41 = matrix[12];
        this.m42 = matrix[13];
        this.m43 = matrix[14];
        this.m44 = matrix[15];
      }
    }
  },

  identity: function() {
    this.copyMatrix(_identityMatrix);
  },

  multiplyMatrix: function(src1, src2) {
    var m11 = src1.m11 * src2.m11 + src1.m12 * src2.m21 + src1.m13 * src2.m31 + src1.m14 * src2.m41;
    var m12 = src1.m11 * src2.m12 + src1.m12 * src2.m22 + src1.m13 * src2.m32 + src1.m14 * src2.m42;
    var m13 = src1.m11 * src2.m13 + src1.m12 * src2.m23 + src1.m13 * src2.m33 + src1.m14 * src2.m43;
    var m14 = src1.m11 * src2.m14 + src1.m12 * src2.m24 + src1.m13 * src2.m34 + src1.m14 * src2.m44;
    var m21 = src1.m21 * src2.m11 + src1.m22 * src2.m21 + src1.m23 * src2.m31 + src1.m24 * src2.m41;
    var m22 = src1.m21 * src2.m12 + src1.m22 * src2.m22 + src1.m23 * src2.m32 + src1.m24 * src2.m42;
    var m23 = src1.m21 * src2.m13 + src1.m22 * src2.m23 + src1.m23 * src2.m33 + src1.m24 * src2.m43;
    var m24 = src1.m21 * src2.m14 + src1.m22 * src2.m24 + src1.m23 * src2.m34 + src1.m24 * src2.m44;
    var m31 = src1.m31 * src2.m11 + src1.m32 * src2.m21 + src1.m33 * src2.m31 + src1.m34 * src2.m41;
    var m32 = src1.m31 * src2.m12 + src1.m32 * src2.m22 + src1.m33 * src2.m32 + src1.m34 * src2.m42;
    var m33 = src1.m31 * src2.m13 + src1.m32 * src2.m23 + src1.m33 * src2.m33 + src1.m34 * src2.m43;
    var m34 = src1.m31 * src2.m14 + src1.m32 * src2.m24 + src1.m33 * src2.m34 + src1.m34 * src2.m44;
    var m41 = src1.m41 * src2.m11 + src1.m42 * src2.m21 + src1.m43 * src2.m31 + src1.m44 * src2.m41;
    var m42 = src1.m41 * src2.m12 + src1.m42 * src2.m22 + src1.m43 * src2.m32 + src1.m44 * src2.m42;
    var m43 = src1.m41 * src2.m13 + src1.m42 * src2.m23 + src1.m43 * src2.m33 + src1.m44 * src2.m43;
    var m44 = src1.m41 * src2.m14 + src1.m42 * src2.m24 + src1.m43 * src2.m34 + src1.m44 * src2.m44;

    this.m11 = m11;
    this.m12 = m12;
    this.m13 = m13;
    this.m14 = m14;
    this.m21 = m21;
    this.m22 = m22;
    this.m23 = m23;
    this.m24 = m24;
    this.m31 = m31;
    this.m32 = m32;
    this.m33 = m33;
    this.m34 = m34;
    this.m41 = m41;
    this.m42 = m42;
    this.m43 = m43;
    this.m44 = m44;
  },

  lerp: function(src1, src2, rate) {
    this.m11 = src1.m11 + rate * (src1.m11 - src2.m11);
    this.m12 = src1.m12 + rate * (src1.m12 - src2.m12);
    this.m13 = src1.m13 + rate * (src1.m13 - src2.m13);
    this.m14 = src1.m14 + rate * (src1.m14 - src2.m14);
    this.m21 = src1.m21 + rate * (src1.m21 - src2.m21);
    this.m22 = src1.m22 + rate * (src1.m22 - src2.m22);
    this.m23 = src1.m23 + rate * (src1.m23 - src2.m23);
    this.m24 = src1.m24 + rate * (src1.m24 - src2.m24);
    this.m31 = src1.m31 + rate * (src1.m31 - src2.m31);
    this.m32 = src1.m32 + rate * (src1.m32 - src2.m32);
    this.m33 = src1.m33 + rate * (src1.m33 - src2.m33);
    this.m34 = src1.m34 + rate * (src1.m34 - src2.m34);
    this.m41 = src1.m41 + rate * (src1.m41 - src2.m41);
    this.m42 = src1.m42 + rate * (src1.m42 - src2.m42);
    this.m43 = src1.m43 + rate * (src1.m43 - src2.m43);
    this.m44 = src1.m44 + rate * (src1.m44 - src2.m44);
  },

  matrixFromQuaternion: function(quat) {
    var x2 = quat.x * quat.x * 2.0;
    var y2 = quat.y * quat.y * 2.0;
    var z2 = quat.z * quat.z * 2.0;
    var xy = quat.x * quat.y * 2.0;
    var yz = quat.y * quat.z * 2.0;
    var zx = quat.z * quat.x * 2.0;
    var xw = quat.x * quat.w * 2.0;
    var yw = quat.y * quat.w * 2.0;
    var zw = quat.z * quat.w * 2.0;

    this.m11 = 1.0 - y2 - z2;
    this.m12 = xy + zw;
    this.m13 = zx - yw;
    this.m14 = 0.0;
    this.m21 = xy - zw;
    this.m22 = 1.0 - z2 - x2;
    this.m23 = yz + xw;
    this.m24 = 0.0;
    this.m31 = zx + yw;
    this.m32 = yz - xw;
    this.m33 = 1.0 - x2 - y2;
    this.m34 = 0.0;
    this.m41 = 0.0;
    this.m42 = 0.0;
    this.m43 = 0.0;
    this.m44 = 1.0;
  },

  copyMatrix: function(src) {
    this.m11 = src.m11;
    this.m12 = src.m12;
    this.m13 = src.m13;
    this.m14 = src.m14;
    this.m21 = src.m21;
    this.m22 = src.m22;
    this.m23 = src.m23;
    this.m24 = src.m24;
    this.m31 = src.m31;
    this.m32 = src.m32;
    this.m33 = src.m33;
    this.m34 = src.m34;
    this.m41 = src.m41;
    this.m42 = src.m42;
    this.m43 = src.m43;
    this.m44 = src.m44;
  },

  inverseMatrix: function(src) {
    var temp = new DHMatrix(src);
    var buf;
    var w1 = Math.abs(temp.m11);
    var w2 = Math.abs(temp.m21);
    var w3 = Math.abs(temp.m31);
    var w4 = Math.abs(temp.m41);
    var max = w1 > w2 ? w1 : w2;
    if(max < w3) max = w3;

    this.identity();
    // 1
    if(max < w4){
      buf = 1.0 / temp.m41;
      w1 = temp.m11;
      w2 = temp.m12;
      w3 = temp.m13;
      w4 = temp.m14;
      temp.m12 = temp.m42 * buf;
      temp.m13 = temp.m43 * buf;
      temp.m14 = temp.m44 * buf;
      temp.m41 = w1;
      temp.m42 = w2;
      temp.m43 = w3;
      temp.m44 = w4;
      this.m11 = 0.0;
      this.m14 = buf;
      this.m41 = 1.0;
      this.m44 = 0.0;
    }else if(max == w1){
      buf = 1.0 / temp.m11;
      temp.m12 *= buf;
      temp.m13 *= buf;
      temp.m14 *= buf;
      this.m11 = buf;
    }else if(max == w2){
      buf = 1.0 / temp.m21;
      w1 = temp.m11;
      w2 = temp.m12;
      w3 = temp.m13;
      w4 = temp.m14;
      temp.m12 = temp.m22 * buf;
      temp.m13 = temp.m23 * buf;
      temp.m14 = temp.m24 * buf;
      temp.m21 = w1;
      temp.m22 = w2;
      temp.m23 = w3;
      temp.m24 = w4;
      this.m11 = 0.0;
      this.m12 = buf;
      this.m21 = 1.0;
      this.m22 = 0.0;
    }else{
      buf = 1.0 / temp.m31;
      w1 = temp.m11;
      w2 = temp.m12;
      w3 = temp.m13;
      w4 = temp.m14;
      temp.m12 = temp.m32 * buf;
      temp.m13 = temp.m33 * buf;
      temp.m14 = temp.m34 * buf;
      temp.m31 = w1;
      temp.m32 = w2;
      temp.m33 = w3;
      temp.m34 = w4;
      this.m11 = 0.0;
      this.m13 = buf;
      this.m31 = 1.0;
      this.m33 = 0.0;
    }

    buf = temp.m21;
    temp.m22 -= temp.m12 * buf;
    temp.m23 -= temp.m13 * buf;
    temp.m24 -= temp.m14 * buf;
    this.m21 -= this.m11 * buf;
    this.m22 -= this.m12 * buf;
    this.m23 -= this.m13 * buf;
    this.m24 -= this.m14 * buf;

    buf = temp.m31;
    temp.m32 -= temp.m12 * buf;
    temp.m33 -= temp.m13 * buf;
    temp.m34 -= temp.m14 * buf;
    this.m31 -= this.m11 * buf;
    this.m32 -= this.m12 * buf;
    this.m33 -= this.m13 * buf;
    this.m34 -= this.m14 * buf;

    buf = temp.m41;
    temp.m42 -= temp.m12 * buf;
    temp.m43 -= temp.m13 * buf;
    temp.m44 -= temp.m14 * buf;
    this.m41 -= this.m11 * buf;
    this.m42 -= this.m12 * buf;
    this.m43 -= this.m13 * buf;
    this.m44 -= this.m14 * buf;

    // 2
    w2 = Math.abs(temp.m22);
    w3 = Math.abs(temp.m32);
    w4 = Math.abs(temp.m42);
    max = w2 > w3 ? w2 : w3;
    if(max < w4){
      buf = 1.0 / temp.m42;
      w2 = temp.m22;
      w3 = temp.m23;
      w4 = temp.m24;
      temp.m23 = temp.m43 * buf;
      temp.m24 = temp.m44 * buf;
      temp.m42 = w2;
      temp.m43 = w3;
      temp.m44 = w4;
      w1 = this.m21;
      w2 = this.m22;
      w3 = this.m23;
      w4 = this.m24;
      this.m21 = this.m41 * buf;
      this.m22 = this.m42 * buf;
      this.m23 = this.m43 * buf;
      this.m24 = this.m44 * buf;
      this.m41 = w1;
      this.m42 = w2;
      this.m43 = w3;
      this.m44 = w4;
    }else if(w2 > w3){
      buf = 1.0 / temp.m22;
      temp.m23 *= buf;
      temp.m24 *= buf;
      this.m21 *= buf;
      this.m22 *= buf;
      this.m23 *= buf;
      this.m24 *= buf;
    }else{
      buf = 1.0 / temp.m32;
      w2 = temp.m22;
      w3 = temp.m23;
      w4 = temp.m24;
      temp.m23 = temp.m33 * buf;
      temp.m24 = temp.m34 * buf;
      temp.m32 = w2;
      temp.m33 = w3;
      temp.m34 = w4;
      w1 = this.m21;
      w2 = this.m22;
      w3 = this.m23;
      w4 = this.m24;
      this.m21 = this.m31 * buf;
      this.m22 = this.m32 * buf;
      this.m23 = this.m33 * buf;
      this.m24 = this.m34 * buf;
      this.m31 = w1;
      this.m32 = w2;
      this.m33 = w3;
      this.m34 = w4;
    }

    buf = temp.m12;
    temp.m13 -= temp.m23 * buf;
    temp.m14 -= temp.m24 * buf;
    this.m11 -= this.m21 * buf;
    this.m12 -= this.m22 * buf;
    this.m13 -= this.m23 * buf;
    this.m14 -= this.m24 * buf;

    buf = temp.m32;
    temp.m33 -= temp.m23 * buf;
    temp.m34 -= temp.m24 * buf;
    this.m31 -= this.m21 * buf;
    this.m32 -= this.m22 * buf;
    this.m33 -= this.m23 * buf;
    this.m34 -= this.m24 * buf;

    buf = temp.m42;
    temp.m43 -= temp.m23 * buf;
    temp.m44 -= temp.m24 * buf;
    this.m41 -= this.m21 * buf;
    this.m42 -= this.m22 * buf;
    this.m43 -= this.m23 * buf;
    this.m44 -= this.m24 * buf;

    // 3
    if(Math.abs(temp.m33) > Math.abs(temp.m43)){
      buf = 1.0 / temp.m33;
      temp.m34 *= buf;
      this.m31 *= buf;
      this.m32 *= buf;
      this.m33 *= buf;
      this.m34 *= buf;
    }else{
      buf = 1.0 / temp.m43;
      w3 = temp.m33;
      w4 = temp.m34;
      temp.m34 = temp.m44 * buf;
      temp.m43 = w3;
      temp.m44 = w4;
      w1 = this.m31;
      w2 = this.m32;
      w3 = this.m33;
      w4 = this.m34;
      this.m31 = this.m41 * buf;
      this.m32 = this.m42 * buf;
      this.m33 = this.m43 * buf;
      this.m34 = this.m44 * buf;
      this.m41 = w1;
      this.m42 = w2;
      this.m43 = w3;
      this.m44 = w4;
    }
    buf = temp.m13;
    temp.m14 -= temp.m34 * buf;
    this.m11 -= this.m31 * buf;
    this.m12 -= this.m32 * buf;
    this.m13 -= this.m33 * buf;
    this.m14 -= this.m34 * buf;

    buf = temp.m23;
    temp.m24 -= temp.m34 * buf;
    this.m21 -= this.m31 * buf;
    this.m22 -= this.m32 * buf;
    this.m23 -= this.m33 * buf;
    this.m24 -= this.m34 * buf;

    buf = temp.m43;
    temp.m44 -= temp.m34 * buf;
    this.m41 -= this.m31 * buf;
    this.m42 -= this.m32 * buf;
    this.m43 -= this.m33 * buf;
    this.m44 -= this.m34 * buf;

    // 4
    buf = 1.0 / temp.m44;
    this.m41 *= buf;
    this.m42 *= buf;
    this.m43 *= buf;
    this.m44 *= buf;

    buf = temp.m14;
    this.m11 -= this.m41 * buf;
    this.m12 -= this.m42 * buf;
    this.m13 -= this.m43 * buf;
    this.m14 -= this.m44 * buf;

    buf = temp.m24;
    this.m21 -= this.m41 * buf;
    this.m22 -= this.m42 * buf;
    this.m23 -= this.m43 * buf;
    this.m24 -= this.m44 * buf;

    buf = temp.m34;
    this.m31 -= this.m41 * buf;
    this.m32 -= this.m42 * buf;
    this.m33 -= this.m43 * buf;
    this.m34 -= this.m44 * buf;
  },

  transposeMatrix: function(src) {
    this.m11 = src.m11;
    this.m12 = src.m21;
    this.m13 = src.m31;
    this.m14 = src.m41;
    this.m21 = src.m12;
    this.m22 = src.m22;
    this.m23 = src.m32;
    this.m24 = src.m42;
    this.m31 = src.m13;
    this.m32 = src.m23;
    this.m33 = src.m33;
    this.m34 = src.m43;
    this.m41 = src.m14;
    this.m42 = src.m24;
    this.m43 = src.m34;
    this.m44 = src.m44;
  },

  scale: function(mat, x, y, z) {
    if(!(mat instanceof Object) && z == null){
      z = y;
      y = x;
      x = mat;
      mat = this;
    }

    var r = new DHMatrix();
    r.identity();
    r.m11 = x;
    r.m22 = y;
    r.m33 = z;

    this.multiplyMatrix(mat, r);
  },

  translate: function(mat, x, y, z) {
    var r = new DHMatrix();
    r.identity();
    r.m14 = x;
    r.m24 = y;
    r.m34 = z;

    this.multiplyMatrix(mat, r);
  },

  rotate: function(mat, angle, x, y, z){
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var v = new DHVector3(x, y, z);
    var r = new DHMatrix();

    v.normalize();
    x = v.x;
    y = v.y;
    z = v.z;

    r.m11 = x * x * (1.0-c) + c;
    r.m12 = x * y * (1.0-c) - z * s;
    r.m13 = x * z * (1.0-c) + y * s;
    r.m14 = 0.0;
    r.m21 = y * x * (1.0-c) + z * s;
    r.m22 = y * y * (1.0-c) + c;
    r.m23 = y * z * (1.0-c) - x * s;
    r.m24 = 0.0;
    r.m31 = z * x * (1.0-c) - y * s;
    r.m32 = z * y * (1.0-c) + x * s;
    r.m33 = z * z * (1.0-c) + c;
    r.m34 = 0.0;
    r.m41 = 0.0;
    r.m42 = 0.0;
    r.m43 = 0.0;
    r.m44 = 1.0;

    this.multiplyMatrix(mat, r);
  },

  getWebGLFloatArray: function() {
    return new Float32Array([
      this.m11, this.m12, this.m13, this.m14,
      this.m21, this.m22, this.m23, this.m24,
      this.m31, this.m32, this.m33, this.m34,
      this.m41, this.m42, this.m43, this.m44
    ]);
  },
  getWebGLFloatArrayTransposed: function() {
    return new Float32Array([
      this.m11, this.m21, this.m31, this.m41,
      this.m12, this.m22, this.m32, this.m42,
      this.m13, this.m23, this.m33, this.m43,
      this.m14, this.m24, this.m34, this.m44
    ]);
  },

  getArray: function() {
    return $A([
      this.m11, this.m12, this.m13, this.m14,
      this.m21, this.m22, this.m23, this.m24,
      this.m31, this.m32, this.m33, this.m34,
      this.m41, this.m42, this.m43, this.m44
    ]);
  },

  // for test
  showMatrix: function() {
    log("matrix:<br />\n"
       + this.m11 + " " + this.m12 + " " + this.m13 + " " + this.m14 + "<br />\n"
       + this.m21 + " " + this.m22 + " " + this.m23 + " " + this.m24 + "<br />\n"
       + this.m31 + " " + this.m32 + " " + this.m33 + " " + this.m34 + "<br />\n"
       + this.m41 + " " + this.m42 + " " + this.m43 + " " + this.m44 + "<br />\n"
    );
  },
});

var _identityMatrix = new DHMatrix([1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0]);

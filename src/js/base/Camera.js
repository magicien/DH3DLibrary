/*--------------------------------------------------------------------------------
 * DH3DLibrary Camera.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var Camera = Class.create({
  position: null,
  projMat: null,
  viewMat: null,

  // bind to DH3DObject
  bindObj: null,
  distance: 20.0,
  bindXAngle: 0.0,
  bindYAngle: 0.0,
  bindOffset: null,

  // 作業用
  projViewMat: null,

  initialize: function() {
    this.position = new DHVector3();
    this.projMat = new DHMatrix();
    this.viewMat = new DHMatrix();
    this.projViewMat = new DHMatrix();
    this.identity();

    this.bindOffset = new DHVector3();
  },

  identity: function() {
    this.position.setValue(0, 0, 0);
    this.projMat.identity();
    this.viewMat.identity();
  },

  setPosition: function(x, y, z) {
    this.translate(x - this.position.x, y - this.position.y, z - this.position.z);
  },

  translate: function(x, y, z) {
    this.viewMat.translate(this.viewMat, -x, -y, -z);
    this.position.x += x;
    this.position.y += y;
    this.position.z += z;
  },

  rotate: function(angle, x, y, z) {
    this.viewMat.rotate(this.viewMat, angle, x, y, z);
  },

  scale: function(x, y, z) {
    this.viewMat.scale(this.viewMat, x, y, z);
  },

  scaleProjection: function(x, y, z) {
    this.projMat.scale(this.projMat, x, y, z);
  },

  lookat: function(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
    var s = new DHVector3();
    var u = new DHVector3();
    var f = new DHVector3();
    var up = new DHVector3();
    var mat = new DHMatrix();

    f.x = centerX - eyeX;
    f.y = centerY - eyeY;
    f.z = centerZ - eyeZ;
    f.normalize();

    up.x = upX;
    up.y = upY;
    up.z = upZ;
    //up.normalize();

    s.cross(f, up);
    u.cross(s, f);

    s.normalize();
    u.normalize();

    mat.m11 = s.x;
    mat.m12 = s.y;
    mat.m13 = s.z;
    mat.m14 = 0;
    mat.m21 = u.x;
    mat.m22 = u.y;
    mat.m23 = u.z;
    mat.m24 = 0;
    mat.m31 = -f.x;
    mat.m32 = -f.y;
    mat.m33 = -f.z;
    mat.m34 = 0;
    mat.m41 = 0;
    mat.m42 = 0;
    mat.m43 = 0;
    mat.m44 = 1;

    this.viewMat = mat;
    this.viewMat.translate(this.viewMat, -eyeX, -eyeY, -eyeZ);
    this.position.setValue(eyeX, eyeY, eyeZ);
  },

  frustum: function(left, right, bottom, top, nearVal, farVal) {
    var mat = new DHMatrix();

    mat.m11 = 2 * nearVal / (right - left);
    mat.m12 = 0;
    mat.m13 = (right + left) / (right - left);
    mat.m14 = 0;
    mat.m21 = 0;
    mat.m22 = 2 * nearVal / (top - bottom);
    mat.m23 = (top + bottom) / (top - bottom);
    mat.m24 = 0;
    mat.m31 = 0;
    mat.m32 = 0;
    mat.m33 = -(farVal + nearVal) / (farVal - nearVal);
    mat.m34 = -2 * farVal * nearVal / (farVal - nearVal);
    mat.m41 = 0;
    mat.m42 = 0;
    mat.m43 = -1;
    mat.m44 = 0;

    this.projMat = mat;
  },

  perspective: function(fovy, aspect, nearVal, farVal) {
    var mat = new DHMatrix();
    var cot = 1.0 / Math.tan(fovy * Math.PI / 360.0);

    mat.m11 = cot / aspect;
    mat.m12 = 0;
    mat.m13 = 0;
    mat.m14 = 0;
    mat.m21 = 0;
    mat.m22 = cot;
    mat.m23 = 0;
    mat.m24 = 0;
    mat.m31 = 0;
    mat.m32 = 0;
    mat.m33 = -(farVal + nearVal) / (farVal - nearVal);
    mat.m34 = -2 * farVal * nearVal / (farVal - nearVal);
    mat.m41 = 0;
    mat.m42 = 0;
    mat.m43 = -1;
    mat.m44 = 0;

    this.projMat = mat;
  },

  ortho: function(left, right, bottom, top, nearVal, farVal) {
    var mat = new DHMatrix();
    mat.m11 = 2 / (right - left);
    mat.m12 = 0;
    mat.m13 = 0;
    mat.m14 = -(right + left) / (right - left);
    mat.m21 = 0;
    mat.m22 = 2 / (top - bottom);
    mat.m23 = 0;
    mat.m24 = -(top + bottom) / (top - bottom);
    mat.m31 = 0;
    mat.m32 = 0;
    mat.m33 = -2 / (farVal - nearVal);
    mat.m34 = -(farVal + nearVal) / (farVal - nearVal);
    mat.m41 = 0;
    mat.m42 = 0;
    mat.m43 = 0;
    mat.m44 = 1;

    this.projMat = mat;
  },


  getProjectionArray: function() {
    return this.projMat.getWebGLFloatArray();
  },

  getViewArray: function() {
    return this.viewMat.getWebGLFloatArray();
  },

  getProjectionViewMatrix: function() {
    this.projViewMat.multiplyMatrix(this.projMat, this.viewMat);
    return this.projViewMat.getWebGLFloatArrayTransposed();
  },

  getNormalMatrix: function() {
    // モデルビュー行列の左上3x3の逆転置行列
    var m = this.viewMat;
    var buf;
    var m11 = m.m11; var m12 = m.m12; var m13 = m.m13;
    var m21 = m.m21; var m22 = m.m22; var m23 = m.m23;
    var m31 = m.m31; var m32 = m.m32; var m33 = m.m33;
    var r11 = 1.0;   var r12 = 0.0;   var r13 = 0.0;
    var r21 = 0.0;   var r22 = 1.0;   var r23 = 0.0;
    var r31 = 0.0;   var r32 = 0.0;   var r33 = 1.0;

    var w1 = Math.abs(m11);
    var w2 = Math.abs(m21);
    var w3 = Math.abs(m31);
    var max = w1 > w2 ? w1 : w2;

    if(max < w3){
      buf = 1.0 / m31;
      // m
      w1 = m11;
      w2 = m12;
      w3 = m13;
      // m11 = 1.0
      m12 = m32 * buf;
      m13 = m33 * buf;
      m31 = w1;
      m32 = w2;
      m33 = w3;
      // r
      r11 = 0.0;
      r13 = buf;
      r31 = 1.0;
      r33 = 0.0;
    }else if(w1 < w2){
      buf = 1.0 / m21;
      // m
      w1 = m11;
      w2 = m12;
      w3 = m13;
      // m11 = 1.0;
      m12 = m22 * buf;
      m13 = m23 * buf;
      m21 = w1;
      m22 = w2;
      m23 = w3;
      // r
      r11 = 0.0;
      r12 = buf;
      r21 = 1.0;
      r22 = 0.0;
    }else{
      buf = 1.0 / m11;
      m12 *= buf;
      m13 *= buf;
      r11 = buf;
    }
    m22 -= m12 * m21;
    m23 -= m13 * m21;
    r21 -= r11 * m21;
    r22 -= r12 * m21;
    r23 -= r13 * m21;

    m32 -= m12 * m31;
    m33 -= m13 * m31;
    r31 -= r11 * m31;
    r32 -= r12 * m31;
    r33 -= r13 * m31;

    if(Math.abs(m22) > Math.abs(m32)){
      buf = 1.0 / m22;
      // m
      // m22 = 1.0;
      m23 *= buf;
      r21 *= buf;
      r22 *= buf;
      r23 *= buf;
    }else{
      but = 1.0 / m32;
      w2 = m22;
      w3 = m23;
      // m22 = 1.0;
      m23 = m33 * buf;
      m32 = w2;
      m33 = w3;
      w1 = r21;
      w2 = r22;
      w3 = r23;
      r21 = r31 * buf;
      r22 = r32 * buf;
      r23 = r33 * buf;
      r31 = w1;
      r32 = w2;
      r33 = w3;
    }
    m13 -= m23 * m12;
    r11 -= r21 * m12;
    r12 -= r22 * m12;
    r13 -= r23 * m12;

    m33 -= m23 * m32;
    r31 -= r21 * m32;
    r32 -= r22 * m32;
    r33 -= r23 * m32;


    buf = 1.0 / m33;
    r31 *= buf;
    r32 *= buf;
    r33 *= buf;

    r11 -= r31 * m13;
    r12 -= r32 * m13;
    r13 -= r33 * m13;

    r21 -= r31 * m23;
    r22 -= r32 * m23;
    r23 -= r33 * m23;

    return new Float32Array([
      r11, r21, r31,
      r12, r22, r32,
      r13, r23, r33
    ]);
  },

  getPosition: function() {
    return this.position.getWebGLFloatArray();
  },

  getScreenPosition: function(pos) {
    var sPos = new DHVector3();

    this.projViewMat.multiplyMatrix(this.projMat, this.viewMat);
    var m = this.projViewMat;

    sPos.x = m.m11 * pos.x
           + m.m12 * pos.y
           + m.m13 * pos.z
           + m.m14;
    sPos.y = m.m21 * pos.x
           + m.m22 * pos.y
           + m.m23 * pos.z
           + m.m24;
    sPos.z = m.m31 * pos.x
           + m.m32 * pos.y
           + m.m33 * pos.z
           + m.m34;
    var w = 1.0 / (
             m.m41 * pos.x
           + m.m42 * pos.y
           + m.m43 * pos.z
           + m.m44);
    sPos.x *= w;
    sPos.y *= w;
    sPos.z *= w;

    return sPos;
  },

  showCameraMatrix: function() {
    debug("cameraMatrix:\n"
            + "projectionMatrix:\n"
            + this.projMat.m11 + " " + this.projMat.m12 + " " + this.projMat.m13 + " " + this.projMat.m14 + "\n"
            + this.projMat.m21 + " " + this.projMat.m22 + " " + this.projMat.m23 + " " + this.projMat.m24 + "\n"
            + this.projMat.m31 + " " + this.projMat.m32 + " " + this.projMat.m33 + " " + this.projMat.m34 + "\n"
            + this.projMat.m41 + " " + this.projMat.m42 + " " + this.projMat.m43 + " " + this.projMat.m44 + "\n"
            + "viewMatrix:\n"
            + this.viewMat.m11 + " " + this.viewMat.m12 + " " + this.viewMat.m13 + " " + this.viewMat.m14 + "\n"
            + this.viewMat.m21 + " " + this.viewMat.m22 + " " + this.viewMat.m23 + " " + this.viewMat.m24 + "\n"
            + this.viewMat.m31 + " " + this.viewMat.m32 + " " + this.viewMat.m33 + " " + this.viewMat.m34 + "\n"
            + this.viewMat.m41 + " " + this.viewMat.m42 + " " + this.viewMat.m43 + " " + this.viewMat.m44 + "\n");
  },

  changeCoordination: function() {
    var vm = this.viewMat;
    vm.m13 = -vm.m13;
    vm.m23 = -vm.m23;
    vm.m33 = -vm.m33;
    vm.m43 = -vm.m43;
  },

  bind: function(dhObject) {
    this.bindObj = dhObject;
  },

  setBindOffset: function(x, y, z) {
    this.bindOffset.x = x;
    this.bindOffset.y = y;
    this.bindOffset.z = z;
  },

  unbind: function() {
    this.bindObj = null;
  },

  update: function(elapsedTime) {
    if(this.bindObj){
      var objPos = this.bindObj._position;
      var ox = objPos.x + this.bindOffset.x;
      var oy = objPos.y + this.bindOffset.y;
      var oz = objPos.z + this.bindOffset.z;
      var cx = ox - this.distance * Math.cos(this.bindXAngle) * Math.sin(this.bindYAngle);
      var cy = oy - this.distance * Math.sin(this.bindXAngle);
      var cz = oz - this.distance * Math.cos(this.bindXAngle) * Math.cos(this.bindYAngle);

      this.lookat(cx, cy, cz,
                  ox, oy, oz,
                  0, 1, 0);
    }
  },
});

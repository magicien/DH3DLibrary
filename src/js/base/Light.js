/*--------------------------------------------------------------------------------
 * DH3DLibrary Light.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var Light = Class.create({
  LIGHT_TYPE_DIRECTIONAL: 1,

  type: 0,
  position: null,
  ambient: null,
  diffuse: null,
  specular: null,

  _positionCache: null,
  _ambientCache: null,
  _diffuseCache: null,
  _specularCache: null,

  initialize: function() {
    this.position = new DHVector3();
    this.ambient = new DHVector4();
    this.diffuse = new DHVector4();
    this.specular = new DHVector4();

    this._positionCache = new Float32Array([0, 0, 0]);
    this._ambientCache  = new Float32Array([0, 0, 0, 0]);
    this._diffuseCache  = new Float32Array([0, 0, 0, 0]);
    this._specularCache = new Float32Array([0, 0, 0, 0]);
  },

  setType: function(type) {
    this.type = type;
  },

  setPosition: function(x, y, z) {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;

    this._positionCache = new Float32Array([x, y, z]);
  },

  setAmbient: function(r, g, b, a) {
    this.ambient.x = r;
    this.ambient.y = g;
    this.ambient.z = b;
    this.ambient.w = a;

    this._ambientCache = new Float32Array([r, g, b, a]);
  },

  setDiffuse: function(r, g, b, a) {
    this.diffuse.x = r;
    this.diffuse.y = g;
    this.diffuse.z = b;
    this.diffuse.w = a;

    this._diffuseCache = new Float32Array([r, g, b, a]);
  },

  setSpecular: function(r, g, b, a) {
    this.specular.x = r;
    this.specular.y = g;
    this.specular.z = b;
    this.specular.w = a;

    this._specularCache = new Float32Array([r, g, b, a]);
  },

  getType: function() {
    return this.type;
  },

  getPosition: function() {
    return this._positionCache;
  },

  getAmbient: function() {
    return this._ambientCache;
  },

  getDiffuse: function() {
    return this._diffuseCache;
  },

  getSpecular: function() {
    return this._specularCache;
  },
});

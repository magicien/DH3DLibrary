/*--------------------------------------------------------------------------------
 * DH3DLibrary Material.js v0.1.0
 * Copyright (c) 2010-2011 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var Material = Class.create({
  ambient: null,
  diffuse: null,
  specular: null,
  shininess: 1.0,
  toonIndex: 0,
  edge: 0,
  textureFileName: '',

  texture: null,
  texture_repeat: true,

  _ambientCache: null,
  _diffuseCache: null,
  _specularCache: null,

  initialize: function() {
  },

  getAmbient: function() {
    if(!this._ambientCache){
      this._ambientCache = new Float32Array([
        this.ambient.x,
        this.ambient.y,
        this.ambient.z,
        this.ambient.w
      ]);
    }
    return this._ambientCache;
  },

  getDiffuse: function() {
    if(!this._diffuseCache){
      this._diffuseCache = new Float32Array([
        this.diffuse.x,
        this.diffuse.y,
        this.diffuse.z,
        this.diffuse.w
      ]);
    }
    return this._diffuseCache;
  },

  getSpecular: function() {
    if(!this._specularCache){
      this._specularCache = new Float32Array([
        this.specular.x,
        this.specular.y,
        this.specular.z,
        this.specular.w
      ]);
    }
    return this._specularCache;
  },

  getShininess: function() {
    return this.shininess;
  },

});

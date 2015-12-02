/*--------------------------------------------------------------------------------
 * DH3DLibrary Material.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
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
  emission: null,
  alpha: 1.0,
  toonIndex: 0,
  edge: 0,
  textureFileName: '',
  sphereFileName: '',

  texture: null,
  texture_repeat: true,
  sphere: null,

  _ambientCache: null,
  _diffuseCache: null,
  _specularCache: null,
  _emissionCache: null,

  initialize: function(m) {
    if(m instanceof Material){
      this.ambient = new DHVector4(m.ambient);
      this.diffuse = new DHVector4(m.diffuse);
      this.specular = new DHVector4(m.specular);
      this.shininess = m.shininess;
      this.emission = new DHVector4(m.emission);
      this.alpha = m.alpha;
      this.toonIndex = m.toonIndex;
      this.edge = m.edge;
      this.textureFileName = m.textureFileName;
      this.sphereFileName = m.sphereFileName;

      this.texture = m.texture;
      this.texture_repeat = m.texture_repeat;
      this.sphere = m.sphere;
    }
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

  getEmission: function() {
    if(!this._emissionCache){
      this._emissionCache = new Float32Array([
        this.emission.x,
        this.emission.y,
        this.emission.z,
        this.emission.w
      ]);
    }
    return this._emissionCache;
  },

  getAlpha: function() {
    return this.alpha;
  },

  clearCache: function() {
    // FIXME
    this._ambientCache = null;
    this._diffuseCache = null;
    this._specularCache = null;
    this._emissionCache = null;
  },

});

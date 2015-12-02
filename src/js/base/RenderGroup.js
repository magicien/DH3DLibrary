/*--------------------------------------------------------------------------------
 * DH3DLibrary RenderGroup.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var RenderGroup = Class.create({
  material: null,
  boneArray: null,
  indices: null,
  indexBuffer: null,

  _indexDataCache: null,
  
  initialize: function() {
    this.indices = $A();
  },

  getBoneData: function() {
  },

  getIndexData: function() {
    if(!this._indexDataCache){
      this._indexDataCache = new Uint16Array(this.indices);
    }
    return this._indexDataCache;
  },

  getAmbient: function() {
    return this.material.getAmbient();
  },

  getDiffuse: function() {
    return this.material.getDiffuse();
  },

  getSpecular: function() {
    return this.material.getSpecular();
  },

  getShininess: function() {
    return this.material.getShininess();
  },

});

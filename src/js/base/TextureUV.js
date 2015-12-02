/*--------------------------------------------------------------------------------
 * DH3DLibrary TextureUV.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var TextureUV = Class.create({
  u: 0.0,
  v: 0.0,

  initialize: function(u, v) {
    this.setValue(u, v);
  },

  setValue: function(u, v) {
    if((u instanceof TextureUV) || (u instanceof Object && u.v != undefined)){
      this.u = u.u;
      this.v = u.v;
    }else{
      this.u = u || 0.0;
      this.v = v || 0.0;
    }
  },

});

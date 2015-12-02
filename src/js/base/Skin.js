/*--------------------------------------------------------------------------------
 * DH3DLibrary Skin.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var Skin = Class.create({
  // Vertex
  position: null,          // vec3
  normal: null,            // vec3
  textureUV: null,         // vec2

  currentPosition: null,
  currentNormal: null,
  currentTextureUV: null,

  renderGroup: null,
  boneNum: null,
  bones: null,
  skinWeight: null,
  boneIndex: null,

  // etc.
  edge: 0,

  tempMatrix: new DHMatrix(),

  initialize: function() {
    this.currentPosition = new DHVector3();
    this.currentNormal = new DHVector3();
    this.currentTextureUV = new TextureUV();

    this.bones = $A();
    this.boneNum = $A();
    this.skinWeight = $A();
    this.boneIndex = $A();
  },
});



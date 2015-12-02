/*--------------------------------------------------------------------------------
 * DH3DLibrary Face.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var Face = Class.create({
  name: '',
  englishName: '',
  numVertices: 0,
  type: 0,
  vertices: null,

  initialize: function() {
    this.vertices = $A();
  },

  setFace: function(pmdModel) {
    var skins = pmdModel.dynamicSkinArray;

    for(var i=0; i<this.vertices.length; i++){
      skins[this.vertices[i].index].position.setValue(this.vertices[i].position);
    }
  },

  blendFace: function(pmdModel, rate) {
    var skins = pmdModel.dynamicSkinArray;

    for(var i=0; i<this.vertices.length; i++){
      var skinPos = skins[this.vertices[i].index].position;
      skinPos.mulAdd(skinPos, this.vertices[i].position, rate);
    }
  },
});

var FaceVertex = Class.create({
  index: 0,
  position: null,

  initialize: function() {
  },
});

var FaceMotion = Class.create({
  frameNo: -1,
  factor: 0.0,

  initialize: function() {
  },
});


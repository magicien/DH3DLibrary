/*--------------------------------------------------------------------------------
 * DH3DLibrary PMDModel.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var PMDModel = Class.create(Model, {
  // Header
  version: 0.0,
  modelName: '',
  comment: '',

  // Face
  faceArray: $A(),
  faceHash: $H(),

  // FaceDisplay
  faceDisplayArray: $A(),

  // BoneDisplayName
  boneDisplayNameArray: $A(),

  // BoneDisplay
  boneDisplayIndex: $A(),
  boneDisplayFrameIndex: $A(),

  // English
  englishCompatibility: false,
  englishName: '',
  englishComment: '',
  boneDisplayEnglishNameArray: $A(),

  initialize: function($super) {
    $super();
    this.faceArray = $A();
    this.faceHash = $H();
    this.faceDisplayArray = $A();
    this.boneDisplayNameArray = $A();
    this.boneDisplayIndex = $A();
    this.boneDisplayFrameIndex = $A();
    this.boneDisplayEnglishNameArray = $A();
    this.motionNumCache = $H();
    this.faceMotionNumCache = $H();
  },

  destroy: function() {
    PMDModel.superclass.prototype.destroy.apply(this);
  },

  copy: function(model) {
    Model.prototype.copy.apply(this, [model]);

    this.version                     = model.version;
    this.modelName                   = model.modelName;
    this.comment                     = model.comment;
    this.faceArray                   = model.faceArray;
    this.faceHash                    = model.faceHash;
    this.faceDisplayArray            = model.faceDisplayArray;
    this.boneDisplayNameArray        = model.boneDisplayNameArray;
    this.boneDisplayIndex            = model.boneDisplayIndex;
    this.boneDisplayFrameIndex       = model.boneDisplayFrameIndex;
    this.englishCompatibility        = model.englishCompatibility;
    this.englishName                 = model.englishName;
    this.englishComment              = model.englishComment;
    this.boneDisplayEnglishNameArray = model.boneDisplayEnglishNameArray;
  },
});

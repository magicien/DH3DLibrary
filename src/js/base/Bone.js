/*--------------------------------------------------------------------------------
 * DH3DLibrary Bone.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var Bone = Class.create({
  name: '',
  englishName: '',
  parentNo: -1,
  childNo: -1,
  type: 0,
  ikTarget: -1,
  position: null,

  parentBone: null,
  childBoneArray: $A(),

  localMatrix: null,
  rotate: null,
  scale: null,
  scaleMatrix: null,
  bonePosition: null,

  offset: null,

  offsetMatrix: null,
  inflMatrix: null,

  // motion blending
  blendPosition: null,
  blendRotation: null,

  // bone type
  BONE_TYPE_ROT:      0,
  BONE_TYPE_TRANS:    1,
  BONE_TYPE_IK:       2,
  BONE_TYPE_UNKNOWN:  3,
  BONE_TYPE_IK_CHILD: 4,
  BONE_TYPE_IK_ROT:   5,
  BONE_TYPE_IK_ROOT:  6,
  BONE_TYPE_HIDDEN:   7,
  BONE_TYPE_TWIST:    8,
  BONE_TYPE_ROLL:     9,

  initialize: function() {
    this.childBoneArray = $A();
    this.localMatrix = new DHMatrix();
    this.position = new DHVector3();

    this.rotate = new DHVector4();
    this.bonePosition = new DHVector3();
    this.offset = new DHVector3();

    this.scale = new DHVector3(1.0, 1.0, 1.0);
    this.scaleMatrix = new DHMatrix();

    this.offsetMatrix = new DHMatrix();
    this.inflMatrix = new DHMatrix();

    // motion blending
    this.blendPosition = new DHVector3();
    this.blendRotation = new DHVector4();
  },

  initBoneData: function() {
    this.localMatrix.identity();
    this.localMatrix.m41 = this.bonePosition.x;
    this.localMatrix.m42 = this.bonePosition.y;
    this.localMatrix.m43 = this.bonePosition.z;

    if(this.parentBone){
      this.offset.sub(this.bonePosition, this.parentBone.bonePosition);
    }else{
      this.offset.setValue(this.bonePosition);
    }

    this.offsetMatrix.identity();
    this.offsetMatrix.m41 = -this.bonePosition.x;
    this.offsetMatrix.m42 = -this.bonePosition.y;
    this.offsetMatrix.m43 = -this.bonePosition.z;

    this.reset();
  },

  clone: function() {
    var newBone = Object.clone(this);

    newBone.position      = Object.clone(this.position);
    newBone.localMatrix   = new DHMatrix(this.localMatrix);
    newBone.rotate        = Object.clone(this.rotate);
    newBone.bonePosition  = Object.clone(this.bonePosition);
    newBone.offset        = Object.clone(this.offset);
    newBone.offsetMatrix  = new DHMatrix(this.offsetMatrix);
    newBone.inflMatrix    = new DHMatrix(this.inflMatrix);
    newBone.blendPosition = Object.clone(this.blendPosition);
    newBone.blendRotation = Object.clone(this.blendRotation);

    return newBone;
  },

  addChild: function(childBone) {
    if(childBone.parentBone){
      childBone.parentBone.removeChild(childBone);
    }
    this.childBoneArray.push(childBone);
    childBone.parentBone = this;
  },

  removeChild: function(childBone) {
    if(childBone.parentBone == this){
      this.childBoneArray = this.childBoneArray.without(childBone);
      childBone.parentBone = null;
    }
  },

  reset: function() {
    this.position.x = this.position.y = this.position.z = 0.0;
    this.rotate.x = this.rotate.y = this.rotate.z = 0.0; this.rotate.w = 1.0;

    this.localMatrix.identity();
    this.localMatrix.m41 = this.bonePosition.x;
    this.localMatrix.m42 = this.bonePosition.y;
    this.localMatrix.m43 = this.bonePosition.z;
  },

  updateMatrix: function() {
    var mat = this.localMatrix;
    mat.matrixFromQuaternion(this.rotate);

    if(this.scale.x != 1.0 || this.scale.y != 1.0 || this.scale.z != 1.0){
      this.scaleMatrix.m11 = this.scale.x;
      this.scaleMatrix.m22 = this.scale.y;
      this.scaleMatrix.m33 = this.scale.z;
      mat.multiplyMatrix(this.scaleMatrix, mat);
    }


    mat.m41 = this.position.x + this.offset.x;
    mat.m42 = this.position.y + this.offset.y;
    mat.m43 = this.position.z + this.offset.z;

    if(this.parentBone){
      mat.multiplyMatrix(mat, this.parentBone.localMatrix);
    }
    this.updateInflMatrix();
  },

  updateInflMatrix: function() {
    this.inflMatrix.multiplyMatrix(this.offsetMatrix, this.localMatrix);
  },

  updateMatrixRecursive: function() {
    this.updateMatrix();
    this.childBoneArray.each( function(childBone){
      childBone.updateMatrixRecursive();
    });
  },

  setBlendValue: function() {
    this.blendPosition.setValue(this.position);
    this.blendRotation.setValue(this.rotate);
  },

  setBlendValueRecursive: function() {
    this.setBlendValue();
    this.childBoneArray.each( function(childBone){
      childBone.setBlendValueRecursive();
    });
  },
});


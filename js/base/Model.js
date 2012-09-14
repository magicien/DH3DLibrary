/*--------------------------------------------------------------------------------
 * DH3DLibrary Model.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var Model = Class.create({
  renderer: null,
  hashName: "",
  loaded: false,
  onload: null,

  // Skin
  skinArray: $A(),
  dynamicSkinArray: $A(),
  dynamicSkinOffset: 0,

  // Index
  indexArray: $A(),

  // Material
  materialArray: $A(),
  // TODO: texture
  // toonFileName: $A(),
  
  // Bone
  boneArray: $A(),
  boneHash: $H(),
  rootBone: null,

  // IK
  ikArray: $A(),

  // RigidBody
  rigidBodyArray: $A(),

  // Constraint
  constraintArray: $A(),

  // RenderGroup
  renderGroupArray: $A(),

  // VertexBuffer
  vertexBuffer: null,

  initialize: function(model) {
    if(model instanceof Model){
      model.copy(this);
      return;
    }

    this.skinArray = $A();
    this.dynamicSkinArray = $A();
    this.indexArray = $A();
    this.materialArray = $A();
    this.boneArray = $A();
    this.boneHash = $H();
    this.ikArray = $A();
    this.rigidBodyArray = $A();
    this.constraintArray = $A();

    // FIXME: 処理が煩雑
    this.rootBone = new Bone();
    this.rootBone.bonePosition = new DHVector3(0, 0, 0);
    this.rootBone.localMatrix = new DHMatrix();
    this.rootBone.initBoneData();
  },

  destroy: function() {
  },

  copy: function(model) {
    this.renderer          = model.renderer;
    this.hashName          = model.hashName;
    this.skinArray         = model.skinArray;
    this.dynamicSkinArray  = model.dynamicSkinArray;
    this.dynamicSkinOffset = model.dynamicSkinOffset;
    this.indexArray        = model.indexArray;
    this.materialArray     = model.materialArray;
    this.boneArray         = model.boneArray;
    this.boneHash          = model.boneHash;
    this.rootBone          = model.rootBone;
    this.ikArray           = model.ikArray;
    this.rigidBodyArray    = model.rigidBodyArray;
    this.constraintArray   = model.constraintArray;
    this.renderGroupArray  = model.renderGroupArray;
    this.vertexBuffer      = model.vertexBuffer;
  },

  cloneForLoading: function() {
    var newModel = Object.clone(this);
    return newModel;
  },

  clone: function() {
    if(!this.loaded){
      return this.cloneForLoading();
    }

    var obj = this;
    var newModel = Object.clone(this);

    // clone dynamicSkinArray
    newModel.dynamicSkinArray = $A();
    newModel.skinArray = this.skinArray.clone();
    this.dynamicSkinArray.each( function(skin){
      var index = obj.skinArray.indexOf(skin);
      if(index >= 0){
        newModel.skinArray[index] = skin;
      }
      newModel.dynamicSkinArray.push(skin);
    });

    // clone Bone
    newModel.boneArray = $A();
    newModel.boneHash = $H();

    var oldRootBone = this.rootBone;
    var oldBoneHash = this.boneHash;

    newModel.rootBone = 
       this.cloneBoneRecursive(this.rootBone, this.boneArray,     this.boneHash,
                                              newModel.boneArray, newModel.boneHash);

    // clone renderGroup
    newModel.renderGroupArray = $A();
    this.renderGroupArray.each( function(group){
      newModel.renderGroupArray.push(obj.cloneRenderGroup(group, newModel.boneArray));
    });
    
    // clone IK
    newModel.ikArray = $A();
    this.ikArray.each( function(ik){
      newIK = ik.clone();
      newIK.targetBone = newModel.boneHash.get(ik.targetBone.name);
      newIK.effectBone = newModel.boneHash.get(ik.effectBone.name);

      newIK.boneList = $A();
      ik.boneList.each( function(ikBone){
        newIK.boneList.push(newModel.boneHash.get(ikBone.name));
      });
      newModel.ikArray.push(newIK);
    });

    return newModel;
  },

  cloneBoneRecursive: function(bone, oldArray, oldHash, newArray, newHash) {
    var newBone = bone.clone();

    var index = oldArray.indexOf(bone);
    if(index >= 0){
      newArray[index] = newBone;
    }

    oldHash.each( function(hash){
      if(hash.value == bone){
        newHash.set(hash.key, newBone);
      }
    });

    var obj = this;
    newBone.childBoneArray = $A();
    bone.childBoneArray.each( function(cb){
      var newChildBone = obj.cloneBoneRecursive(cb, oldArray, oldHash, newArray, newHash);

      newBone.childBoneArray.push(newChildBone);
      newChildBone.parentBone = newBone;
    });

    return newBone;
  },

  cloneRenderGroup: function(oldGroup, newBoneArray) {
    var newGroup = Object.clone(oldGroup);

    var oldBoneArray = this.boneArray;
    newGroup.boneArray = $A();
    oldGroup.boneArray.each( function(bone){
      var index = oldBoneArray.indexOf(bone);
      if(index >= 0){
        newGroup.boneArray.push(newBoneArray[index]);
      }else{
        // error
        newGroup.boneArray.push(null);
      }
    });

    return newGroup;
  },

  getSkinArray: function() {
    return this.skinArray;
  },

  getDynamicSkinArray: function() {
    return this.dynamicSkinArray;
  },

});


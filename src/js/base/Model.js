'use strict'

import Bone from './Bone'
import Matrix from './Matrix'
import Vector3 from './Vector3'
import RenderGroup from './RenderGroup'

import ObjectAssign from '../etc/ObjectAssign'

/**
 * Model class
 * @access public
 */
export default class Model {
  /**
   * constructor
   * @access public
   * @param {Model} model -
   * @constructor
   */
  constructor(model) {
    this.renderer = null
    this.hashName = ''
    this.loaded = false
    this.onload = null

    // Skin
    this.skinArray = []
    this.dynamicSkinArray = []
    this.dynamicSkinOffset = 0

    // Index
    this.indexArray = []

    // Material
    this.materialArray = []
    // TODO: texture
    // this.toonFileName = []
  
    // Bone
    this.boneArray = []
    this.boneHash = new Map()
    this.rootBone = null

    // IK
    this.ikArray = []

    // RigidBody
    this.rigidBodyArray = []

    // Constraint
    this.constraintArray = []

    // RenderGroup
    this.renderGroupArray = []

    // VertexBuffer
    this.vertexBuffer = null

    if(model instanceof Model){
      model.copy(this)
      return
    }

    // FIXME: 処理が煩雑
    this.rootBone = new Bone()
    this.rootBone.bonePosition = new Vector3(0, 0, 0)
    this.rootBone.localMatrix = new Matrix()
    this.rootBone.initBoneData()
  }

  destroy() {
  }

  /**
   * copy given model data to this model
   * @access public
   * @param {Model} model - source model
   * @returns {void}
   */
  copy(model) {
    this.renderer          = model.renderer
    this.hashName          = model.hashName
    this.skinArray         = model.skinArray
    this.dynamicSkinArray  = model.dynamicSkinArray
    this.dynamicSkinOffset = model.dynamicSkinOffset
    this.indexArray        = model.indexArray
    this.materialArray     = model.materialArray
    this.boneArray         = model.boneArray
    this.boneHash          = model.boneHash
    this.rootBone          = model.rootBone
    this.ikArray           = model.ikArray
    this.rigidBodyArray    = model.rigidBodyArray
    this.constraintArray   = model.constraintArray
    this.renderGroupArray  = model.renderGroupArray
    this.vertexBuffer      = model.vertexBuffer
  }


  cloneForLoading() {
    //const newModel = Object.assign(new this.constructor(), this)
    const newModel = ObjectAssign(new this.constructor(), this)

    return newModel
  }

  clone() {
    const newModel = this.cloneForLoading()

    if(!this.loaded){
      return newModel
    }

    const obj = this

    // clone dynamicSkinArray
    newModel.dynamicSkinArray = []
    // newModel.skinArray = this.skinArray.clone()
    newModel.skinArray = this.skinArray.concat()
    this.dynamicSkinArray.forEach( (skin) => {
      const index = obj.skinArray.indexOf(skin)
      if(index >= 0){
        newModel.skinArray[index] = skin
      }
      newModel.dynamicSkinArray.push(skin)
    })

    // clone Bone
    newModel.boneArray = []
    newModel.boneHash = new Map()

    const oldRootBone = this.rootBone
    const oldBoneHash = this.boneHash

    newModel.rootBone = 
       this.cloneBoneRecursive(this.rootBone, this.boneArray,     this.boneHash,
                                              newModel.boneArray, newModel.boneHash)

    // clone renderGroup
    newModel.renderGroupArray = []
    this.renderGroupArray.forEach( (group) => {
      newModel.renderGroupArray.push(obj.cloneRenderGroup(group, newModel.boneArray))
    })
    
    // clone IK
    newModel.ikArray = []
    this.ikArray.forEach( (ik) => {
      const newIK = ik.clone()
      newIK.ikBone = newModel.boneHash.get(ik.ikBone.name)
      newIK.targetBone = newModel.boneHash.get(ik.targetBone.name)

      newIK.boneList = []
      ik.boneList.forEach( (ikBone) => {
        newIK.boneList.push(newModel.boneHash.get(ikBone.name))
      })
      newModel.ikArray.push(newIK)
    })

    return newModel
  }

  cloneBoneRecursive(bone, oldArray, oldHash, newArray, newHash) {
    const newBone = bone.clone()

    const index = oldArray.indexOf(bone)
    if(index >= 0){
      newArray[index] = newBone
    }

    oldHash.forEach( (value, key) => {
      if(value === bone){
        newHash.set(key, newBone)
      }
    })

    const obj = this
    newBone.childBoneArray = []
    bone.childBoneArray.forEach( (cb) => {
      const newChildBone = obj.cloneBoneRecursive(cb, oldArray, oldHash, newArray, newHash)

      newBone.childBoneArray.push(newChildBone)
      newChildBone.parentBone = newBone
    })

    return newBone
  }

  cloneRenderGroup(oldGroup, newBoneArray) {
    //const newGroup = Object.assign(new RenderGroup(), oldGroup)
    const newGroup = ObjectAssign(new RenderGroup(), oldGroup)

    const oldBoneArray = this.boneArray
    newGroup.boneArray = []
    oldGroup.boneArray.forEach( (bone) => {
      const index = oldBoneArray.indexOf(bone)
      if(index >= 0){
        newGroup.boneArray.push(newBoneArray[index])
      }else{
        // error
        newGroup.boneArray.push(null)
      }
    })

    return newGroup
  }

  getSkinArray() {
    return this.skinArray
  }

  getDynamicSkinArray() {
    return this.dynamicSkinArray
  }

}


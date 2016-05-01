'use strict'

import Vector3 from './Vector3'
import Vector4 from './Vector4'
import Matrix from './Matrix'

import ObjectAssign from '../etc/ObjectAssign'

/**
 * Bone basic class
 * @access public
 */
export default class Bone {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    /** @type {string} */
    this.name = ''

    /** @type {string} */
    this.englishName = ''

    /** @type {int} */
    this.parentNo = -1

    /** @type {int} */
    this.childNo = -1

    /** @type {int} */
    this.type = 0

    /** @type {int} */
    this.ikTarget = -1

    /** @type {Vector3} */
    this.position = new Vector3()


    /** @type {Bone} */
    this.parentBone = null

    /** @type {Array} */
    this.childBoneArray = []


    /** @type {Matrix} */
    this.localMatrix = new Matrix()

    /** @type {Vector4} */
    this.rotate = new Vector4()

    /** @type {Vector3} */
    this.scale = new Vector3(1.0, 1.0, 1.0)

    /** @type {Matrix} */
    this.scaleMatrix = new Matrix()

    /** @type {Vector3} */
    this.bonePosition = new Vector3()


    /** @type {Vector3} */
    this.bonePosition = new Vector3()

    /** @type {Vector3} */
    this.offset = new Vector3()


    /** @type {Matrix} */
    this.offsetMatrix = new Matrix()

    /** @type {Matrix} */
    this.inflMatrix = new Matrix()


    /** @type {Vector3} */
    this.blendPosition = new Vector3()

    /** @type {Vector4} */
    this.blendRotation = new Vector4()

    this.isKnee = false
  }

  /**
   * 
   * @access public
   * @returns {void}
   */
  initBoneData() {
    this.localMatrix.identity()
    this.localMatrix.m41 = this.bonePosition.x
    this.localMatrix.m42 = this.bonePosition.y
    this.localMatrix.m43 = this.bonePosition.z

    if(this.parentBone){
      this.offset.sub(this.bonePosition, this.parentBone.bonePosition)
    }else{
      this.offset.setValue(this.bonePosition)
    }

    this.offsetMatrix.identity()
    this.offsetMatrix.m41 = -this.bonePosition.x
    this.offsetMatrix.m42 = -this.bonePosition.y
    this.offsetMatrix.m43 = -this.bonePosition.z

    this.reset()
  }

  /**
   * 
   * @access public
   * @returns {Bone} new Bone object
   */
  clone() {
    //const newBone = Object.assign(new Bone(), this)
    const newBone = ObjectAssign(new Bone(), this)

    newBone.position      = this.position.clone()
    newBone.localMatrix   = this.localMatrix.clone()
    newBone.rotate        = this.rotate.clone()
    newBone.bonePosition  = this.bonePosition.clone()
    newBone.offset        = this.offset.clone()
    newBone.offsetMatrix  = this.offsetMatrix.clone()
    newBone.inflMatrix    = this.inflMatrix.clone()
    newBone.blendPosition = this.blendPosition.clone()
    newBone.blendRotation = this.blendRotation.clone()

    return newBone
  }

  /**
   * 
   * @access public
   * @param {Bone} childBone - 
   * @returns {void}
   */
  addChild(childBone) {
    if(childBone.parentBone){
      childBone.parentBone.removeChild(childBone)
    }
    this.childBoneArray.push(childBone)
    childBone.parentBone = this
  }

  /**
   * 
   * @access public
   * @param {Bone} childBone - 
   * @returns {void}
   */
  removeChild(childBone) {
    if(childBone.parentBone === this){
      //this.childBoneArray = this.childBoneArray.without(childBone)
      this.childBoneArray = this.childBoneArray.filter((bone) => { return bone !== childBone })
      childBone.parentBone = null
    }
  }

  /**
   * 
   * @access public
   * @returns {void}
   */
  reset() {
    this.position.x = this.position.y = this.position.z = 0.0
    this.rotate.x = this.rotate.y = this.rotate.z = 0.0
    this.rotate.w = 1.0

    this.localMatrix.identity()
    this.localMatrix.m41 = this.bonePosition.x
    this.localMatrix.m42 = this.bonePosition.y
    this.localMatrix.m43 = this.bonePosition.z
  }

  /**
   * 
   * @access public
   * @returns {void}
   */
  updateMatrix() {
    const mat = this.localMatrix
    mat.matrixFromQuaternion(this.rotate)

    if(this.scale.x !== 1.0 || this.scale.y !== 1.0 || this.scale.z !== 1.0){
      this.scaleMatrix.m11 = this.scale.x
      this.scaleMatrix.m22 = this.scale.y
      this.scaleMatrix.m33 = this.scale.z
      mat.multiplyMatrix(this.scaleMatrix, mat)
    }

    mat.m41 = this.position.x + this.offset.x
    mat.m42 = this.position.y + this.offset.y
    mat.m43 = this.position.z + this.offset.z

    if(this.parentBone){
      mat.multiplyMatrix(mat, this.parentBone.localMatrix)
    }
    this.updateInflMatrix()
  }

  /**
   * 
   * @access public
   * @returns {void}
   */
  updateInflMatrix() {
    this.inflMatrix.multiplyMatrix(this.offsetMatrix, this.localMatrix)
  }

  /**
   * 
   * @access public
   * @returns {void}
   */
  updateMatrixRecursive() {
    this.updateMatrix()
    this.childBoneArray.forEach((childBone) => {
      childBone.updateMatrixRecursive()
    })
  }

  /**
   * 
   * @access public
   * @returns {void}
   */
  setBlendValue() {
    this.blendPosition.setValue(this.position)
    this.blendRotation.setValue(this.rotate)
  }

  /**
   * 
   * @access public
   * @returns {void}
   */
  setBlendValueRecursive() {
    this.setBlendValue()
    this.childBoneArray.forEach((childBone) => {
      childBone.setBlendValueRecursive()
    })
  }
}

// static values

// bone types
Bone.prototype.BONE_TYPE_ROT      = 0
Bone.prototype.BONE_TYPE_TRANS    = 1
Bone.prototype.BONE_TYPE_IK       = 2
Bone.prototype.BONE_TYPE_UNKNOWN  = 3
Bone.prototype.BONE_TYPE_IK_CHILD = 4
Bone.prototype.BONE_TYPE_IK_ROT   = 5
Bone.prototype.BONE_TYPE_IK_ROOT  = 6
Bone.prototype.BONE_TYPE_HIDDEN   = 7
Bone.prototype.BONE_TYPE_TWIST    = 8
Bone.prototype.BONE_TYPE_ROLL     = 9


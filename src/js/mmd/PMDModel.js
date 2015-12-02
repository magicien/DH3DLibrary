'use strict'

import Model from '../base/Model'

/**
 * PMDModel class
 * @access public
 */
export default class PMDModel extends Model {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    super()

    // Header
    this.version = 0.0
    this.modelName = ''
    this.comment = ''

    // Face
    this.faceArray = []
    this.faceHash = new Map()

    // FaceDisplay
    this.faceDisplayArray = []

    // BoneDisplayName
    this.boneDisplayNameArray = []

    // BoneDisplay
    this.boneDisplayIndex = []
    this.boneDisplayFrameIndex = []

    // English
    this.englishCompatibility = false
    this.englishName = ''
    this.englishComment = ''
    this.boneDisplayEnglishNameArray = []

    // Motion
    this.motionNumCache = new Map()
    this.faceMotionNumCache = new Map()
  }

  destroy() {
    super.destroy()
  }

  copy(model) {
    super.copy(model)

    this.version                     = model.version
    this.modelName                   = model.modelName
    this.comment                     = model.comment
    this.faceArray                   = model.faceArray
    this.faceHash                    = model.faceHash
    this.faceDisplayArray            = model.faceDisplayArray
    this.boneDisplayNameArray        = model.boneDisplayNameArray
    this.boneDisplayIndex            = model.boneDisplayIndex
    this.boneDisplayFrameIndex       = model.boneDisplayFrameIndex
    this.englishCompatibility        = model.englishCompatibility
    this.englishName                 = model.englishName
    this.englishComment              = model.englishComment
    this.boneDisplayEnglishNameArray = model.boneDisplayEnglishNameArray
  }
}

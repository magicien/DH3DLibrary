'use strict'

import ModelReader from '../base/ModelReader'
import BinaryReader from '../util/BinaryReader'
import Bone from '../base/Bone'
import Constraint from '../base/Constraint'
import Vector3 from '../base/Vector3'
import Vector4 from '../base/Vector4'
import Face from './Face'
import FaceVertex from './FaceVertex'
import IK from '../base/IK'
import Material from '../base/Material'
import PMDModel from './PMDModel'
import RenderGroup from '../base/RenderGroup'
import RigidBody from '../base/RigidBody'
import Skin from '../base/Skin'
import TextureUV from '../base/TextureUV'
import TextureBank from '../base/TextureBank'
import ModelBank from '../base/ModelBank'

import ObjectAssign from '../etc/ObjectAssign'

/**
 * PMDReader class
 * @access public
 */
export default class PMDReader extends ModelReader {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    super()
    this._binaryReader = null

    this._model = null
    this._parentDirName = null

    this._maxEffBonesLength = 20 // FIXME: bind to vertex shader

    this._leftKneeName = String.fromCharCode(0x5DE6, 0x3072, 0x3056)  // 「左ひざ」
    this._rightKneeName = String.fromCharCode(0x53F3, 0x3072, 0x3056) // 「右ひざ」

    this._toonFileName = null

    this._toonFileName = []
    for(let i=0; i<9; i++){
      this._toonFileName[i] = 'toon0' + (i+1) + '.bmp'
    }
    this._toonFileName[9] = 'toon10.bmp'
  }

  /**
   * read PMD file data from given URL
   * @access public
   * @param {string} url - model file url
   * @returns {Promise} - resolved when loading model is completed
   */
  readModel(url){
    if(!PMDReader.canRead(url))
      return false

    this._model = new PMDModel()

    const promise = BinaryReader.open(url, false, 'sjis')
      .then((reader) => {
        this._binaryReader = reader
        return this.readModelProcess(url)
      })
      .catch((err) => {
        console.error(`file (${url}) open error: ${err}`)
      })

    return promise
  }

  /**
   * read PMD file data from File object
   * @access public
   * @param {File} file - model file
   * @returns {Promise} - resolved when loading model is completed
   */
  readModelFromFile(file) {
    if(!PMDReader.canRead(file))
      return false

    this._model = new PMDModel()

    const promise = BinaryReader.open(file, false, 'sjis')
      .then((reader) => {
        this._binaryReader = reader
        return this.readModelProcess(null)
      })
      .catch((err) => {
        console.error(`file (${file.name}) open error: ${err}`)
      })

    return promise
  }

  readModelProcess(url) {
    const result = this.readModelSub(url)

    if(!result){
      if(this._model.onerror){
        this._model.onerror()
      }
      return Promise.reject('read model error')
    }

    this._model.loaded = true
    if(this._model.onload){
      this._model.onload()
    }

    if(this._model.onloadend){
      this._model.onloadend()
    }
    return Promise.resolve(this._model)
  }

  readModelSub(url){
    //this._parentDirName = (new String(url)).gsub(/\/[^\/]*$/, '/')
    this._parentDirName = url.replace(/\/[^\/]*$/, '/')
    if(url === this._parentDirName){
      this._parentDirName = './'
    }

    const result = this.readHeader()
    if(!result){
      return false
    }

    this.readVertex()
    this.readIndex()
    this.readMaterial()
    this.readBone()
    this.updateVertexBone()
    this.readIK()
    this.readFace()
    this.readFaceDisplay()
    this.readBoneDisplayName()
    this.readBoneDisplay()
    this.initRenderGroup()

    if(!this._binaryReader.hasBytesAvailable())
      return this._model

    this.readEnglishInfo()

    if(!this._binaryReader.hasBytesAvailable())
      return this._model

    this.readToonTexture()

    if(!this._binaryReader.hasBytesAvailable())
      return this._model

    this.readRigidBody()

    if(!this._binaryReader.hasBytesAvailable())
      return this._model

    this.readConstraint()

    return this._model
  }

  readHeader() {
    const magic = this._binaryReader.readString(3)
    if(magic !== 'Pmd'){
      //myAlert('PMD Format Error')
      return false
    }
    this._model.version = this._binaryReader.readFloat()   
    this._model.modelName = this._binaryReader.readString(20)
    this._model.comment = this._binaryReader.readString(256)
    //myAlert(this._model.modelName + '\n' + this._model.comment)
    return true
  }
  
  readVertex() {
    const vertexCount = this._binaryReader.readUnsignedInt()
    if(vertexCount <= 0){
      //myAlert('PMD vertexCount error.')
    }

    //myAlert('vertexCount: '+vertexCount)

    this._model.skinArray = []
    for(let i=0; i<vertexCount; i++){
      this._model.skinArray[i] = new Skin()

      this._model.skinArray[i].position = new Vector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      )
      this._model.skinArray[i].normal = new Vector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      )
      this._model.skinArray[i].textureUV = new TextureUV(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat()
      )
      this._model.skinArray[i].boneNum[0] = this._binaryReader.readUnsignedShort()
      this._model.skinArray[i].boneNum[1] = this._binaryReader.readUnsignedShort()

      this._model.skinArray[i].skinWeight[0] = this._binaryReader.readUnsignedByte() / 100.0
      this._model.skinArray[i].skinWeight[1] = 1.0 - this._model.skinArray[i].skinWeight[0]
      this._model.skinArray[i].skinWeight[2] = 0.0
      this._model.skinArray[i].skinWeight[3] = 0.0

      this._model.skinArray[i].edge = this._binaryReader.readUnsignedByte()
    }
  }

  readIndex() {
    const indexCount = this._binaryReader.readUnsignedInt()
    //myAlert('indexCount: '+indexCount)

    this._model.indexArray = []
    for(let i=0; i<indexCount; i++){
      this._model.indexArray[i] = this._binaryReader.readUnsignedShort()
    }
  }

  readMaterial() {
    const materialCount = this._binaryReader.readUnsignedInt()

    //myAlert('materialCount: '+materialCount)
    this._model.materialArray = []
    for(let i=0; i<materialCount; i++){
      const materialObj = new Material()

      materialObj.diffuse = new Vector4(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat()
      )
      materialObj.shininess = this._binaryReader.readFloat()
      materialObj.specular = new Vector4(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        1.0
      )
      materialObj.ambient = new Vector4(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        1.0
      )
      materialObj.emission = new Vector4(0, 0, 0, 0)
      materialObj.toonIndex = this._binaryReader.readUnsignedByte()
      materialObj.edge = this._binaryReader.readUnsignedByte()
      materialObj.indexCount = this._binaryReader.readUnsignedInt()

      let textureFile = this._binaryReader.readString(20)
      let sphereFile = ''
      if(textureFile.indexOf('*') >= 0){
        const names = textureFile.split('*')
        textureFile = names[0]
        sphereFile = names[1]
      }
      materialObj.textureFileName = this._parentDirName + textureFile
      materialObj.sphereFileName = this._parentDirName + sphereFile
      if(materialObj.textureFileName !== this._parentDirName){
        materialObj.texture = TextureBank.getTexture(materialObj.textureFileName)
      }
      if(materialObj.sphereFileName !== this._parentDirName){
        materialObj.sphere = TextureBank.getTexture(materialObj.sphereFileName)
      }

      this._model.materialArray[i] = materialObj
    }
  }

  readBone() {
    const boneCount = this._binaryReader.readUnsignedShort()
    
    //myAlert('boneCount: '+boneCount)
    this._model.boneArray = []
    for(let i=0; i<boneCount; i++){
      const boneObj = new Bone()
      
      boneObj.name = this._binaryReader.readString(20)
      boneObj.parentNo = this._binaryReader.readUnsignedShort()
      boneObj.childNo = this._binaryReader.readUnsignedShort()
      boneObj.type = this._binaryReader.readUnsignedByte()
      boneObj.ikTarget = this._binaryReader.readUnsignedShort()
      boneObj.bonePosition = new Vector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat()
      )
      this._model.boneArray[i] = boneObj
      this._model.boneHash.set(boneObj.name, boneObj)
    }

    // 親ボーンの設定
    for(let i=0; i<boneCount; i++){
      const bone = this._model.boneArray[i]
      if(bone.parentNo !== 0xFFFF){
        this._model.boneArray[bone.parentNo].addChild(bone)
      }else{
        this._model.rootBone.addChild(bone)
      }
    }

    // 初期化処理
    this._model.boneArray.forEach( (bone) => {
      bone.initBoneData()
    })
  }

  readIK() {
    const boneArray = this._model.boneArray
    const ikCount = this._binaryReader.readUnsignedShort()

    for(let i=0; i<ikCount; i++){
      const ikObj = new IK()
      const targetBoneNo = this._binaryReader.readUnsignedShort()
      const effectBoneNo = this._binaryReader.readUnsignedShort()

      ikObj.targetBone = boneArray[targetBoneNo]
      ikObj.effectBone = boneArray[effectBoneNo]
      const numLink = this._binaryReader.readUnsignedByte()
      ikObj.iteration = this._binaryReader.readUnsignedShort()
      ikObj.weight = this._binaryReader.readFloat() * Math.PI

      ikObj.boneList = []
      ikObj.minAngleList = []
      ikObj.maxAngleList = []
      for(let j=0; j<numLink; j++){
        const linkNo = this._binaryReader.readUnsignedShort()
        ikObj.boneList.push(boneArray[linkNo])
        
        //const boneName = new String(boneArray[linkNo].name)
        const boneName = boneArray[linkNo].name
        if((boneName === this._leftKneeName) || (boneName === this._rightKneeName)){
          ikObj.minAngleList[j] = new Vector3(0.003, 0.0, 0.0)
          ikObj.maxAngleList[j] = new Vector3(Math.PI-0.003, 0.0, 0.0)
        }
      }
      this._model.ikArray[i] = ikObj
    }
  }

  readFace() {
    const faceCount = this._binaryReader.readUnsignedShort()

    this._model.faceArray = []
    for(let i=0; i<faceCount; i++){
      const faceObj = new Face()

      faceObj.name = this._binaryReader.readString(20)
      faceObj.numVertices = this._binaryReader.readUnsignedInt()
      faceObj.type = this._binaryReader.readUnsignedByte()
      faceObj.vertices = []
      for(let j=0; j<faceObj.numVertices; j++){
        const faceVertexObj = new FaceVertex()
        faceVertexObj.index = this._binaryReader.readUnsignedInt()
        faceVertexObj.position = new Vector3(
          this._binaryReader.readFloat(),
          this._binaryReader.readFloat(),
         -this._binaryReader.readFloat()
        )
        faceObj.vertices[j] = faceVertexObj
      }
      this._model.faceArray[i] = faceObj
      this._model.faceHash.set(faceObj.name, faceObj)
    }
  }

  readFaceDisplay() {
    const faceDisplayCount = this._binaryReader.readUnsignedByte()

    this._model.faceDisplayArray = []
    for(let i=0; i<faceDisplayCount; i++){
      this._model.faceDisplayArray[i] = this._binaryReader.readUnsignedShort()
    }
  }

  readBoneDisplayName() {
    const boneDisplayNameCount = this._binaryReader.readUnsignedByte()

    this._model.boneDisplayNameArray = []
    for(let i=0; i<boneDisplayNameCount; i++){
      this._model.boneDisplayNameArray[i] = this._binaryReader.readString(50)
    }
  }

  readBoneDisplay() {
    const boneDisplayCount = this._binaryReader.readUnsignedInt()

    this._model.boneDisplayIndex = []
    this._model.boneDisplayFrameIndex = []
    for(let i=0; i<boneDisplayCount; i++){
      this._model.boneDisplayIndex[i] = this._binaryReader.readUnsignedShort()
      this._model.boneDisplayFrameIndex[i] = this._binaryReader.readUnsignedByte()
    }
  }

  readEnglishInfo() {
    this._model.englishCompatibility = this._binaryReader.readUnsignedByte()
    if(this._model.englishCompatibility){
      // Header
      this._model.englishName = this._binaryReader.readString(20)
      this._model.englishComment = this._binaryReader.readString(256)

      if(!this._binaryReader.hasBytesAvailable())
        return

      // Bone
      for(let i=0; i<this._model.boneArray.length; i++){
        this._model.boneArray[i].englishName = this._binaryReader.readString(20)
      }
      
      if(!this._binaryReader.hasBytesAvailable())
        return

      // Face
      for(let i=1; i<this._model.faceArray.length; i++){
        this._model.faceArray[i].englishName = this._binaryReader.readString(20)
      }

      if(!this._binaryReader.hasBytesAvailable())
        return

      // BoneDisplayName
      for(let i=0; i<this._model.boneDisplayNameArray.length; i++){
        this._model.boneDisplayEnglishNameArray[i] = this._binaryReader.readString(50)
      }
    }
  }

  readToonTexture() {
    for(let i=0; i<10; i++){
      this._toonFileName[i] = this._binaryReader.readString(100)
    }

    //for(var i=0 i<10 i++){
    //  alert(i + ':' + this._toonFileName[i])
    //}
    // set toon file to each material
    const obj = this
    this._model.materialArray.forEach( (m) => {
      if(0 <= m.toonIndex && m.toonIndex < 10){
        //alert('m.toonIndex = ' + m.toonIndex)
        //alert(obj._toonFileName[m.toonIndex])
        m.toonFileName = obj._parentDirName + obj._toonFileName[m.toonIndex]
        if(m.toonFileName !== obj._parentDirName){
          m.toon = TextureBank.getTexture(m.toonFileName)
        }
      }
    })
  }

  readRigidBody() {
    const rigidBodyCount = this._binaryReader.readUnsignedInt()

    this._model.rigidBodyArray = []
    for(let i=0; i<rigidBodyCount; i++){
      let bone = null
      const rigidBodyObj = new RigidBody()

      rigidBodyObj.name = this._binaryReader.readString(20)
      rigidBodyObj.boneIndex = this._binaryReader.readShort()
      rigidBodyObj.groupIndex = this._binaryReader.readUnsignedByte()
      rigidBodyObj.groupTarget = this._binaryReader.readUnsignedShort()
      rigidBodyObj.shapeType = this._binaryReader.readUnsignedByte()
      rigidBodyObj.shapeW = this._binaryReader.readFloat()
      rigidBodyObj.shapeH = this._binaryReader.readFloat()
      rigidBodyObj.shapeD = this._binaryReader.readFloat()
      rigidBodyObj.position = new Vector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      )
      rigidBodyObj.rotate = new Vector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      )
      rigidBodyObj.weight = this._binaryReader.readFloat()
      rigidBodyObj.positionDim = this._binaryReader.readFloat()
      rigidBodyObj.rotateDim = this._binaryReader.readFloat()
      rigidBodyObj.recoil = this._binaryReader.readFloat()
      rigidBodyObj.friction = this._binaryReader.readFloat()
      rigidBodyObj.type = this._binaryReader.readUnsignedByte()

      if(rigidBodyObj.boneIndex === -1){
        bone = this._model.boneHash.get('センター')
      }else{
        bone = this._model.boneArray[rigidBodyObj.boneIndex]
      }

      this._model.rigidBodyArray[i] = rigidBodyObj
    }
  }

  readConstraint() {
    const constraintCount = this._binaryReader.readUnsignedInt()

    this._model.constraintArray = []
    for(let i=0; i<constraintCount; i++){
      const constraintObj = new Constraint()

      constraintObj.name = this._binaryReader.readString(20)
      constraintObj.bodyA = this._binaryReader.readUnsignedInt()
      constraintObj.bodyB = this._binaryReader.readUnsignedInt()

      constraintObj.position = new Vector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      )

      constraintObj.rotate = new Vector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      )

      constraintObj.constrainPos1 = new Vector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      )

      constraintObj.constrainPos2 = new Vector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      )

      constraintObj.constrainRot1 = new Vector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      )

      constraintObj.constrainRot2 = new Vector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      )

      constraintObj.springPos = new Vector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      )

      constraintObj.springRot = new Vector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      )

      this._model.constraintArray[i] = constraintObj
    }
  }

  updateVertexBone() {
    const boneArray = this._model.boneArray
    this._model.skinArray.forEach( (skinObj) => {
      skinObj.bones[0] = boneArray[skinObj.boneNum[0]]
      skinObj.bones[1] = boneArray[skinObj.boneNum[1]]
    })
  }

  // マテリアル、影響を与えるボーン毎にグループ分け
  initRenderGroup() {
    const materials = this._model.materialArray
    let indices = this._model.indexArray
    let skins = this._model.skinArray
    const boneArray = this._model.boneArray
    let renderGroups = []

    if(this._model.faceArray[0]){
      // 動的に変化する頂点を頂点配列の最後尾に配置
      // （bufferSubDataで一気に転送するため）

      const faceVertices = this._model.faceArray[0].vertices
      const dynamicSkins = []
      const newSkins = []
      const newIndices = []
      const indexTranslationTable = []
      const faceBaseIndices = []

      // 動的な頂点を別の配列にコピー
      let dynamicSkinCount = 0
      for(let i=0; i<faceVertices.length; i++){
        const index = faceVertices[i].index
        faceBaseIndices[index] = 1
        dynamicSkins[dynamicSkinCount++] = skins[index]
      }

      // 新しい頂点配列とindex変換用テーブルの作成
      let skinCount = 0
      let dynamicSkinIndex = skins.length - dynamicSkinCount
      for(let i=0; i<skins.length; i++){
        if(faceBaseIndices[i]){
          newSkins[dynamicSkinIndex] = skins[i]
          indexTranslationTable[i] = dynamicSkinIndex 

          dynamicSkinIndex++
        }else{
          newSkins[skinCount] = skins[i]
          indexTranslationTable[i] = skinCount

          skinCount++
        }
      }

      // 変換後のindexを生成
      for(let i=0; i<indices.length; i++){
        newIndices[i] = indexTranslationTable[indices[i]]
      }

      // 顔データのインデックスを修正
      for(let i=0; i<faceVertices.length; i++){
        faceVertices[i].index = i
      }

      // 頂点、インデックスデータを新しいものに入れ替え
      this._model.skinArray = newSkins
      skins = newSkins

      this._model.indexArray = newIndices
      indices = newIndices

      this._model.dynamicSkinArray = dynamicSkins
      this._model.dynamicSkinOffset = skins.length - dynamicSkinCount
      this._model.hasDynamicSkin = true
    }else{
      this._model.hasDynamicSkin = false
    }

    const uniqueIndexArray = []
    let indexCount = 0
    for(let i=0; i<materials.length; i++){
      const material = materials[i]
      const myMaterialGroup = []
      const myMaterialIndexArray = []
      for(let j=0; j<material.indexCount/3; j++){
        const index0 = indices[indexCount++]
        const index1 = indices[indexCount++]
        const index2 = indices[indexCount++]
        const skin0 = skins[index0]
        const skin1 = skins[index1]
        const skin2 = skins[index2]
        let group = null
        let groupIndex = -1

        //const bones = []
        //const boneNums = bones.concat(skin0.boneNum, skin1.boneNum, skin2.boneNum).uniq().sort((a, b) => {return a-b})
        /*
        const boneNums = [].concat(skin0.boneNum, skin1.boneNum, skin2.boneNum)
                           .filter((item, pos, self) => { return self.indexOf(item) == pos })
                           .sort((a, b) => {return a-b})
        */
        const set = new Set([].concat(skin0.boneNum, skin1.boneNum, skin2.boneNum))
        const boneNums = [...set].sort((a, b) => {return a-b})

        // boneNumsの要素が全てg.bonesに含まれているか
        // group = myMaterialGroup.find( (g, index) => {
        myMaterialGroup.some( (g, index) => {
          let bj=0
          for(let bi=0; bi<g.bones.length && bj<boneNums.length; bi++){
            if(g.bones[bi] === boneNums[bj]){
              bj++
            }else if(g.bones[bi] > boneNums[bj]){
              return false
            }
          }

          groupIndex = index

          // return (bj === boneNums.length)
          if(bj === boneNums.length){
            group = g
            return true
          }

          return false
        })

        if(!group){
          // boneNumsの要素のうち1つでもg.bonesに含まれているか
          //group = myMaterialGroup.find( (g, index) => {
          myMaterialGroup.some( (g, index) => {
            if(g.material !== material)
              return false

            for(let bi=0, bj=0; bi<g.bones.length && bj<boneNums.length; ){
              if(g.bones[bi] === boneNums[bj]){
                groupIndex = index
                group = g
                return true
              }else if(g.bones[bi] > boneNums[bj]){
                bj++
              }else{
                bi++
              }
            }
            return false
          })
          if(group){
            //const newGroup = group.bones.concat(boneNums).uniq().sort( (a, b) => {return a-b} )
            const newSet = new Set(group.bones.concat(boneNums))
            const newGroup = [...newSet].sort((a, b) => {return a-b})
            if(newGroup.length < this._maxEffBonesLength){
              group.bones = newGroup
            }else{
              // 入りきらない
              group = null
            }
          }
        }

        if(!group){
          // 配列に空きがあれば、無理矢理ねじこむ
          const maxEffBonesLength = this._maxEffBonesLength
          myMaterialGroup.some( (g, index) => {
            const newSet = new Set(g.bones.concat(boneNums))
            const newGroup = [...newSet]
            if(newGroup.length < maxEffBonesLength){
              g.bones = newGroup.sort( (a, b) => {return a-b} )
              groupIndex = index
              group = g
              return true
            }
            return false
          })
        }


        if(!group){
          // どのグループにも入らなければ、新しくグループを作成
          group = new RenderGroup()
          group.bones = boneNums
          group.material = material
          groupIndex = myMaterialGroup.length
          myMaterialIndexArray[groupIndex] = []

          myMaterialGroup.push(group)
        }

        group.indices.push(index0)
        group.indices.push(index1)
        group.indices.push(index2)
        myMaterialIndexArray[groupIndex][index0] = 1
        myMaterialIndexArray[groupIndex][index1] = 1
        myMaterialIndexArray[groupIndex][index2] = 1
      } // material.index

      myMaterialGroup.forEach( (g) => {
        g.boneArray = []
        for(let k=0; k<g.bones.length; k++){
          g.boneArray.push(boneArray[g.bones[k]])
        }
      })

      for(let k=0; k<myMaterialIndexArray.length; k++){
        const groupIndexArray = myMaterialIndexArray[k]
        const group = myMaterialGroup[k]

        for(let l=0; l<groupIndexArray.length; l++){
          if(groupIndexArray[l]){
            if(uniqueIndexArray[l]){
              // need vertex copy
              // const newSkin = Object.clone(skins[l])
              // newSkin.boneIndex = Object.clone(newSkin.boneIndex)

              //const newSkin = Object.assign(new Skin(), skins[l])
              const newSkin = ObjectAssign(new Skin(), skins[l])
              //newSkin.boneIndex = Object.assign([], newSkin.boneIndex)
              newSkin.boneIndex = ObjectAssign([], newSkin.boneIndex)
              const newSkinIndex = skins.length
              skins.push(newSkin)

              group.indices.forEach( (value, key) => {
                if(value === l){
                  group.indices[key] = newSkinIndex
                }
              })
              newSkin.renderGroup = group
            }else{
              uniqueIndexArray[l] = 1
              skins[l].renderGroup = group
            }
          }
        }
      }

      renderGroups = renderGroups.concat(myMaterialGroup)
    } // material
    this._model.renderGroupArray = renderGroups

    // boneIndexの設定
    skins.forEach( (s) => {
      const boneIndexArray = s.renderGroup.bones
      for(let k=0; k<4; k++){ // FIXME: const value (k)
        s.boneIndex[k] = boneIndexArray.indexOf(s.boneNum[k])
      }
    })
  }
}

PMDReader.canRead = (file) => {
  let ext = ''
  if(file instanceof File){
    ext = file.name.substr(-4)
  }else if(typeof file === 'string' || file instanceof String){
    ext = file.substr(-4)
  }

  if(ext === '.pmd'){
    return true
  }

  return false
}

ModelBank.addModelReader(PMDReader)


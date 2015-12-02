'use strict'

import Bone from '../base/Bone'
import Vector3 from '../base/Vector3'
import Vector4 from '../base/Vector4'
import Material from '../base/Material'
import RenderGroup from '../base/RenderGroup'
import Skin from '../base/Skin'
import TextureUV from '../base/TextureUV'
import XModel from './XModel'
import TextureBank from '../base/TextureBank'

import ObjectAssign from '../etc/ObjectAssign'


// patterns
const _integerPattern = new RegExp(/^(-|\+)?\d+;?/)
const _floatPattern = new RegExp(/^(-|\+)?(\d)*\.(\d)*;?/)
const _commaOrSemicolonPattern = new RegExp(/^,|;/)
const _wordPattern = new RegExp(/^\w+/)
const _uuidPattern = new RegExp(/^<[\w-]+>/)
const _leftBracePattern = new RegExp(/^{/)
const _rightBracePattern = new RegExp(/^}/)
const _memberPattern = new RegExp(/^((array\s+\w+\s+\w+\[(\d+|\w+)\]|\w+\s+\w+)\s*;|\[[\w.]+\])/)
const _filenamePattern = new RegExp(/^"(.*)";?/)


/**
 * XParser class
 * @access public
 */
export default class XParser {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    this._text = null
    this._obj = null
    this._parentDirName = null
    this._indices = null
    this._materialIndex = 0
    this._normalArray = null
    this._faceNormalArray = null

    this._offset = 0
    this._err = 0

    this._parentDirName = './'

    // this._skipPattern = new RegExp(/^\s+/)
    this._partialText = ''
    this._partialOffset = 0
    this._partialStep = 1000
    this._partialMinLength = 500
    //this._partialMaxLength = 5000
  }

  /**
   *
   * @access public
   * @param {String} dirName -
   * @returns {void}
   */
  setParentDirName(dirName) {
    this._parentDirName = dirName
  }

  /**
   *
   * @access public
   * @param {XModel} obj -
   * @returns {void}
   */
  setModel(obj) {
    this._obj = obj
  }

  /**
   *
   * @access public
   * @param {String} text -
   * @returns {XModel} - 
   */
  parse(text) {
    this._text = text
    this._partialText = ''

    if(!this._obj){
      this._obj = new XModel()
    }
    this._offset = 0
    this._partialOffset = 0
    this._err = 0

    this.addPartialText()

    if(!this.XFileHeader(this._obj)){
      console.error('header format error')
      this._err = 1
      return null
    }

    while(this.XObjectLong(this._obj)){ /* nothing to do */ }

    if(this._err){
      console.error('xobj format error:' + this._err)
      return null
    }
    this.splitFaceNormals()

    return this._obj
  }

  /**
   *
   * @access private
   * @param {number} len -
   * @returns {void}
   */
  moveIndex(len) {
    this._partialText = this._partialText.substring(len)
    this._offset += len
  }

  /**
   *
   * @access private
   * @param {RegExp} pattern -
   * @returns {String} - matched string
   */
  getString(pattern) {
    this.skip()

    const str = this._partialText.match(pattern)
    /*
    while(str == null){
      if(this._partialText.length > this._partialMaxLength)
        return null

      this.addPartialText()
      str = this._partialText.match(pattern)
    }
    */
    if(str == null)
      return null

    this.moveIndex(str[0].length)

    if(this._partialText.length < this._partialMinLength)
      this.addPartialText()

    return str[0]
  }

  /**
   * skip space, tab
   * @access private
   * @returns {void}
   */
  skip() {
    /*
    const str = this._text.match(this._skipPattern)
    if(str != null){
      const len = str[0].length
      this.moveIndex(len)
    }
    */

    let i = 0
    let code = this._partialText.charCodeAt(i)

    //  9: Horizontal Tab
    // 10: Line Feed
    // 11: Vertical Tab
    // 12: New Page
    // 13: Carriage Return
    // 32: Space
    while(code === 32 || (9 <= code && code <= 13)){
      i++
      code = this._partialText.charCodeAt(i)

      if(i >= this._partialText.length){
        this.addPartialText()
      }
    }
    if(i>0){
      this.moveIndex(i)
    }
  }

  /**
   *
   * @access private
   * @returns {void}
   */
  addPartialText() {
    if(this._partialOffset >= this._text.length)
      return

    let newOffset = this._partialOffset + this._partialStep
    if(newOffset > this._text.length){
      newOffset = this._text.length
    }

    this._partialText += this._text.substring(this._partialOffset, newOffset)
    this._partialOffset = newOffset
  }

  /**
   * get integer value
   * @access private
   * @returns {int} -
   */
  getInteger() {
    const str = this.getString(_integerPattern)
    const val = parseInt(str, 10)

    return val
  }

  /**
   * get float value
   * @access private
   * @returns {float} -
   */
  getFloat() {
    const str = this.getString(_floatPattern)
    const val = parseFloat(str)
    return val
  }

  /**
   * skip "," or ";"
   * @access private
   * @returns {void} -
   */
  getCommaOrSemicolon() {
  /*
    return this.getString(this._commaOrSemicolonPattern)
  */
    const code = this._partialText.charCodeAt(0)
    if(code === 44 || code === 59){
      this.moveIndex(1)
    }
  }
    
  /**
   * get string value
   * @access private
   * @returns {string} -
   */
  getWord() {
    return this.getString(_wordPattern)
  }

  /**
   * get UUID string
   * @access private
   * @returns {string} - UUID
   */
  getUUID() {
    return this.getString(_uuidPattern)
  }

  /**
   * get "{"
   * @access private
   * @returns {string} - 
   */
  getLeftBrace() {
    return this.getString(_leftBracePattern)
  }

  /**
   * get "}"
   * @access private
   * @returns {string} - 
   */
  getRightBrace() {
    return this.getString(_rightBracePattern)
  }

  /**
   * get member string
   * @access private
   * @returns {string} - 
   */
  getMember() {
    return this.getString(_memberPattern)
  }

  /**
   * get filename string 
   * @access private
   * @returns {string} - 
   */
  getFilename() {
    const str = this.getString(_filenamePattern)
    return RegExp.$1
  }

  /**
   * get integer array
   * @access private
   * @returns {Array} - 
   */
  getIntegerArray() {
    const n = this.getInteger()
    const arr = []
    for(let i=0; i<n; i++){
      arr.push(this.getInteger())
      this.getCommaOrSemicolon()
    }
    return arr
  }

  /**
   * get float array
   * @access private
   * @returns {Array} - 
   */
  getFloatArray() {
    const n = this.getInteger()
    const arr = []
    for(let i=0; i<n; i++){
      arr.push(this.getInteger())
      this.getCommaOrSemicolon()
    }
    return arr
  }

  /**
   * get Vector3 value
   * @access private
   * @returns {Vector3} - 
   */
  getVector3() {
    const v = new Vector3()
    v.x = this.getFloat()
    v.y = this.getFloat()
    v.z = this.getFloat()
    this.getCommaOrSemicolon()

    return v
  }

  /**
   * get Vector4 value
   * @access private
   * @returns {Vector4} - 
   */
  getVector4() {
    const v = new Vector4()
    v.x = this.getFloat()
    v.y = this.getFloat()
    v.z = this.getFloat()
    v.w = this.getFloat()
    this.getCommaOrSemicolon()

    return v
  }

  /**
   * copy vertices after loading xfile
   * @access private
   * @returns {void}
   */
  splitFaceNormals() {
    const v = this._faceNormalArray
    const vnMap = []
    const normals = []
    const skins = this._obj.skinArray
    const vertexCount = skins.length

    // textureCoordsの設定
    if(skins[0].textureUV == null){
      for(let i=0; i<vertexCount; i++){
        skins[i].textureUV = new TextureUV()
      }
    }

    // 法線の設定
    if(this._faceNormalArray == null){
      // 法線が指定されていない場合、自分で計算する。
      const ins = this._indices
      const numIns = ins.length
      const used = []

      let n = null
      const n1 = new Vector3()
      const n2 = new Vector3()

      for(let i=0; i<numIns; i++){
        if(ins[i].length === 4){
          // 四角形
          const ii = ins[i]
          let s = skins[ii[0]]
          n = new Vector3()
          if(used[ii[0]]){
            //s = Object.assign(new s.constructor(), s)
            s = ObjectAssign(new s.constructor(), s)
            skins[skins.length] = s
          }
          used[ii[0]] = true
          n1.sub(skins[ii[2]].position, skins[ii[0]].position)
          n2.sub(skins[ii[1]].position, skins[ii[0]].position)
          n.cross(n1, n2)
          n.normalize()
          s.normal = n

          n = new Vector3()
          s = skins[ii[1]]
          if(used[ii[1]]){
            //s = Object.assign(new s.constructor(), s)
            s = ObjectAssign(new s.constructor(), s)
            skins[skins.length] = s
          }
          used[ii[1]] = true
          n1.sub(skins[ii[0]].position, skins[ii[1]].position)
          n2.sub(skins[ii[2]].position, skins[ii[1]].position)
          n.cross(n1, n2)
          n.normalize()
          s.normal = n

          n = new Vector3()
          s = skins[ii[2]]
          if(used[ii[2]]){
            //s = Object.assign(new s.constructor(), s)
            s = ObjectAssign(new s.constructor(), s)
            skins[skins.length] = s
          }
          used[ii[2]] = true
          n1.sub(skins[ii[1]].position, skins[ii[2]].position)
          n2.sub(skins[ii[0]].position, skins[ii[2]].position)
          n.cross(n1, n2)
          n.normalize()
          s.normal = n

          n = new Vector3()
          s = skins[ii[3]]
          if(used[ii[3]]){
            //s = Object.assign(new s.constructor(), s)
            s = ObjectAssign(new s.constructor(), s)
            skins[skins.length] = s
          }
          if(!(skins[ii[3]] instanceof Object)){
            console.log('skins[ii[3]] not instance!')
            console.log('i: ' + i + ', ii[3]: ' + ii[3])
          }
          used[ii[3]] = true
          n1.sub(skins[ii[2]].position, skins[ii[3]].position)
          n2.sub(skins[ii[0]].position, skins[ii[3]].position)
          n.cross(n1, n2)
          n.normalize()
          s.normal = n
        }else if(ins[i].length === 3){
          // 三角形
          const ii = ins[i]
          let s = skins[ii[0]]
          n = new Vector3()
          if(used[ii[0]]){
            //s = Object.assign(new s.constructor(), s)
            s = ObjectAssign(new s.constructor(), s)
            skins[skins.length] = s
          }
          used[ii[0]] = true
          n1.sub(skins[ii[2]].position, skins[ii[0]].position)
          n2.sub(skins[ii[1]].position, skins[ii[0]].position)
          n.cross(n1, n2)
          n.normalize()
          s.normal = n

          n = new Vector3()
          s = skins[ii[1]]
          if(used[ii[1]]){
            //s = Object.assign(new s.constructor(), s)
            s = ObjectAssign(new s.constructor(), s)
            skins[skins.length] = s
          }
          used[ii[1]] = true
          n1.sub(skins[ii[0]].position, skins[ii[1]].position)
          n2.sub(skins[ii[2]].position, skins[ii[1]].position)
          n.cross(n1, n2)
          n.normalize()
          s.normal = n

          n = new Vector3()
          s = skins[ii[2]]
          if(used[ii[2]]){
            //s = Object.assign(new s.constructor(), s)
            s = ObjectAssign(new s.constructor(), s)
            skins[skins.length] = s
          }
          used[ii[2]] = true
          n1.sub(skins[ii[1]].position, skins[ii[2]].position)
          n2.sub(skins[ii[0]].position, skins[ii[2]].position)
          n.cross(n1, n2)
          n.normalize()
          s.normal = n


        }else{
          // 未対応
        }
      }
    }else{
      // 同じ頂点に違う法線が指定されている場合、別頂点とする。
      for(let i=0; i<vertexCount; i++){
        vnMap[i] = new Map()
        normals[i] = -1
      }

      const vSize = v.length
      const ins = this._indices
      for(let i=0; i<vSize; i++){
        const vi = v[i]
        const ii = ins[i]
        for(let j=0; j<vi.length; j++){
          if(normals[ii[j]] === -1){
            // 未登録
            normals[ii[j]] = vi[j]
            vnMap[ii[j]].set(vi[j], ii[j])
          }else if(normals[ii[j]] === vi[j]){
            // 登録済み
          }else{
            let newNo = vnMap[ii[j]].get(vi[j])
            if(newNo == null){
              // 未登録
              newNo = vnMap.length
              vnMap[ii[j]].set(vi[j], newNo)
              normals[newNo] = vi[j]
              //this._obj.skinArray[newNo] = this._obj.skinArray[ii[j]].clone()
              const s = this._obj.skinArray[ii[j]]
              //this._obj.skinArray[newNo] = Object.assign(new s.constructor(), s)
              this._obj.skinArray[newNo] = ObjectAssign(new s.constructor(), s)
            }else{
              // 登録済み
            }
          }
        }
      }

      for(let i=0; i<normals.length; i++){
        this._obj.skinArray[i].normal = this._normalArray[normals[i]]
      }
    }
  }

  /**
   * check header format
   * @access private
   * @param {Object} parent - parent object
   * @returns {bool} - true if right header format
   */
  XFileHeader(parent) {
    const text = this._partialText
    if(!text.match(/^xof (\d\d\d\d)([ \w][ \w][ \w][ \w])(\d\d\d\d)/)){
      return false
    }
    
    this.moveIndex(16)

    this.version = RegExp.$1
    this.format = RegExp.$2
    this.floatSize = RegExp.$3
    return true
  }

  /**
   * read Object value
   * @access private
   * @param {Object} parent - parent object
   * @returns {Object} - XObject
   */
  XObjectLong(parent){
    const id = this.getWord()
    if(id == null){
      return null
    }
    switch(id){
      case 'template':
        return this.Template(parent)
      case 'Header':
        return this.Header(parent)
      case 'Mesh':
        return this.Mesh(parent)
      case 'MeshMaterialList':
        return this.MeshMaterialList(parent)
      case 'MeshNormals':
        return this.MeshNormals(parent)
      case 'MeshTextureCoords':
        return this.MeshTextureCoords(parent)
      case 'MeshVertexColors':
        return this.MeshVertexColors(parent)

      default:
        console.error('unknown type:' + id)
        break
    }
    return false
  }

  /**
   * read ColorRGB value
   * @access private
   * @param {Object} parent - parent object
   * @returns {Vector4} - ColorRGB object
   */
  ColorRGB(parent) {
    const color = new Vector4()
    color.x = this.getFloat()
    color.y = this.getFloat()
    color.z = this.getFloat()
    color.w = 1.0
    this.getCommaOrSemicolon()

    return color
  }

  /**
   * read ColorRGBA value
   * @access private
   * @param {Object} parent - parent object
   * @returns {Vector4} - ColorRGBA object
   */
  ColorRGBA(parent) {
    const color = new Vector4()
    color.x = this.getFloat()
    color.y = this.getFloat()
    color.z = this.getFloat()
    color.w = this.getFloat()
    this.getCommaOrSemicolon()

    return color
  }

  /**
   * read Coords2d object
   * @access private
   * @param {Object} parent - parent object
   * @returns {TextureUV} - Coords2d object
   */
  Coords2d(parent) {
    const v = new TextureUV()
    v.u = this.getFloat()
    v.v = this.getFloat()
    this.getCommaOrSemicolon()

    return v
  }

  /**
   * read Template object
   * @access private
   * @param {Object} parent - parent object
   * @returns {bool} - true if right template format
   */
  Template(parent) {
    const name = this.getWord()
    this.getLeftBrace()
    const uuid = this.getUUID()
    let member = null
    do{
      member = this.getMember()
    }while(member != null)
    this.getRightBrace()

    return true
  }

  /**
   * read Header object
   * @access private
   * @param {Object} parent - parent object
   * @returns {bool} - true if right header format
   */
  Header(parent) {
    this.getLeftBrace()
    const major = this.getInteger()
    const minor = this.getInteger()
    const flags = this.getInteger()
    this.getRightBrace()
    return true
  }

  /**
   * read IndexedColor object
   * @access private
   * @param {Object} parent - parent object
   * @returns {Vector4} - ColorRGBA object
   */
  IndexedColor(parent) {
    const index = this.getInteger()
    const color = this.ColorRGBA()
    color.index = index

    return color
  }

  /**
   * read Material object
   * @access private
   * @param {Object} parent - parent object
   * @returns {Material} - Material object
   */
  Material(parent) {
    this.getLeftBrace()
    const material = new Material()

    material.ambient = this.ColorRGBA()
    material.diffuse = material.ambient
    material.shininess = this.getFloat()
    material.specular = this.ColorRGB()
    material.emission = this.ColorRGB()
    material.edge = 0
    material.texture = null

    const name = this.getWord()
    if(name === 'TextureFilename'){
      const texture = this.TextureFilename()
      if(texture != null){
        material.texture = texture
        //material.textureFileName = texture.fileName
      }
    }

    this.getRightBrace()

    return material
  }

  /**
   * read Mesh object
   * @access private
   * @param {Object} parent - parent object
   * @returns {bool} - 
   */
  Mesh(parent) {
    this.getLeftBrace()

    // vertices
    const nVertices = this.getInteger()
    const skinArray = []
    for(let i=0; i<nVertices; i++){
      const skin = new Skin()
      const pos = new Vector3()
      pos.x = this.getFloat()
      pos.y = this.getFloat()
      pos.z = -this.getFloat()
      skin.position = pos

      skin.boneIndex[0] = 0
      skin.boneIndex[1] = -1
      skin.boneIndex[2] = -1
      skin.boneIndex[3] = -1

      skin.skinWeight[0] = 1
      skin.skinWeight[1] = 0
      skin.skinWeight[2] = 0
      skin.skinWeight[3] = 0

      skinArray.push(skin)

      this.getCommaOrSemicolon()
    }
    this._obj.skinArray = skinArray
    this._obj.dynamicSkinOffset = -1

    // faces
    const nFaces = this.getInteger()
    const faces = []
    for(let i=0; i<nFaces; i++){
      const face = this.getIntegerArray()
      faces.push(face)
    }
    this._indices = faces
    this.getRightBrace()

    return true
  }

  /**
   * read MeshMaterial[] object
   * @access private
   * @param {Object} parent - parent object
   * @returns {bool} - 
   */
  MeshMaterialList(parent) {
    this.getLeftBrace()

    // materials
    const nMaterials = this.getInteger()
    this._materialIndex = 0

    const baseBone = new Bone()
    const renderGroups = []
    for(let i=0; i<nMaterials; i++){
      const group = new RenderGroup()
      group.boneArray = []
      group.boneArray[0] = baseBone

      renderGroups.push(group)
    }
    this._obj.renderGroupArray = renderGroups
    this._obj.boneArray.push(baseBone)
    this._obj.rootBone.addChild(baseBone)

    // face materials
    const nFaceIndices = this.getInteger()
    const indices = this._indices
    for(let i=0; i<nFaceIndices; i++){
      const index = this.getInteger()
      this.getCommaOrSemicolon()

      const gind = renderGroups[index].indices
      const ind = indices[i]

      if(ind.length === 3){
        gind.push(ind[0])
        gind.push(ind[2])
        gind.push(ind[1])
      }else if(indices[i].length === 4){
        gind.push(ind[0])
        gind.push(ind[2])
        gind.push(ind[1])
        gind.push(ind[0])
        gind.push(ind[3])
        gind.push(ind[2])
      }else{
        // FIXME: 未対応
      }
    }

    // materials
    let material = null
    let name = this.getWord()
    while(name === 'Material'){
      material = this.Material(parent)

      this._obj.materialArray.push(material)
      this._obj.renderGroupArray[this._materialIndex].material = material
      this._materialIndex++

      name = this.getWord()
    }
        
    this.getRightBrace()

    return true
  }

  /**
   * read MeshNormals object
   * @access private
   * @param {Object} parent - parent object
   * @returns {bool} - 
   */
  MeshNormals(parent) {
    this.getLeftBrace()
    const nNormals = this.getInteger()
    
    this._normalArray = []
    for(let i=0; i<nNormals; i++){
      const v = this.getVector3()
      v.z = -v.z
      this._normalArray.push(v)
    }

    const nFaceNormals = this.getInteger()
    this._faceNormalArray = []
    for(let i=0; i<nFaceNormals; i++){
      const v = this.getIntegerArray()
      this._faceNormalArray.push(v)
    }

    this.getRightBrace()

    return true
  }

  /**
   * read MeshTextureCoords object
   * @access private
   * @param {Object} parent - parent object
   * @returns {bool} - 
   */
  MeshTextureCoords(parent) {
    this.getLeftBrace()

    const skins = this._obj.skinArray
    const nTextureCoords = this.getInteger()
    for(let i=0; i<nTextureCoords; i++){
      skins[i].textureUV = this.Coords2d()
    }

    this.getRightBrace()

    return true
  }

  /**
   * read MeshVertexColors object
   * @access private
   * @param {Object} parent - parent object
   * @returns {bool} - 
   */
  MeshVertexColors(parent) {
    this.getLeftBrace()

    const nVertexColors = this.getInteger()
    for(let i=0; i<nVertexColors; i++){
      const v = this.IndexedColor()
      // FIXME: not implemented.
    }

    this.getRightBrace()

    return true
  }

  /**
   * read TextureFilename object
   * @access private
   * @param {Object} parent - parent object
   * @returns {String} - texture file name
   */
  TextureFilename(parent) {
    this.getLeftBrace()
    let name = this.getFilename()
    name = name.replace('\\\\', '/')
    this.getRightBrace()

    const texture = TextureBank.getTexture(this._parentDirName + name)

    return texture
  }
}



'use strict'

import Bone from '../base/Bone'
import Vector3 from '../base/Vector3'
import Vector4 from '../base/Vector4'
import Material from '../base/Material'
import ObjModel from './ObjModel'
import RenderGroup from '../base/RenderGroup'
import Skin from '../base/Skin'
import TextureUV from '../base/TextureUV'

/**
 * MtlParser class
 * @access public
 */
export default class MtlParser {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    this._data = null
    this._lines = null

    this._obj = null
    this._parentDirName = null
    this._indices = null
    //this._materialIndex = 0
    this._skinArray = null
    //this._normalIndex = 0
    this._faceNormalArray = null
    this._breakFlag = false

    this._offset = 0
    this._err = 0

    this._defaultGroupName = 'default'
    this._smoothingGroup = 0
    this._smoothingVertices = null

    this._parentDirName = './'

    this._normalArray = []
    this._textureUVArray = []
    this._groupName = this._defaultGroupName
    this._smoothingVerticesHash = new Map()
  }

  setParentDirName(dirName) {
    this._parentDirName = dirName
  }

  setModel(obj) {
    this._obj = obj
  }

  setData(data) {
    this._data = data.replace(/( )*\\( )*\n/g, ' ')
    this._lines = this._data.split('\n')
  }

  // FIXME: parse method is unused.
  parse(data){
    console.log('ObjParser.parse start')
    if(data){
      this.setData(data)
    }
    if(!this._obj){
      this._obj = new ObjModel()
    }
    if(!this._obj.skinArray){
      this._obj.skinArray = []
      this._obj.dynamicSkinOffset = -1
    }
    this._skinArray = this._obj.skinArray

    this._offset = 0
    this._err = 0

    const result = this.process()
    /*
    if(this._err){
      alert('obj format error:' + this._err)
      return null
    }
    this.splitFaceNormals()
    */

    console.log('ObjParser.parse end')
    return result
  }

  process() {
    console.log('ObjParser.process start')
    let line = ''
    this._breakFlag = false

    //let v_count = 0
    //let f_count = 0
    let mtllib_name = ''

    while(!this._breakFlag && (line = this.readLine()) !== null){
      const tokens = this.getTokens(line)

      if(tokens.length === 0){
        continue
      }

      switch(tokens[0]){
        case '#': { // comment
          continue
        }

        case 'v': { // geometric vertices
          const skin = new Skin()
          const pos = new Vector3()

          pos.x = parseFloat(tokens[1])
          pos.y = parseFloat(tokens[2])
          pos.z = parseFloat(tokens[3])
          skin.position = pos

          skin.boneIndex[0] = 0
          skin.boneIndex[1] = -1
          skin.boneIndex[2] = -1
          skin.boneIndex[3] = -1

          skin.skinWeight[0] = 1
          skin.skinWeight[1] = 0
          skin.skinWeight[2] = 0
          skin.skinWeight[3] = 0

          skin.normal = null
          skin.textureUV = null

          skin._smoothingGroup = -1

          this._skinArray.push(skin)
          //v_count++
          break
        }

        case 'vt': { // texture vertices
          const uv = new TextureUV()
          uv.u = parseFloat(tokens[1])
          uv.v = parseFloat(tokens[2])
          this._textureUVArray.push(uv)
          break
        }

        case 'vn': { // vertex normals
          const n = new Vector3()
          n.x = parseFloat(tokens[1])
          n.y = parseFloat(tokens[2])
          n.z = parseFloat(tokens[3])
          this._normalArray.push(n)
          break
        }

        case 'vp': { // parameter space vertices
          break
        }
        case 'deg': { // degree
          break
        }
        case 'bmat': { // basis matrix
          break
        }
        case 'step': { // step size
          break
        }
        case 'cstype': { // curve or surface type
          break
        }
        case 'p': { // point
          break
        }
        case 'l': { // line
          break
        }
        case 'f': { // face
          const num_faces = tokens.length - 4
          for(let i=0; i<num_faces; i++){
            const data1 = tokens[i+0].split('/') 
            const data2 = tokens[i+1].split('/')
            const data3 = tokens[i+2].split('/')

            const nv1 = data1[0]; const nt1 = data1[1]; const nn1 = data1[2]
            const nv2 = data2[0]; const nt2 = data2[1]; const nn2 = data2[2]
            const nv3 = data3[0]; const nt3 = data3[1]; const nn3 = data2[2]

            if(nv1 === '' || nv2 === '' || nv3 === ''){
              // error
              console.log('format error: f: vertex index')
              return null
            }

            let v1 = this._skinArray[nv1 - 1]
            if(v1._smoothingGroup === -1){
              // new

              v1._smoothingGroup = this._smoothingGroup
              if(nt1){
                v1.textureUV = this._textureUVArray[nt1 - 1]
              }else{
                v1.textureUV = null
              }

              if(nn1){
                v1.normal = this._normalArray[nn1 - 1]
              }else{
                v1.normal = null
              }
            }else if(v1._smoothingGroup === this._smoothingGroup){
              // same group

              let checkFace = null
              for(checkFace = v1; checkFace; checkFace = checkFace._next){
                // check 
                // check texture
                if(nt1){
                  if(checkFace.texture !== this._textureUVArray[nt1 - 1]){
                    continue
                  }
                }else{
                  if(checkFace.texture){
                    continue
                  }
                }
                // check normal
                if(nn1){
                  if(checkFace.normal !== this._normalArray[nn1 - 1]){
                    continue
                  }
                }else{
                  if(checkFace.normal){
                    continue
                  }
                }
                break
              }
              if(checkFace){
                v1 = checkFace
              }else{
                // create skin
              }
            }else{
              // different group
            }

            const v2 = this._skinArray[nv2 - 1]
            const v3 = this._skinArray[nv3 - 1]


          }
          break
        }

        case 'curv': { // curve
          break
        }
        case 'curv2': { // 2D curve
          break
        }
        case 'surf': { // surface
          break
        }
        case 'parm': { // parameter values
          break
        }
        case 'trim': { // outer trimming loop
          break
        }
        case 'hole': { // inner trimming loop
          break
        }
        case 'scrv': { // special curve
          break
        }
        case 'sp': { // special point
          break
        }
        case 'end': { // end statement
          break
        }
        case 'con': { // connect
          break
        }
        case 'g': { // group name
          if(tokens[1] === ''){
            this._groupName = this._defaultGroupName
          }else{
            this._groupName = tokens[1]
          }
          break
        }

        case 's': { // smoothing group
          if(tokens[1] === 'off' || tokens[1] <= 0){
            this._smoothingGroup = 0
            this._smoothingVertices = null
          }else{
            this._smoothingGroup = tokens[1]
            this._smoothingVertices = this._smoothingVerticesHash.get(this._smoothingGroup)
            if(!this._smoothingVertices){
              this._smoothingVertices = []
              this._smoothingVerticesHash.set(this._smoothingGroup, this._smoothingVertices)
            }
          }
          break
        }

        case 'mg': { // merging group
          break
        }
        case 'o': { // object name
          break
        }
        case 'bevel': { // bevel interpolation
          break
        }
        case 'c_interp': { // color interpolation
          break
        }
        case 'd_interp': { // dissolve interpolation
          break
        }
        case 'lod': { // level of detail
          break
        }
        case 'usemtl': { // material name
          break
        }
        case 'mtllib': { // material library
          mtllib_name = tokens[1]
          console.log('mtllib: ' + mtllib_name)

          // FIXME: MTLReader
          const baseBone = new Bone()
          const renderGroupArray = []
          const renderGroupHash = {}

          const group = new RenderGroup()
          group.boneArray = []
          group.boneArray[0] = baseBone
          renderGroupArray.push(group)

          this._obj.renderGroupArray = renderGroupArray
          this._obj.boneArray.push(baseBone)
          this._obj.rootBone.addChild(baseBone)

          const material = new Material()
          material.ambient = new Vector4()
          material.diffuse = new Vector4()
          material.shininess = 1.0
          material.specular = new Vector3()
          material.emission = new Vector3()
          material.edge = 0
          material.texture = null

          this._obj.materialArray.push(material)
          this._obj.renderGroupArray[0].material = material

          break
        }
        case 'shadow_obj': { // shadow casting
          break
        }
        case 'trace_obj': { // ray tracing
          break
        }
        case 'ctech': { // curve approximation technique
          break
        }
        case 'stech': { // surface approximation technique
          break
        }
        default: { // unknwon type
          break
        }
      }
    }

    if(this._breakFlag){
      return false
    }

    //console.log('v: ' + v_count + '\nf: ' + f_count + '\nmtllib: ' + mtllib_name)

    if(this._err){
      console.log('obj format error:' + this._err)
      return null
    }
    //this.splitFaceNormals()
    console.log('ObjParser.process end')
    return true
  }

  readLine() {
    return this._lines.shift()
  }

  getTokens(line) {
    //return line.split(' ').without('')
    return line.split(' ').filter((str) => { return str !== '' })
  }

/*
  moveIndex(len) {
    this._text = this._text.substring(len)
    this._offset += len
  }
*/

/*
  skip() {
    const str = this._text.match(this._skipPattern)
    if(str != null){
      const len = str[0].length
      this.moveIndex(len)
    }
  }
*/

/*
  getString(pattern) {
    this.skip()
    const str = this._text.match(pattern)
    if(str != null){
      this.moveIndex(str[0].length)
      return str[0]
    }
    return null
  }
*/

  /* matching patterns */
  /*
  _skipPattern: new RegExp(/^\s+/),
  skip() {
    const i=0
    const code
    while(1){
      code = this._text.charCodeAt(i)
      if(code != 32 && (code < 9 || code > 13)){
        break
      }
      i++
    }
    if(i>0){
      this.moveIndex(i)
    }
  }
  */

/*
  _integerPattern: new RegExp(/^(-|\+)?\d+?/),
  getInteger() {
    const str = this.getString(this._integerPattern)
    const val = parseInt(str)
    return val
  }

  _floatPattern: new RegExp(/^(-|\+)?(\d)*\.(\d)*?/),
  getFloat() {
    const str = this.getString(this._floatPattern)
    const val = parseFloat(str)
    return val
  }

  _commaOrSemicolonPattern: new RegExp(/^,|/),
  getCommaOrSemicolon() {
    const code = this._text.charCodeAt(0)
    if(code == 44 || code == 59){
      this.moveIndex(1)
    }
  }
    
  _wordPattern: new RegExp(/^\w+/),
  getWord() {
    return this.getString(this._wordPattern)
  }

  _uuidPattern: new RegExp(/^<[\w-]+>/),
  getUUID() {
    return this.getString(this._uuidPattern)
  }

  _leftBracePattern: new RegExp(/^{/),
  getLeftBrace() {
    return this.getString(this._leftBracePattern)
  }

  _rightBracePattern: new RegExp(/^}/),
  getRightBrace() {
    return this.getString(this._rightBracePattern)
  }

  _memberPattern: new RegExp(/^((array\s+\w+\s+\w+\[(\d+|\w+)\]|\w+\s+\w+)\s*|\[[\w.]+\])/),
  getMember() {
    return this.getString(this._memberPattern)
  }

  _filenamePattern: new RegExp(/^'(.*)'?/),
  getFilename() {
    const str = this.getString(this._filenamePattern)
    return RegExp.$1
  }

  getIntegerArray() {
    const n = this.getInteger()
    const arr = []
    for(var i=0 i<n i++){
      arr.push(this.getInteger())
      this.getCommaOrSemicolon()
    }
    return arr
  }

  getFloatArray() {
    const n = this.getInteger()
    const arr = []
    for(var i=0 i<n i++){
      arr.push(this.getInteger())
      this.getCommaOrSemicolon()
    }
    return arr
  }

  getVector3() {
    const v = new Vector3()
    v.x = this.getFloat()
    v.y = this.getFloat()
    v.z = this.getFloat()
    this.getCommaOrSemicolon()

    return v
  }

  getVector4() {
    const v = new Vector4()
    v.x = this.getFloat()
    v.y = this.getFloat()
    v.z = this.getFloat()
    v.w = this.getFloat()
    this.getCommaOrSemicolon()

    return v
  }

  // Xファイル読み込み後に頂点をコピー
  splitFaceNormals(){
    const v = this._faceNormalArray
    const vnMap = []
    const normals = []
    const skins = this._obj.skinArray
    const vertexCount = skins.length

    // textureCoordsの設定
    if(skins[0].textureUV == null){
      for(var i=0 i<vertexCount i++){
        skins[i].textureUV = new TextureUV()
      }
    }

    // 法線の設定
    if(this._faceNormalArray == null){
      // 法線が指定されていない場合、自分で計算する。
      const ins = this._indices
      const numIns = ins.length
      const used = []

      const n
      const n1 = new Vector3()
      const n2 = new Vector3()

      for(var i=0 i<numIns i++){
        if(ins[i].length == 4){
          // 四角形
          const ii = ins[i]
          const s = skins[ii[0]]
          n = new Vector3()
          if(used[ii[0]]){
            s = Object.clone(s)
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
            s = Object.clone(s)
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
            s = Object.clone(s)
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
            s = Object.clone(s)
            skins[skins.length] = s
          }
          if(!(skins[ii[3]] instanceof Object)){
            alert('skins[ii[3]] not instance!')
            alert('i: ' + i + ', ii[3]: ' + ii[3])
          }
          used[ii[3]] = true
          n1.sub(skins[ii[2]].position, skins[ii[3]].position)
          n2.sub(skins[ii[0]].position, skins[ii[3]].position)
          n.cross(n1, n2)
          n.normalize()
          s.normal = n
        }else if(ins[i].length == 3){
          // 三角形
          const ii = ins[i]
          const s = skins[ii[0]]
          n = new Vector3()
          if(used[ii[0]]){
            s = Object.clone(s)
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
            s = Object.clone(s)
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
            s = Object.clone(s)
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
      for(var i=0 i<vertexCount i++){
        vnMap[i] = {}
        normals[i] = -1
      }

      const vSize = v.length
      const ins = this._indices
      for(var i=0 i<vSize i++){
        const vi = v[i]
        const ii = ins[i]
        for(var j=0 j<vi.length j++){
          if(normals[ii[j]] == -1){
            // 未登録
            normals[ii[j]] = vi[j]
            vnMap[ii[j]].set(vi[j], ii[j])
          }else if(normals[ii[j]] == vi[j]){
            // 登録済み
          }else{
            const newNo = vnMap[ii[j]].get(vi[j])
            if(newNo == null){
              // 未登録
              newNo = vnMap.length
              vnMap[ii[j]].set(vi[j], newNo)
              normals[newNo] = vi[j]
              //this._obj.skinArray[newNo] = this._obj.skinArray[ii[j]].clone()
              this._obj.skinArray[newNo] = Object.clone(this._obj.skinArray[ii[j]])
            }else{
              // 登録済み
            }
          }
        }
      }

      for(var i=0 i<normals.length i++){
        this._obj.skinArray[i].normal = this._normalArray[normals[i]]
      }
    }
  }

  XFileHeader(parent){
    const text = this._text
    if(!text.match(/^xof (\d\d\d\d)([ \w][ \w][ \w][ \w])(\d\d\d\d)/)){
      return false
    }
    this.moveIndex(16)

    this.version = RegExp.$1
    this.format = RegExp.$2
    this.floatSize = RegExp.$3
    return true
  }

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
        alert('unknown type:' + id)
        break
    }
    return false
  }

  ColorRGB(parent) {
    const color = new Vector4()
    color.x = this.getFloat()
    color.y = this.getFloat()
    color.z = this.getFloat()
    color.w = 1.0
    this.getCommaOrSemicolon()

    return color
  }

  ColorRGBA(parent) {
    const color = new Vector4()
    color.x = this.getFloat()
    color.y = this.getFloat()
    color.z = this.getFloat()
    color.w = this.getFloat()
    this.getCommaOrSemicolon()

    return color
  }

  Coords2d(parent) {
    const v = new TextureUV()
    v.u = this.getFloat()
    v.v = this.getFloat()
    this.getCommaOrSemicolon()

    return v
  }

  Template(parent) {
    const name = this.getWord()
    this.getLeftBrace()
    const uuid = this.getUUID()
    do{
      const member = this.getMember()
    }while(member != null)
    this.getRightBrace()
    return true
  }

  Header(parent) {
    this.getLeftBrace()
    const major = this.getInteger()
    const minor = this.getInteger()
    const flags = this.getInteger()
    this.getRightBrace()
    return true
  }

  IndexedColor(parent) {
    const index = this.getInteger()
    const color = this.ColorRGBA()
    color.index = index

    return color
  }

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
    if(name == 'TextureFilename'){
      const texture = this.TextureFilename()
      if(texture != null){
        material.texture = texture
        //material.textureFileName = texture.fileName
      }
    }

    this.getRightBrace()

    return material
  }

  Mesh(parent) {
    this.getLeftBrace()

    // vertices
    const nVertices = this.getInteger()
    const skinArray = []
    for(var i=0 i<nVertices i++){
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
    for(var i=0 i<nFaces i++){
      const face = this.getIntegerArray()
      faces.push(face)
    }
    this._indices = faces
    this.getRightBrace()

    return true
  }

  MeshMaterialList(parent) {
    this.getLeftBrace()

    // materials
    const nMaterials = this.getInteger()
    this._materialIndex = 0

    const baseBone = new Bone()
    const renderGroups = []
    for(var i=0 i<nMaterials i++){
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
    for(var i=0 i<nFaceIndices i++){
      const index = this.getInteger()
      this.getCommaOrSemicolon()

      const gind = renderGroups[index].indices
      const ind = indices[i]

      if(ind.length == 3){
        gind.push(ind[0])
        gind.push(ind[2])
        gind.push(ind[1])
      }else if(indices[i].length == 4){
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
    const material = null
    while(1){
      const name = this.getWord()
      if(name == 'Material'){
        material = this.Material(parent)

        this._obj.materialArray.push(material)
        this._obj.renderGroupArray[this._materialIndex].material = material
        this._materialIndex++
      }else{
        break
      }
    }
        
    this.getRightBrace()

    return true
  }

  MeshNormals(parent) {
    this.getLeftBrace()
    const nNormals = this.getInteger()
    
    this._normalArray = []
    for(var i=0 i<nNormals i++){
      const v = this.getVector3()
      v.z = -v.z
      this._normalArray.push(v)
    }

    const nFaceNormals = this.getInteger()
    this._faceNormalArray = []
    for(var i=0 i<nFaceNormals i++){
      const v = this.getIntegerArray()
      this._faceNormalArray.push(v)
    }

    this.getRightBrace()

    return true
  }

  MeshTextureCoords(parent) {
    this.getLeftBrace()

    const skins = this._obj.skinArray
    const nTextureCoords = this.getInteger()
    for(var i=0 i<nTextureCoords i++){
      skins[i].textureUV = this.Coords2d()
    }

    this.getRightBrace()

    return true
  }

  MeshVertexColors(parent) {
    this.getLeftBrace()

    const nVertexColors = this.getInteger()
    for(var i=0 i<nVertexColors i++){
      const v = this.IndexedColor()
      // FIXME: not implemented.
    }

    this.getRightBrace()

    return true
  }

  TextureFilename(parent) {
    this.getLeftBrace()
    const name = this.getFilename()
    name = name.replace('\\\\', '/')
    this.getRightBrace()

    const texture = TextureBank.getTexture(this._parentDirName + name)

    return texture
  }
*/
}

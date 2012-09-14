/*--------------------------------------------------------------------------------
 * DH3DLibrary XParser.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var XParser = Class.create({
  _text: null,
  _obj: null,
  _parentDirName: null,
  _indices: null,
  _materialIndex: 0,
  _normalArray: null,
  _faceNormalArray: null,

  _offset: 0,
  _err: 0,

  initialize: function() {
    this._parentDirName = './';
  },

  setParentDirName: function(dirName) {
    this._parentDirName = dirName;
  },

  setModel: function(obj) {
    this._obj = obj;
  },

  parse: function(text){
    this._text = text;
    if(!this._obj){
      this._obj = new XModel();
    }
    this._offset = 0;
    this._err = 0;

    if(!this.XFileHeader(this._obj)){
      alert("header format error");
      this._err = 1;
      return null;
    }
    while(this.XObjectLong(this._obj)){}
    if(this._err){
      alert("obj format error:" + this._err);
      return null;
    }
    this.splitFaceNormals();

    return this._obj;
  },

  moveIndex: function(len) {
    this._text = this._text.substring(len);
    this._offset += len;
  },

/*
  skip: function() {
    var str = this._text.match(this._skipPattern);
    if(str != null){
      var len = str[0].length;
      this.moveIndex(len);
    }
  },
*/

  getString: function(pattern) {
    this.skip();
    var str = this._text.match(pattern);
    if(str != null){
      this.moveIndex(str[0].length);
      return str[0];
    }
    return null;
  },

  /* matching patterns */
  _skipPattern: new RegExp(/^\s+/),
  skip: function() {
    var i=0;
    var code;
    while(1){
      code = this._text.charCodeAt(i);
      if(code != 32 && (code < 9 || code > 13)){
        break;
      }
      i++;
    }
    if(i>0){
      this.moveIndex(i);
    }

/*
    var str = this._text.match(this._skipPattern);
    if(str != null && str[0].length != i){
      alert("str[0].length = " + str[0].length + "\ni = " + i + ", code = " + code + "\n" + this._text.substring(0, 10));
    }
    if(str != null){
      this.moveIndex(str[0].length);
    }
    */
  },

  _integerPattern: new RegExp(/^(-|\+)?\d+;?/),
  getInteger: function() {
    var str = this.getString(this._integerPattern);
    var val = parseInt(str);
    return val;
  },

  _floatPattern: new RegExp(/^(-|\+)?(\d)*\.(\d)*;?/),
  getFloat: function() {
    var str = this.getString(this._floatPattern);
    var val = parseFloat(str);
    return val;
  },

  _commaOrSemicolonPattern: new RegExp(/^,|;/),
  getCommaOrSemicolon: function() {
  /*
    return this.getString(this._commaOrSemicolonPattern);
  */
    var code = this._text.charCodeAt(0);
    if(code == 44 || code == 59){
      this.moveIndex(1);
    }
  },
    
  _wordPattern: new RegExp(/^\w+/),
  getWord: function() {
    return this.getString(this._wordPattern);
  },

  _uuidPattern: new RegExp(/^<[\w-]+>/),
  getUUID: function() {
    return this.getString(this._uuidPattern);
  },

  _leftBracePattern: new RegExp(/^{/),
  getLeftBrace: function() {
    return this.getString(this._leftBracePattern);
  },

  _rightBracePattern: new RegExp(/^}/),
  getRightBrace: function() {
    return this.getString(this._rightBracePattern);
  },

  _memberPattern: new RegExp(/^((array\s+\w+\s+\w+\[(\d+|\w+)\]|\w+\s+\w+)\s*;|\[[\w.]+\])/),
  getMember: function() {
    return this.getString(this._memberPattern);
  },

  _filenamePattern: new RegExp(/^"(.*)";?/),
  getFilename: function() {
    var str = this.getString(this._filenamePattern);
    return RegExp.$1;
  },

  getIntegerArray: function() {
    var n = this.getInteger();
    var arr = $A();
    for(var i=0; i<n; i++){
      arr.push(this.getInteger());
      this.getCommaOrSemicolon();
    }
    return arr;
  },

  getFloatArray: function() {
    var n = this.getInteger();
    var arr = $A();
    for(var i=0; i<n; i++){
      arr.push(this.getInteger())
      this.getCommaOrSemicolon();
    }
    return arr;
  },

  getVector3: function() {
    var v = new DHVector3();
    v.x = this.getFloat();
    v.y = this.getFloat();
    v.z = this.getFloat();
    this.getCommaOrSemicolon();

    return v;
  },

  getVector4: function() {
    var v = new DHVector4();
    v.x = this.getFloat();
    v.y = this.getFloat();
    v.z = this.getFloat();
    v.w = this.getFloat();
    this.getCommaOrSemicolon();

    return v;
  },

  // Xファイル読み込み後に頂点をコピー
  splitFaceNormals: function(){
    var v = this._faceNormalArray;
    var vnMap = $A();
    var normals = $A();
    var skins = this._obj.skinArray;
    var vertexCount = skins.size();

    // textureCoordsの設定
    if(skins[0].textureUV == null){
      for(var i=0; i<vertexCount; i++){
        skins[i].textureUV = new TextureUV();
      }
    }

    // 法線の設定
    if(this._faceNormalArray == null){
      // 法線が指定されていない場合、自分で計算する。
      var ins = this._indices;
      var numIns = ins.size();
      var used = $A();

      var n;
      var n1 = new DHVector3();
      var n2 = new DHVector3();

      for(var i=0; i<numIns; i++){
        if(ins[i].size() == 4){
          // 四角形
          var ii = ins[i];
          var s = skins[ii[0]];
          n = new DHVector3();
          if(used[ii[0]]){
            s = Object.clone(s);
            skins[skins.size()] = s;
          }
          used[ii[0]] = true;
          n1.sub(skins[ii[2]].position, skins[ii[0]].position);
          n2.sub(skins[ii[1]].position, skins[ii[0]].position);
          n.cross(n1, n2);
          n.normalize();
          s.normal = n;

          n = new DHVector3();
          s = skins[ii[1]];
          if(used[ii[1]]){
            s = Object.clone(s);
            skins[skins.size()] = s;
          }
          used[ii[1]] = true;
          n1.sub(skins[ii[0]].position, skins[ii[1]].position);
          n2.sub(skins[ii[2]].position, skins[ii[1]].position);
          n.cross(n1, n2);
          n.normalize();
          s.normal = n;

          n = new DHVector3();
          s = skins[ii[2]];
          if(used[ii[2]]){
            s = Object.clone(s);
            skins[skins.size()] = s;
          }
          used[ii[2]] = true;
          n1.sub(skins[ii[1]].position, skins[ii[2]].position);
          n2.sub(skins[ii[0]].position, skins[ii[2]].position);
          n.cross(n1, n2);
          n.normalize();
          s.normal = n;

          n = new DHVector3();
          s = skins[ii[3]];
          if(used[ii[3]]){
            s = Object.clone(s);
            skins[skins.size()] = s;
          }
          if(!(skins[ii[3]] instanceof Object)){
            alert("skins[ii[3]] not instance!");
            alert("i: " + i + ", ii[3]: " + ii[3]);
          }
          used[ii[3]] = true;
          n1.sub(skins[ii[2]].position, skins[ii[3]].position);
          n2.sub(skins[ii[0]].position, skins[ii[3]].position);
          n.cross(n1, n2);
          n.normalize();
          s.normal = n;
        }else if(ins[i].size() == 3){
          // 三角形
          var ii = ins[i];
          var s = skins[ii[0]];
          n = new DHVector3();
          if(used[ii[0]]){
            s = Object.clone(s);
            skins[skins.size()] = s;
          }
          used[ii[0]] = true;
          n1.sub(skins[ii[2]].position, skins[ii[0]].position);
          n2.sub(skins[ii[1]].position, skins[ii[0]].position);
          n.cross(n1, n2);
          n.normalize();
          s.normal = n;

          n = new DHVector3();
          s = skins[ii[1]];
          if(used[ii[1]]){
            s = Object.clone(s);
            skins[skins.size()] = s;
          }
          used[ii[1]] = true;
          n1.sub(skins[ii[0]].position, skins[ii[1]].position);
          n2.sub(skins[ii[2]].position, skins[ii[1]].position);
          n.cross(n1, n2);
          n.normalize();
          s.normal = n;

          n = new DHVector3();
          s = skins[ii[2]];
          if(used[ii[2]]){
            s = Object.clone(s);
            skins[skins.size()] = s;
          }
          used[ii[2]] = true;
          n1.sub(skins[ii[1]].position, skins[ii[2]].position);
          n2.sub(skins[ii[0]].position, skins[ii[2]].position);
          n.cross(n1, n2);
          n.normalize();
          s.normal = n;


        }else{
          // 未対応
        }
      }
    }else{
      // 同じ頂点に違う法線が指定されている場合、別頂点とする。
      for(var i=0; i<vertexCount; i++){
        vnMap[i] = $H();
        normals[i] = -1;
      }

      var vSize = v.size();
      var ins = this._indices;
      for(var i=0; i<vSize; i++){
        var vi = v[i];
        var ii = ins[i];
        for(var j=0; j<vi.size(); j++){
          if(normals[ii[j]] == -1){
            // 未登録
            normals[ii[j]] = vi[j];
            vnMap[ii[j]].set(vi[j], ii[j]);
          }else if(normals[ii[j]] == vi[j]){
            // 登録済み
          }else{
            var newNo = vnMap[ii[j]].get(vi[j]);
            if(newNo == null){
              // 未登録
              newNo = vnMap.size();
              vnMap[ii[j]].set(vi[j], newNo);
              normals[newNo] = vi[j];
              //this._obj.skinArray[newNo] = this._obj.skinArray[ii[j]].clone();
              this._obj.skinArray[newNo] = Object.clone(this._obj.skinArray[ii[j]]);
            }else{
              // 登録済み
            }
          }
        }
      }

      for(var i=0; i<normals.size(); i++){
        this._obj.skinArray[i].normal = this._normalArray[normals[i]];
      }
    }
  },

  XFileHeader: function(parent){
    var text = this._text;
    if(!text.match(/^xof (\d\d\d\d)([ \w][ \w][ \w][ \w])(\d\d\d\d)/)){
      return false;
    }
    this.moveIndex(16);

    this.version = RegExp.$1;
    this.format = RegExp.$2;
    this.floatSize = RegExp.$3;
    return true;
  },

  XObjectLong: function(parent){
    var id = this.getWord();
    if(id == null){
      return null;
    }
    switch(id){
      case "template":
        return this.Template(parent);
      case "Header":
        return this.Header(parent);
      case "Mesh":
        return this.Mesh(parent);
      case "MeshMaterialList":
        return this.MeshMaterialList(parent);
      case "MeshNormals":
        return this.MeshNormals(parent);
      case "MeshTextureCoords":
        return this.MeshTextureCoords(parent);
      case "MeshVertexColors":
        return this.MeshVertexColors(parent);

      default:
        alert("unknown type:" + id);
        break;
    }
    return false;
  },

  ColorRGB: function(parent) {
    var color = new DHVector4();
    color.x = this.getFloat();
    color.y = this.getFloat();
    color.z = this.getFloat();
    color.w = 1.0;
    this.getCommaOrSemicolon();

    return color;
  },

  ColorRGBA: function(parent) {
    var color = new DHVector4();
    color.x = this.getFloat();
    color.y = this.getFloat();
    color.z = this.getFloat();
    color.w = this.getFloat();
    this.getCommaOrSemicolon();

    return color;
  },

  Coords2d: function(parent) {
    var v = new TextureUV();
    v.u = this.getFloat();
    v.v = this.getFloat();
    this.getCommaOrSemicolon();

    return v;
  },

  Template: function(parent) {
    var name = this.getWord();
    this.getLeftBrace();
    var uuid = this.getUUID();
    do{
      var member = this.getMember();
    }while(member != null);
    this.getRightBrace();
    return true;
  },

  Header: function(parent) {
    this.getLeftBrace();
    var major = this.getInteger();
    var minor = this.getInteger();
    var flags = this.getInteger();
    this.getRightBrace();
    return true;
  },

  IndexedColor: function(parent) {
    var index = this.getInteger();
    var color = this.ColorRGBA();
    color.index = index;

    return color;
  },

  Material: function(parent) {
    this.getLeftBrace();
    var material = new Material();

    material.ambient = this.ColorRGBA();
    material.diffuse = material.ambient;
    material.shininess = this.getFloat();
    material.specular = this.ColorRGB();
    material.emission = this.ColorRGB();
    material.edge = 0;
    material.texture = null;

    var name = this.getWord();
    if(name == "TextureFilename"){
      var texture = this.TextureFilename();
      if(texture != null){
        material.texture = texture;
        //material.textureFileName = texture.fileName;
      }
    }

    this.getRightBrace();

    return material;
  },

  Mesh: function(parent) {
    this.getLeftBrace();

    // vertices
    var nVertices = this.getInteger();
    var skinArray = $A();
    for(var i=0; i<nVertices; i++){
      var skin = new Skin();
      var pos = new DHVector3();
      pos.x = this.getFloat();
      pos.y = this.getFloat();
      pos.z = -this.getFloat();
      skin.position = pos;

      skin.boneIndex[0] = 0;
      skin.boneIndex[1] = -1;
      skin.boneIndex[2] = -1;
      skin.boneIndex[3] = -1;

      skin.skinWeight[0] = 1;
      skin.skinWeight[1] = 0;
      skin.skinWeight[2] = 0;
      skin.skinWeight[3] = 0;

      skinArray.push(skin);

      this.getCommaOrSemicolon();
    }
    this._obj.skinArray = skinArray;
    this._obj.dynamicSkinOffset = -1;

    // faces
    var nFaces = this.getInteger();
    var faces = $A();
    for(var i=0; i<nFaces; i++){
      var face = this.getIntegerArray();
      faces.push(face);
    }
    this._indices = faces;
    this.getRightBrace();

    return true;
  },

  MeshMaterialList: function(parent) {
    this.getLeftBrace();

    // materials
    var nMaterials = this.getInteger();
    this._materialIndex = 0;

    var baseBone = new Bone();
    var renderGroups = $A();
    for(var i=0; i<nMaterials; i++){
      var group = new RenderGroup();
      group.boneArray = $A();
      group.boneArray[0] = baseBone;

      renderGroups.push(group);
    }
    this._obj.renderGroupArray = renderGroups;
    this._obj.boneArray.push(baseBone);
    this._obj.rootBone.addChild(baseBone);

    // face materials
    var nFaceIndices = this.getInteger();
    var indices = this._indices;
    for(var i=0; i<nFaceIndices; i++){
      var index = this.getInteger();
      this.getCommaOrSemicolon();

      var gind = renderGroups[index].indices;
      var ind = indices[i];

      if(ind.size() == 3){
        gind.push(ind[0]);
        gind.push(ind[2]);
        gind.push(ind[1]);
      }else if(indices[i].size() == 4){
        gind.push(ind[0]);
        gind.push(ind[2]);
        gind.push(ind[1]);
        gind.push(ind[0]);
        gind.push(ind[3]);
        gind.push(ind[2]);
      }else{
        // FIXME: 未対応
      }
    }

    // materials
    var material = null;
    while(1){
      var name = this.getWord();
      if(name == "Material"){
        material = this.Material(parent);

        this._obj.materialArray.push(material);
        this._obj.renderGroupArray[this._materialIndex].material = material;
        this._materialIndex++;
      }else{
        break;
      }
    }
        
    this.getRightBrace();

    return true;
  },

  MeshNormals: function(parent) {
    this.getLeftBrace();
    var nNormals = this.getInteger();
    
    this._normalArray = $A();
    for(var i=0; i<nNormals; i++){
      var v = this.getVector3();
      v.z = -v.z;
      this._normalArray.push(v);
    }

    var nFaceNormals = this.getInteger();
    this._faceNormalArray = $A();
    for(var i=0; i<nFaceNormals; i++){
      var v = this.getIntegerArray();
      this._faceNormalArray.push(v);
    }

    this.getRightBrace();

    return true;
  },

  MeshTextureCoords: function(parent) {
    this.getLeftBrace();

    var skins = this._obj.skinArray;
    var nTextureCoords = this.getInteger();
    for(var i=0; i<nTextureCoords; i++){
      skins[i].textureUV = this.Coords2d();
    }

    this.getRightBrace();

    return true;
  },

  MeshVertexColors: function(parent) {
    this.getLeftBrace();

    var nVertexColors = this.getInteger();
    for(var i=0; i<nVertexColors; i++){
      var v = this.IndexedColor();
      // FIXME: not implemented.
    }

    this.getRightBrace();

    return true;
  },

  TextureFilename: function(parent) {
    this.getLeftBrace();
    var name = this.getFilename();
    name = name.replace("\\\\", "/");
    this.getRightBrace();

    var texture = TextureBank.getTexture(this._parentDirName + name);

    return texture;
  },
});

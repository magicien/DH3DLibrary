/*--------------------------------------------------------------------------------
 * DH3DLibrary PMDReader.js v0.1.0
 * Copyright (c) 2010-2011 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var PMDReader = Class.create(ModelReader, {
  _binaryReader: null,

  _model: null,
  _parentDirName: null,

  _maxEffBonesLength: 20, // FIXME: bind to vertex shader

  _leftKneeName: String.fromCharCode(0x5DE6, 0x3072, 0x3056),  // 「左ひざ」
  _rightKneeName: String.fromCharCode(0x53F3, 0x3072, 0x3056), // 「右ひざ」

  initialize: function($super) {
    $super();
  },

  readModel: function(url){
    if(url.substr(-4) != ".pmd"){
      return false;
    }

    var obj = this;
    var onload = function(){ obj.readModelProcess(url); };

    this._model = new PMDModel();
    this._binaryReader = new BinaryReader(url, false, 'sjis', onload);

    return this._model;
  },

  readModelFromFile: function(file) {
    if(file.name.substr(-4) != ".pmd"){
      alert("filename_error: " + file.name);
      return false;
    }

    var obj = this;
    var onload = function(){ obj.readModelProcess(url); };

    this._model = PMDModel();
    this._binaryReader = new BinaryReader(file, false, 'sjis', onload);

    return this._model;
  },

  readModelProcess: function(url) {
    var result = this.readModelSub(url);

    if(!result){
      if(this._model.onerror){
        this._model.onerror();
      }
    }else{
      this._model.loaded = true;
      if(this._model.onload){
        this._model.onload();
      }
    }
    if(this._model.onloadend){
      this._model.onloadend();
    }
  },

  readModelSub: function(url){
    this._parentDirName = (new String(url)).gsub(/\/[^\/]*$/, "/");
    if(url == this._parentDirName){
      this._parentDirName = "./";
    }

    var result = this.readHeader();
    if(!result){
      return false;
    }

    this.readVertex();
    this.readIndex();
    this.readMaterial();
    this.readBone();
    this.updateVertexBone();
    this.readIK();
    this.readFace();
    this.readFaceDisplay();
    this.readBoneDisplayName();
    this.readBoneDisplay();
    this.initRenderGroup();

    if(!this._binaryReader.hasBytesAvailable())
      return this._model;

    this.readEnglishInfo();

    if(!this._binaryReader.hasBytesAvailable())
      return this._model;

    this.readToonTexture();

    if(!this._binaryReader.hasBytesAvailable())
      return this._model;

    this.readRigidBody();

    if(!this._binaryReader.hasBytesAvailable())
      return this._model;

    this.readConstraint();

    return this._model;
  },

  readHeader: function() {
    var magic = this._binaryReader.readString(3);
    if(magic != "Pmd"){
      //myAlert("PMD Format Error");
      return false;
    }
    this._model.version = this._binaryReader.readFloat();   
    this._model.modelName = this._binaryReader.readString(20);
    this._model.comment = this._binaryReader.readString(256);
    //myAlert(this._model.modelName + "\n" + this._model.comment);
    return true;
  },
  
  readVertex: function() {
    var vertexCount = this._binaryReader.readUnsignedInt();
    if(vertexCount <= 0){
      //myAlert("PMD vertexCount error.");
    }

    //myAlert("vertexCount: "+vertexCount);

    this._model.skinArray = $A();
    for(var i=0; i<vertexCount; i++){
      this._model.skinArray[i] = new Skin();

      this._model.skinArray[i].position = new DHVector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      );
      this._model.skinArray[i].normal = new DHVector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      );
      this._model.skinArray[i].textureUV = new TextureUV(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat()
      );
      this._model.skinArray[i].boneNum[0] = this._binaryReader.readUnsignedShort();
      this._model.skinArray[i].boneNum[1] = this._binaryReader.readUnsignedShort();

      this._model.skinArray[i].skinWeight[0] = this._binaryReader.readUnsignedByte() / 100.0;
      this._model.skinArray[i].skinWeight[1] = 1.0 - this._model.skinArray[i].skinWeight[0];
      this._model.skinArray[i].skinWeight[2] = 0.0;
      this._model.skinArray[i].skinWeight[3] = 0.0;

      this._model.skinArray[i].edge = this._binaryReader.readUnsignedByte();
    }
  },

  readIndex: function() {
    var indexCount = this._binaryReader.readUnsignedInt();
    //myAlert("indexCount: "+indexCount);

    this._model.indexArray = $A();
    for(i=0; i<indexCount; i++){
      this._model.indexArray[i] = this._binaryReader.readUnsignedShort();
    }
  },

  readMaterial: function() {
    var materialCount = this._binaryReader.readUnsignedInt();

    //myAlert("materialCount: "+materialCount);
    this._model.materialArray = $A();
    var indexCount = 0;
    for(var i=0; i<materialCount; i++){
      var materialObj = new Material();

      materialObj.diffuse = new DHVector4(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat()
      );
      materialObj.shininess = this._binaryReader.readFloat();
      materialObj.specular = new DHVector4(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        1.0
      );
      materialObj.ambient = new DHVector4(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        1.0
      );
      materialObj.toonIndex = this._binaryReader.readUnsignedByte();
      materialObj.edge = this._binaryReader.readUnsignedByte();
      materialObj.indexCount = this._binaryReader.readUnsignedInt();

      var textureFile = this._binaryReader.readString(20);
      var sphereFile = "";
      if(fileName.indexOf("*")){
        var names = fileName.split("*");
        textureFile = names[0];
        sphereFile = names[1];
      }
      materialObj.textureFileName = this._parentDirName + textureFile;
      materialObj.sphereFileName = this._parentDirName + sphereFile;
      if(materialObj.textureFileName != this._parentDirName){
        materialObj.texture = TextureBank.getTexture(materialObj.textureFileName);
      }
      if(materialObj.sphereFileName != this._parentDirName){
        materialObj.sphere = TextureBank.getTexture(materialObj.sphereFileName);
      }

      this._model.materialArray[i] = materialObj;
    }
  },

  readBone: function() {
    var boneCount = this._binaryReader.readUnsignedShort();
    
    //myAlert("boneCount: "+boneCount);
    this._model.boneArray = $A();
    for(var i=0; i<boneCount; i++){
      var boneObj = new Bone();
      
      boneObj.name = this._binaryReader.readString(20);
      boneObj.parentNo = this._binaryReader.readUnsignedShort();
      boneObj.childNo = this._binaryReader.readUnsignedShort();
      boneObj.type = this._binaryReader.readUnsignedByte();
      boneObj.ikTarget = this._binaryReader.readUnsignedShort();
      boneObj.bonePosition = new DHVector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat()
      );
      this._model.boneArray[i] = boneObj;
      this._model.boneHash.set(boneObj.name, boneObj);
    }

    // 親ボーンの設定
    for(var i=0; i<boneCount; i++){
      var bone = this._model.boneArray[i];
      if(bone.parentNo != 0xFFFF){
        this._model.boneArray[bone.parentNo].addChild(bone);
      }else{
        this._model.rootBone.addChild(bone);
      }
    }

    // 初期化処理
    this._model.boneArray.each( function(bone){
      bone.initBoneData();
    });
  },

  readIK: function() {
    var boneArray = this._model.boneArray;
    var ikCount = this._binaryReader.readUnsignedShort();

    this._model.ikArray = $A();
    for(var i=0; i<ikCount; i++){
      var ikObj = new IK();
      var targetBoneNo = this._binaryReader.readUnsignedShort();
      var effectBoneNo = this._binaryReader.readUnsignedShort();

      ikObj.targetBone = boneArray[targetBoneNo];
      ikObj.effectBone = boneArray[effectBoneNo];
      var numLink = this._binaryReader.readUnsignedByte();
      ikObj.iteration = this._binaryReader.readUnsignedShort();
      ikObj.weight = this._binaryReader.readFloat() * Math.PI;

      ikObj.boneList = $A();
      ikObj.minAngleList = $A();
      ikObj.maxAngleList = $A();
      for(var j=0; j<numLink; j++){
        var linkNo = this._binaryReader.readUnsignedShort();
        ikObj.boneList.push(boneArray[linkNo]);
        
        var boneName = new String(boneArray[linkNo].name);
        if((boneArray[linkNo].name == this._leftKneeName) || (boneArray[linkNo].name == this._rightKneeName)){
          ikObj.minAngleList[j] = new DHVector3(0.003, 0.0, 0.0);
          ikObj.maxAngleList[j] = new DHVector3(Math.PI-0.003, 0.0, 0.0);
        }
      }
      this._model.ikArray[i] = ikObj;
    }
  },

  readFace: function() {
    var faceCount = this._binaryReader.readUnsignedShort();

    this._model.faceArray = $A();
    for(var i=0; i<faceCount; i++){
      var faceObj = new Face();

      faceObj.name = this._binaryReader.readString(20);
      faceObj.numVertices = this._binaryReader.readUnsignedInt();
      faceObj.type = this._binaryReader.readUnsignedByte();
      faceObj.vertices = $A();
      for(var j=0; j<faceObj.numVertices; j++){
        var faceVertexObj = new FaceVertex();
        faceVertexObj.index = this._binaryReader.readUnsignedInt();
        faceVertexObj.position = new DHVector3(
          this._binaryReader.readFloat(),
          this._binaryReader.readFloat(),
         -this._binaryReader.readFloat()
        );
        faceObj.vertices[j] = faceVertexObj;
      }
      this._model.faceArray[i] = faceObj;
      this._model.faceHash.set(faceObj.name, faceObj);
    }
  },

  readFaceDisplay: function() {
    var faceDisplayCount = this._binaryReader.readUnsignedByte();

    this._model.faceDisplayArray = $A();
    for(var i=0; i<faceDisplayCount; i++){
      this._model.faceDisplayArray[i] = this._binaryReader.readUnsignedShort();
    }
  },

  readBoneDisplayName: function() {
    var boneDisplayNameCount = this._binaryReader.readUnsignedByte();

    this._model.boneDisplayNameArray = $A();
    for(var i=0; i<boneDisplayNameCount; i++){
      this._model.boneDisplayNameArray[i] = this._binaryReader.readString(50);
    }
  },

  readBoneDisplay: function() {
    var boneDisplayCount = this._binaryReader.readUnsignedInt();

    this._model.boneDisplayIndex = $A();
    this._model.boneDisplayFrameIndex = $A();
    for(var i=0; i<boneDisplayCount; i++){
      this._model.boneDisplayIndex[i] = this._binaryReader.readUnsignedShort();
      this._model.boneDisplayFrameIndex[i] = this._binaryReader.readUnsignedByte();
    }
  },

  readEnglishInfo: function() {
    this._model.englishCompatibility = this._binaryReader.readUnsignedByte();
    if(this._model.englishCompatibility){
      // Header
      this._model.englishName = this._binaryReader.readString(20);
      this._model.englishComment = this._binaryReader.readString(256);

      if(!this._binaryReader.hasBytesAvailable())
        return;

      // Bone
      for(var i=0; i<this._model.boneArray.length; i++){
        this._model.boneArray[i].englishName = this._binaryReader.readString(20);
      }
      
      if(!this._binaryReader.hasBytesAvailable())
        return;

      // Face
      for(var i=1; i<this._model.faceArray.length; i++){
        this._model.faceArray[i].englishName = this._binaryReader.readString(20);
      }

      if(!this._binaryReader.hasBytesAvailable())
        return;

      // BoneDisplayName
      for(var i=0; i<this._model.boneDisplayNameArray.length; i++){
        this._model.boneDisplayEnglishNameArray[i] = this._binaryReader.readString(50);
      }
    }
  },

  readToonTexture: function() {
    this.toonFileName = $A();
    for(var i=0; i<10; i++){
      this.toonFileName[i] = this._binaryReader.readString(100);
    }
  },

  readRigidBody: function() {
    var rigidBodyCount = this._binaryReader.readUnsignedInt();

    this._model.rigidBodyArray = $A();
    for(var i=0; i<rigidBodyCount; i++){
      var bone;
      var rigidBodyObj = new RigidBody();

      rigidBodyObj.name = this._binaryReader.readString(20);
      rigidBodyObj.boneIndex = this._binaryReader.readShort();
      rigidBodyObj.groupIndex = this._binaryReader.readUnsignedByte();
      rigidBodyObj.groupTarget = this._binaryReader.readUnsignedShort();
      rigidBodyObj.shapeType = this._binaryReader.readUnsignedByte();
      rigidBodyObj.shapeW = this._binaryReader.readFloat();
      rigidBodyObj.shapeH = this._binaryReader.readFloat();
      rigidBodyObj.shapeD = this._binaryReader.readFloat();
      rigidBodyObj.position = new DHVector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      );
      rigidBodyObj.rotate = new DHVector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      );
      rigidBodyObj.weight = this._binaryReader.readFloat();
      rigidBodyObj.positionDim = this._binaryReader.readFloat();
      rigidBodyObj.rotateDim = this._binaryReader.readFloat();
      rigidBodyObj.recoil = this._binaryReader.readFloat();
      rigidBodyObj.friction = this._binaryReader.readFloat();
      rigidBodyObj.type = this._binaryReader.readUnsignedByte();

      if(rigidBodyObj.boneIndex == -1){
        bone = this._model.boneHash.get("センター");
      }else{
        bone = this._model.boneArray[rigidBodyObj.boneIndex];
      }

      this._model.rigidBodyArray[i] = rigidBodyObj;
    }
  },

  readConstraint: function() {
    var constraintCount = this._binaryReader.readUnsignedInt();

    this._model.constraintArray = $A();
    for(var i=0; i<constraintCount; i++){
      var constraintObj = new Constraint();

      constraintObj.name = this._binaryReader.readString(20);
      constraintObj.bodyA = this._binaryReader.readUnsignedInt();
      constraintObj.bodyB = this._binaryReader.readUnsignedInt();

      constraintObj.position = new DHVector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      );

      constraintObj.rotate = new DHVector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      );

      constraintObj.constrainPos1 = new DHVector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      );

      constraintObj.constrainPos2 = new DHVector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      );

      constraintObj.constrainRot1 = new DHVector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      );

      constraintObj.constrainRot2 = new DHVector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      );

      constraintObj.springPos = new DHVector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      );

      constraintObj.springRot = new DHVector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      );

      this._model.constraintArray[i] = constraintObj;
    }
  },

  updateVertexBone: function() {
    var boneArray = this._model.boneArray;
    this._model.skinArray.each( function(skinObj){
      skinObj.bones[0] = boneArray[skinObj.boneNum[0]];
      skinObj.bones[1] = boneArray[skinObj.boneNum[1]];
    });
  },

  // マテリアル、影響を与えるボーン毎にグループ分け
  initRenderGroup: function() {
    var materials = this._model.materialArray;
    var indices = this._model.indexArray;
    var skins = this._model.skinArray;
    var boneArray = this._model.boneArray;
    var renderGroups = $A();

    if(this._model.faceArray[0]){
      // 動的に変化する頂点を頂点配列の最後尾に配置
      // （bufferSubDataで一気に転送するため）

      var faceVertices = this._model.faceArray[0].vertices;
      var dynamicSkins = $A();
      var newSkins = $A();
      var newIndices = $A();
      var indexTranslationTable = $A();
      var faceBaseIndices = $A();

      // 動的な頂点を別の配列にコピー
      var dynamicSkinCount = 0;
      for(var i=0; i<faceVertices.length; i++){
        var index = faceVertices[i].index;
        faceBaseIndices[index] = 1;
        dynamicSkins[dynamicSkinCount++] = skins[index];
      }

      // 新しい頂点配列とindex変換用テーブルの作成
      var skinCount = 0;
      var dynamicSkinIndex = skins.length - dynamicSkinCount;
      for(var i=0; i<skins.length; i++){
        if(faceBaseIndices[i]){
          newSkins[dynamicSkinIndex] = skins[i];
          indexTranslationTable[i] = dynamicSkinIndex; 

          dynamicSkinIndex++;
        }else{
          newSkins[skinCount] = skins[i];
          indexTranslationTable[i] = skinCount;

          skinCount++;
        }
      }

      // 変換後のindexを生成
      for(var i=0; i<indices.length; i++){
        newIndices[i] = indexTranslationTable[indices[i]];
      }

      // 顔データのインデックスを修正
      for(var i=0; i<faceVertices.length; i++){
        faceVertices[i].index = i;
      }

      // 頂点、インデックスデータを新しいものに入れ替え
      this._model.skinArray = newSkins;
      skins = newSkins;

      this._model.indexArray = newIndices;
      indices = newIndices;

      this._model.dynamicSkinArray = dynamicSkins;
      this._model.dynamicSkinOffset = skins.length - dynamicSkinCount;
      this._model.hasDynamicSkin = true;
    }else{
      this._model.hasDynamicSkin = false;
    }

    var uniqueIndexArray = $A();
    var indexCount = 0;
    for(var i=0; i<materials.length; i++){
      var material = materials[i];
      var myMaterialGroup = $A();
      var myMaterialIndexArray = $A();
      for(var j=0; j<material.indexCount/3; j++){
        var index0 = indices[indexCount++];
        var index1 = indices[indexCount++];
        var index2 = indices[indexCount++];
        var skin0 = skins[index0];
        var skin1 = skins[index1];
        var skin2 = skins[index2];
        var bones = $A();
        var group;
        var groupIndex = -1;

        boneNums = bones.concat(skin0.boneNum, skin1.boneNum, skin2.boneNum).uniq().sort(function(a, b){return a-b;});

        // boneNumsの要素が全てg.bonesに含まれているか
        group = myMaterialGroup.find( function(g, index){
          var bj=0;
          for(var bi=0; bi<g.bones.length && bj<boneNums.length; bi++){
            if(g.bones[bi] == boneNums[bj]){
              bj++;
            }else if(g.bones[bi] > boneNums[bj]){
              return false;
            }
          }

          groupIndex = index;
          return (bj == boneNums.length);
        });

        if(!group){
          // boneNumsの要素のうち1つでもg.bonesに含まれているか
          group = myMaterialGroup.find( function(g, index){
            if(g.material != material)
              return false;

            for(var bi=0, bj=0; bi<g.bones.length && bj<boneNums.length;){
              if(g.bones[bi] == boneNums[bj]){
                groupIndex = index;
                return true;
              }else if(g.bones[bi] > boneNums[bj]){
                bj++;
              }else{
                bi++;
              }
            }
            return false;
          });
          if(group){
            var newGroup = group.bones.concat(boneNums).uniq().sort( function(a,b){return a-b;} );
            if(newGroup.length < this._maxEffBonesLength){
              group.bones = newGroup;
            }else{
              // 入りきらない
              group = undefined;
            }
          }
        }

        if(!group){
          // 配列に空きがあれば、無理矢理ねじこむ
          var maxEffBonesLength = this._maxEffBonesLength;
          group = myMaterialGroup.find( function(g, index){
            var newGroup = g.bones.concat(boneNums).uniq();
            if(newGroup.length < maxEffBonesLength){
              g.bones = newGroup.sort( function(a,b){return a-b;} );
              groupIndex = index;
              return true;
            }
            return false;
          });
        }


        if(!group){
          // どのグループにも入らなければ、新しくグループを作成
          group = new RenderGroup();
          group.bones = boneNums;
          group.material = material;
          groupIndex = myMaterialGroup.length;
          myMaterialIndexArray[groupIndex] = $A();

          myMaterialGroup.push(group);
        }

        group.indices.push(index0);
        group.indices.push(index1);
        group.indices.push(index2);
        myMaterialIndexArray[groupIndex][index0] = 1;
        myMaterialIndexArray[groupIndex][index1] = 1;
        myMaterialIndexArray[groupIndex][index2] = 1;
      } // material.index

      myMaterialGroup.each( function(g){
        g.boneArray = $A();
        for(var k=0; k<g.bones.length; k++){
          g.boneArray.push(boneArray[g.bones[k]]);
        }
      });

      for(var k=0; k<myMaterialIndexArray.length; k++){
        var groupIndexArray = myMaterialIndexArray[k];
        var group = myMaterialGroup[k];

        for(var l=0; l<groupIndexArray.length; l++){
          if(groupIndexArray[l]){
            if(uniqueIndexArray[l]){
              // need vertex copy
              var newSkin = Object.clone(skins[l]);
              newSkin.boneIndex = Object.clone(newSkin.boneIndex);
              var newSkinIndex = skins.length;
              skins.push(newSkin);

              group.indices.each( function(value, key){
                if(value == l){
                  group.indices[key] = newSkinIndex;
                }
              });
              newSkin.renderGroup = group
            }else{
              uniqueIndexArray[l] = 1;
              skins[l].renderGroup = group;
            }
          }
        }
      }

      renderGroups = renderGroups.concat(myMaterialGroup);
    } // material
    this._model.renderGroupArray = renderGroups;

    // boneIndexの設定
    skins.each( function(s){
      var boneIndexArray = s.renderGroup.bones;
      for(var k=0; k<4; k++){ // FIXME: const value (k)
        s.boneIndex[k] = boneIndexArray.indexOf(s.boneNum[k]);
      }
    });
  },
});

ModelBank.addModelReader(PMDReader);


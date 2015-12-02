/*--------------------------------------------------------------------------------
 * DH3DLibrary VMDReader.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var VMDReader = Class.create(MotionReader, {
  _binaryReader: null,
  _motion: null,

  initialize: function($super) {
    $super();
  },

  readMotion: function(url) {
    if(url.substr(-4) != ".vmd"){
      return false;
    }

    var obj = this;
    var onload = function(){ obj.readMotionProcess(url); };

    this._motion = new VMDMotion();
    this._binaryReader = new BinaryReader(url, false, 'sjis', onload);

/*
    this._motion.frameLength = 0;

    this.readHeader();
    this.readFrames();
    this.readFace();
*/
    return this._motion;
  },

  readMotionFromFile: function(file) {
    if(file.name.substr(-4) != ".vmd"){
      alert("filename_error: " + file.name);
      return false;
    }

    var obj = this;
    var onload = function(){ obj.readMotionProcess(file); };

    this._motion = new VMDMotion();
    this._binaryReader = new BinaryReader(file, false, 'sjis', onload);

    return this._motion;
  },

  readMotionProcess: function(url) {
    var result = this.readMotionSub(url);

    if(!result){
      if(this._motion.onerror){
        this._motion.onerror();
      }
    }else{
      this._motion.loaded = true;
      if(this._motion.onload){
        this._motion.onload();
      }
    }
    if(this._motion.onloadend){
      this._motion.onloadend();
    }
  },

  readMotionSub: function(url){
    this._motion.frameLength = 0;

    this.readHeader();
    this.readFrames();
    this.readFace();

    return this._motion;
  },

  readHeader: function() {
    var header = this._binaryReader.readString(30);
    if(header != "Vocaloid Motion Data 0002"){
      //myAlert("VMD Format Error");
    }
    this._motion.name = this._binaryReader.readString(20);
    //myAlert("motion:\n" + this._motion.name);
  },

  readFrames: function() {
    var frames = this._binaryReader.readUnsignedInt();
    var motionArray = this._motion.motionArray;

    //myAlert("motion frames: " + frames);
    for(var i=0; i<frames; i++){
      var frame = new KeyFrame();
      var boneName = this._binaryReader.readString(15);

      frame.frameNo = this._binaryReader.readUnsignedInt();
      if(frame.frameNo > this._motion.frameLength)
        this._motion.frameLength = frame.frameNo;

      frame.position = new DHVector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      );

      frame.rotate = new DHVector4(
       -this._binaryReader.readFloat(),
       -this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat()
      );
      frame.rotate.normalize(frame.rotate);

      frame.interpolation = $A();
      for(var j=0; j<64; j++){
        frame.interpolation[j] = this._binaryReader.readUnsignedByte();
      }

      if(!motionArray.get(boneName)){
        motionArray.set(boneName, $A());
      }
      motionArray.get(boneName).push(frame);
    }

    motionArray.each( function(keyFrames){
      motionArray.set(
        keyFrames.key,
        keyFrames.value.sortBy( function(frame){
          return frame.frameNo;
        })
      );
    });
  },

  readFace: function() {
    var frames = this._binaryReader.readUnsignedInt();
    var faceMotionArray = this._motion.faceMotionArray;

    //myAlert("face frames: " + frames);
    for(var i=0; i<frames; i++){
      var faceMotion = new FaceMotion();
      var faceName = this._binaryReader.readString(15);

      faceMotion.frameNo = this._binaryReader.readUnsignedInt();
      if(faceMotion.frameNo > this._motion.frameLength)
        this._motion.frameLength = faceMotion.frameNo;

      faceMotion.factor = this._binaryReader.readFloat();

      if(!faceMotionArray.get(faceName)){
        faceMotionArray.set(faceName, $A());
      }
      faceMotionArray.get(faceName).push(faceMotion);
    }

    faceMotionArray.each( function(keyFrames, index){
      faceMotionArray.set(
        keyFrames.key,
        keyFrames.value.sortBy( function(frame, index){
          return frame.frameNo;
        })
      );
    });
  },
});

MotionBank.addMotionReader(VMDReader);


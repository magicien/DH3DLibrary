/*--------------------------------------------------------------------------------
 * DH3DLibrary MotionBank.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var MotionBank = Class.create({
  _motions: $H(),
  _loadingMotions: $H(),
  _motionReaders: $A(),

  initialize: function() {
  },

  addMotionReader: function(motionReader) {
    this._motionReaders.push(motionReader);
  },

  getFileID: function(file) {
    if(!(file instanceof File)){
      return "";
    }
    return "FILE:" + file.name + "_" + file.size + "_" + file.lastModifiedDate;
  },

  getMotion: function(motionFile, options) {
    if(motionFile instanceof File){
      return this.getMotionFromFile(motionFile, options);
    }

    var motion = this._motions.get(motionFile);
    if(motion){
      var m = motion.clone();
      if(options && options.onload){
        m.onload = options.onload;
      }else{
        m.onload = undefined;
      }

      if(m.loaded){
        if(m.onload){
          m.onload();
        }
      }else{
        var arr = this._loadingMotions.get(motionFile);
        arr.push(m);
      }
      return m;
    }

    this._motionReaders.find( function(readerClass){
      var reader = new readerClass();
      motion = reader.readMotion(motionFile);

      if(motion)
        return true;

      return false;
    });

    if(motion){
      motion.onload = function(){ MotionBank.onloadMotion(motion); };

      motion.hashName = motionFile;
      this._motions.set(motionFile, motion);

      var arr = $A();
      var m = motion.clone();
      if(options && options.onload){
        m.onload = options.onload;
      }else{
        m.onload = undefined;
      }
      arr.push(m);
      this._loadingMotions.set(motion.hashName, arr);

      return m;
    }
    return null;
  },

  getMotionFromFile: function(motionFile, options) {
    var id = this.getFileID(motionFile);
    var motion = this._motions.get(id);
    if(motion){
      var m = motion.clone();
      if(options && options.onload){
        m.onload = options.onload;
      }else{
        m.onload = undefined;
      }

      if(m.loaded){
        if(m.onload){
          m.onload();
        }
      }else{
        var arr = this._loadingMotions.get(motionFile);
        arr.push(m);
      }
      return m;
    }

    this._motionReaders.find( function(readerClass){
      var reader = new readerClass();
      motion = reader.readMotionFromFile(motionFile);

      if(motion)
        return true;

      return false;
    });

    if(motion){
      motion.onload = function(){ MotionBank.onloadMotion(motion); };

      motion.hashName = id;
      this._motions.set(id, motion);

      var arr = $A();
      var m = motion.clone();
      if(options && options.onload){
        m.onload = options.onload;
      }else{
        m.onload = undefined;
      }
      arr.push(m);
      this._loadingMotions.set(motion.hashName, arr);

      return m;
    }

    return null;
  },

  onloadMotion: function(motion) {
    motion.loaded = true;

    var arr = this._loadingMotions.get(motion.hashName);
    if(arr){
      arr.each( function(m){
        m.loaded = true;
        if(m.onload){
          m.copy(motion);
          m.onload();
        }
      });
    }
  },
});

MotionBank = new MotionBank();

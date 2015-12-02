/*--------------------------------------------------------------------------------
 * DH3DLibrary DHAudio.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var DHAudio = Class.create({
  _loaded: false,
  _leftLoaded: false,
  _rightLoaded: false,

  _stereo: false,
  _leftSnd: null,
  _rightSnd: null,
  _volume: 100.0,
  _distanceRatio: 1.0,

  _work: new Audio(),

  _listener: null,
  _sndSrc: null,

  initialize: function() {
  },

  canPlayType: function(type) {
    return this._work.canPlayType(type);
  },

  canPlayMP3: function() {
    return this.canPlayType('audio/mpeg');
  },

  canPlayOGG: function() {
    return this.canPlayType('audio/ogg');
  },

  setSound: function(leftSnd, rightSnd) {
    this._loaded = false;
    if(!leftSnd){
      this._leftSnd = null;
      this._rightSnd = null;
      return false;
    }
    var obj = this;
    if(leftSnd){
      this._leftSnd = new Audio();
      this._leftLoaded = false;
      this._leftSnd.addEventListener("canplaythrough", function(){
        obj._leftLoaded = true;
        obj._checkLoaded(); 
      }, true);
      this._leftSnd.loop = false;
    }else{
      return false;
    }

    if(rightSnd){
      this._rightSnd = new Audio();
      this._rightSnd.addEventListener("canplaythrough", function(){ 
        obj._rightLoaded = true;
        obj._checkLoaded(); 
      }, true);
      this._rightSnd.src = rightSnd;
      this._rightSnd.loop = false;
      this._stereo = true;
    }else{
      this._rightSnd = null;
      this._stereo = false;
    }

    this._leftSnd.src = leftSnd;
    if(this._stereo){
      this._rightSnd.src = rightSnd;
    }

    return true;
  },

  _checkLoaded: function() {
    if(this._loaded){
      return true;
    }

    if(this.stereo){
      if(this._leftLoaded && this._rightLoaded){
        this._loaded = true;
      }
    }else{
      if(this._leftLoaded){
        this._loaded = true;
      }
    }
    return this._loaded;
  },

  setListener: function(listener) {
    if(listener instanceof Camera || listener == null){
      this._listener = listener;
      return true;
    }
    return false;
  },

  setSoundSource: function(sndSrc) {
    if(sndSrc instanceof DH3DObject || sndSrc == null) {
      this._sndSrc = sndSrc;
      return true;
    }
    return false;
  },

  play: function() {
    if(!this._loaded){
      return false;
    }

    if(this._stereo){
      if(this._sndSrc && this._listener){
        this.playAt(this._listener, this._sndSrc);
      }else{
        this._leftSnd.currentTime = 0;
        this._rightSnd.currentTime = 0;
        this._leftSnd.play();
        this._rightSnd.play();
      }
    }else{
      this._leftSnd.currentTime = 0;
      this._leftSnd.play();
    }
  },

  // direction: left:0, right:1
  playDistanceDirection: function(distance, direction) {
    if(!this._loaded){
      return false;
    }

    var volume = Math.pow(10, -0.15 * distance * this._distanceRatio) * this._volume * 0.01;
    if(this._stereo){
      this._rightSnd.pause();
      this._leftSnd.pause();
      this._rightSnd.currentTime = 0;
      this._leftSnd.currentTime  = 0;

      var angle = Math.PI * 0.5 * direction;
      this._rightSnd.volume = Math.sin(angle) * volume;
      this._leftSnd.volume  = Math.cos(angle) * volume;
      if(angle > 0.5){
        this._rightSnd.play();
        this._leftSnd.play();
      }else{
        this._leftSnd.play();
        this._rightSnd.play();
      }
    }else{
      this._leftSnd.pause();
      this._leftSnd.currentTime = 0;

      this._leftSnd.volume = volume;
      this._leftSnd.play();
    }

    return true;
  },

  playAt: function() {
    if(!this._loaded){
      return false;
    }

    /*
    var spos; // the position of sound
    var lpos; // the position of the eye point of listener
    var cpos; // the position of the reference point
    var upos; // the direction of the up vector
    */

    var distance;  // distance
    var direction; // direction

    //var args = this.playAt.arguments;
    var args = arguments;
    if(args.length == 2){
      if(args[0] instanceof Camera && args[1] instanceof DH3DObject){
        var camera = args[0];
        var sndObj = args[1];
        var mat = new DHMatrix(camera.viewMat);

        var cameraPos = camera.position;
        var sndPos = sndObj._position;
        var viewPos = new DHVector3();

        viewPos.transform(sndPos, camera.viewMat);

        //cpos = new DHVector3(lpos.x - mat.m31, lpos.y - mat.m32, lpos.z - mat.m33);
        //upos = new DHVector3(mat.m21, mat.m22, mat.m23);

        var f = new DHVector3();
        f.sub(sndPos, cameraPos);
        distance = f.length();
        direction = (viewPos.x / Math.sqrt(viewPos.x * viewPos.x + viewPos.z * viewPos.z) + 1.0) * 0.5;
      }else{
        return false;
      }
    }else{
      return false;
    }

    return this.playDistanceDirection(distance, direction);
  },

  pause: function() {
    if(!this._loaded){
      return false;
    }

    if(this._leftSnd){
      this._leftSnd.pause();
    }
    if(this._rightSnd){
      this._rightSnd.pause();
    }
  },
});

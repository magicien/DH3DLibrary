/*--------------------------------------------------------------------------------
 * DH3DLibrary FPS.js v0.1.0
 * Copyright (c) 2010-2011 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var FPS = Class.create({
  _interval: 10000,
  _count: 10,
  _fps: 0,
  _timeArray: null,
  _intervalTimer: null,

  initialize: function() {
    this._timeArray = $A();
    this.start();
  },

  start: function() {
    var obj = this;
    if(this._intervalTimer){
      this.stop();
    }
    this._intervalTimer = setInterval(function(){obj.calcFPS();}, this._interval);
  },

  stop: function() {
    if(this._intervalTimer){
      clearInterval(this._intervalTimer);
      this.intervalTimer = undefined;
    }
  },

  countFrame: function() {
    var timeArrayCount;
    this._timeArray.push(new Date());
    timeArrayCount = this._timeArray.length;
    for(var i=0; i<timeArrayCount-this._count-1; i++){
      this._timeArray.shift();
    }
  },

  calcFPS: function() {
    if(this._timeArray.length > 0){
      this._fps = (this._timeArray.length - 1) * 1000.0 / (this._timeArray.last() - this._timeArray.first());
    }else{
      this._fps = 3.14;
    }
    return this._fps;
  },

  getFPS: function() {
    return this._fps;
  },

  setInterval: function(interval) {
    this._interval = interval;
    this.start();
  },
});


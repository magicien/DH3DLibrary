/*--------------------------------------------------------------------------------
 * DH3DLibrary ObjectLoadMonitor.js v0.1.0
 * Copyright (c) 2010-2011 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var ObjectLoadMonitor = Class.create({
  _objs: null,
  _loaded: false,
  _onload: null,

  initialize: function(objs, options) {
    var monitor = this;
    if(objs){
      this._objs = objs;
      this._objs.each( function(obj){
        obj.onload = function(){
          //obj.loaded = true;
          monitor.check();
        };
      });
    }else{
      this._objs = $A();
    }

    if(options){
      this._onload = options.onload;
    }
    this.check();
  },

  check: function() {
    var loaded = true;
    this._objs.each( function(obj){
      if(!obj.loaded){
        loaded = false;
      }
    });
    this._loaded = loaded;
    if(loaded){
      if(this._onload){
        this._onload();
      }
    }
  },

// FIXME: implementation
  add: function(obj) {
  },

// FIXME: implementation
  remove: function(obj) {
  },
});

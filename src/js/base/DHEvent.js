/*--------------------------------------------------------------------------------
 * DH3DLibrary DHEvent.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var DHEvent = Class.create({
  _eventFunc: null,

  initialize: function() {
  },

  delete: function() {
  },

  start: function() {
    if(this._eventFunc){
      var obj = this;
      this._eventFunc(obj);
    }
  },

  setEventCallback: function(func) {
    this._eventFunc = func;
  },

  getEventCallback: function() {
    return this._eventFunc;
  },
});

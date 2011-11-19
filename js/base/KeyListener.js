/*--------------------------------------------------------------------------------
 * DH3DLibrary KeyListener.js v0.1.0
 * Copyright (c) 2010-2011 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var KeyListener = Class.create({
  _enable: false,
  _keyState: null,
  _keyNewState: null,

  _userKeyDownCallback: null,
  _userKeyUpCallback: null,

  initialize: function() {
    this._keyState = $A();
    this._keyNewState = $A();

    this.setEnable();
  },

  setEnable: function(flag) {
    if(flag != undefined && !flag){
      this._enable = false;
    }else{
      this._enable = true;
      var obj = this;
      Event.observe(window.document, 'keydown',
                     function(event){obj.keyDownCallback(event);}, false);
      Event.observe(window.document, 'keyup',
                     function(event){obj.keyUpCallback(event);}, false);
    }
  },

  setDisable: function() {
    this.setEnable(false);
  },

  keyDownCallback: function(event) {
    event = event || window.event;

    var keyChar = String.fromCharCode(event.keyCode);

    if(!this._keyState[keyChar]){
      this._keyNewState[keyChar] = true;
    }
    this._keyState[keyChar] = true;

    if(this._userKeyDownCallback){
      this._userKeyDownCallback(event);
    }
  },

  keyUpCallback: function(event) {
    event = event || window.event;

    var keyChar = String.fromCharCode(event.keyCode);

    this._keyState[keyChar] = false;

    if(this._userKeyUpCallback){
      this._userKeyUpCallback(event);
    }
  },

  setKeyDownCallback: function(func) {
    this._userKeyDownCallback = func;
  },

  setKeyUpCallback: function(func) {
    this._userKeyUpCallback = func;
  },

  resetKeyNewState: function() {
    var obj = this;
    Object.keys(this._keyState).each( function(k){
      obj._keyNewState[k] = false;
    });
  },

  resetKeyState: function() {
    var obj = this;
    Object.keys(this._keyState).each( function(k){
      obj._keyState[k] = false;
    });
    this.resetKeyNewState();
  },

  getKeyState: function(keyCode) {
    return this._keyState[keyCode];
  },

  getKeyNewState: function(keyCode) {
    return this._keyNewState[keyCode];
  },
});


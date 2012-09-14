/*--------------------------------------------------------------------------------
 * DH3DLibrary KeyListener.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var KeyListener = Class.create({
  _enable: false,
  _keyState: null,
  _keyNewState: null,
  _anyKey: false,

  _userKeyDownCallback: null,
  _userKeyUpCallback: null,

  _keyHash: $H({
      8: "Backspace",
      9: "Tab",
     13: "Enter",
     16: "Shift",
     17: "Ctrl",
     18: "Alt",
     19: "Pause",
     20: "CapsLock",
     27: "Esc",
     32: "Space",
     33: "PageUp",
     34: "PageDown",
     35: "End",
     36: "Home",
     37: "Left",
     38: "Up",
     39: "Right",
     40: "Down",
     44: "PrntScrn",
     45: "Insert",
     46: "Delete",
    144: "NumLock",
    145: "ScrollLock",
  }),

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

    var keyChar = this._keyHash.get(event.keyCode);
    if(keyChar == null)
      keyChar = String.fromCharCode(event.keyCode);

    if(!this._keyState[keyChar]){
      this._keyNewState[keyChar] = true;
    }
    this._keyState[keyChar] = true;
    this._anyKey = true;

    if(this._userKeyDownCallback){
      this._userKeyDownCallback(event);
    }
  },

  keyUpCallback: function(event) {
    event = event || window.event;

    var keyChar = this._keyHash.get(event.keyCode);
    if(keyChar == null)
      keyChar = String.fromCharCode(event.keyCode);

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
    this._anyKey = false;
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

  getAnyKeyState: function() {
    return this._anyKey;
  },
});


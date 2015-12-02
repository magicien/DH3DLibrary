/*--------------------------------------------------------------------------------
 * DH3DLibrary XReader.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var XReader = Class.create(ModelReader, {
  _model: null,
  _parentDirName: null,

//  _maxEffBonesLength: 20, // FIXME: bind to vertex shader

  _error: 0,
  _loaded: false,

  initialize: function($super) {
    $super();
  },

  readModel: function(url){
    if(url.substr(-2) != ".x"){
      return false;
    }

    var obj = this;
    var onload = function(){ obj.readModelProcess(url); };

    this._model = new XModel();
    this._textReader = new TextReader(url, 'sjis', onload);

    return this._model;
  },

  readModelFromFile: function(file) {
    if(file.name.substr(-2) != ".x"){
      alert("filename_error: " + file.name);
      return false;
    }

    var obj = this;
    var onload = function(){ obj.readModelProcess(url); };

    this._model = XModel();
    this._textReader = new TextReader(file, 'sjis', onload);

    return this._model;
  },

  readModelProcess: function(url) {
    this.readModelSub(url);

    if(this._error){
      if(this._model.onerror){
        this._model.onerror();
      }
    }

    if(this._loaded){
      this._model.loaded = true;
      if(this._model.onload){
        this._model.onload();
      }
    }

    if(this._error || this._loaded){
      if(this._model.onloadend){
        this._model.onloadend();
      }
    }
  },

  readModelSub: function(url){
    this._parentDirName = (new String(url)).gsub(/\/[^\/]*$/, "/");
    if(url == this._parentDirName){
      this._parentDirName = "./";
    }

    var parser = new XParser();
    parser.setParentDirName(this._parentDirName);
    parser.setModel(this._model);
    var model = parser.parse(this._textReader.getText());

    if(model == null){
      this._error = 1;
    }else{
      this._loaded = true;
    }
  },
});

ModelBank.addModelReader(XReader);

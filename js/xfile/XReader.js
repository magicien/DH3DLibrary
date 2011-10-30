/*--------------------------------------------------------------------------------
 * DH3DLibrary XReader.js v0.1.0
 * Copyright (c) 2010-2011 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var XReader = Class.create(ModelReader, {
  _parentDirName: null,

//  _maxEffBonesLength: 20, // FIXME: bind to vertex shader

  initialize: function($super) {
    $super();
  },

  readModel: function(url){
    if(url.substr(-2) != ".x"){
      return false;
    }

    var text;
    var request = Ajax.getTransport();
    request.open('GET', url, false);
    request.overrideMimeType('text/plain; charset=shift_jis');
    request.send(null);
    text = request.responseText;

    this._parentDirName = (new String(url)).gsub(/\/[^\/]*$/, "/");
    if(url == this._parentDirName){
      this._parentDirName = "./";
    }

    var parser = new XParser();
    parser.setParentDirName(this._parentDirName);
    var model = parser.parse(text);

    this._model = model;
    // FIXME: error handling
    if(model == null){
    /*
      if(this._model.onerror){
        this._model.onerror();
      }
    */
    }else{
      this._model.loaded = true;
      if(this._model.onload){
        this._model.onload();
      }
    }
    if(this._model.onloadend){
      this._model.onloadend();
    }

    return model;
  },
});

ModelBank.addModelReader(XReader);

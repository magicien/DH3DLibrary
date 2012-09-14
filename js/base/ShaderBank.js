/*--------------------------------------------------------------------------------
 * DH3DLibrary ShaderBank.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var ShaderBank = Class.create({
  _shaders: $H(),
  _shaderClasses: $H(),

  initialize: function() {
  },

  registShader: function(shader) {
    var shaderName = (new shader()).getName();
    this._shaderClasses.set(shaderName, shader);
    this._shaders.set(shaderName, $H());
  },

  getShader: function(name) {
    var shader = this._shaderClasses.get(name);
    if(shader == undefined){
      return null;
    }
    return shader;
  },

  getShaderOfContext: function(name, context) {
    var shader = this._shaders.get(name);
    if(shader == null){
      return null;
    }
    var instance = shader.get(context);
    if(instance){
      return instance;
    }
    var shaderClass = this._shaderClasses.get(name);
    instance = new shaderClass(context);
    shader.set(context, instance);

    return instance;
  },
});

// Singleton
ShaderBank = new ShaderBank();


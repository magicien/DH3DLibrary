/*--------------------------------------------------------------------------------
 * DH3DLibrary FragmentShader.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var FragmentShader = Class.create({
  _shader: null,
  _context: null,
  _name: 'FragmentShader',
  _program: '',

  initialize: function(gl) {
    if(!gl)
      return;

    this._shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(this._shader, this._program);
    gl.compileShader(this._shader);
    if(!gl.getShaderParameter(this._shader, gl.COMPILE_STATUS)){
      alert(gl.getShaderInfoLog(this._shader)); // FIXME: DEBUG
      throw("fragment shader compile error");
    }
    this._context = gl;
  },

  getName: function() {
    return this._name;
  },

  getShader: function() {
    return this._shader;
  },

  bindAttribute:   function(programObject) {},
  setLightData:    function(light) {},
  setMaterialData: function(material) {},
});


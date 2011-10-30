/*--------------------------------------------------------------------------------
 * DH3DLibrary ToonRenderer.js v0.1.0
 * Copyright (c) 2010-2011 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var ToonRenderer = Class.create(Renderer, {
  _vertexShaderName: 'ToonVertexShader',
  _fragmentShaderName: 'ToonFragmentShader',

  _depthBuffer: null,
  _depthData: null,

  initialize: function($super, gl, camera) {
    $super(gl, camera);

    this._depthData = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.depthData);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    
  },
});

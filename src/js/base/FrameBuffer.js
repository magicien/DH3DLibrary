/*--------------------------------------------------------------------------------
 * DH3DLibrary FrameBuffer.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var FrameBuffer = Class.create({
  _width: 0,
  _height: 0,
  _gl: null,
  _frameBuffer: null,
  _colorBuffer: null,
  _depthBuffer: null,

  initialize: function(gl, width, height) {
    this._width = width;
    this._height = height;
    this._gl = gl;

    // FIXME: check

    this._frameBuffer = gl.createFramebuffer();
    this._colorBuffer = gl.createTexture();
    this._depthBuffer = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, this._colorBuffer);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTRUE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTRUE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.bindTexture(gl.TEXTURE_2D, this._depthBuffer);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, this._width, this._height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTRUE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTRUE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    // フレームバッファオブジェクトをバインドする
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);

    // テクスチャをカラーアタッチメントとして指定する
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._colorBuffer, 0);

    // テクスチャをデプスアタッチメントとして指定する
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this._depthBuffer, 0);

    // フレームバッファオブジェクトが完全かをチェックする
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if(status != gl.FRAMEBUFFER_COMPLETE){
      // FIXME: error handling
    }
  },

  begin: function() {
    var gl = this._gl;

    // フレームバッファオブジェクトをバインドする
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);

    // テクスチャをカラーアタッチメントとして指定する
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._colorBuffer, 0);

    // テクスチャをデプスアタッチメントとして指定する
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this._depthBuffer, 0);

    // バッファの初期化
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 変数のロード
    // FIXME
  },

  end: function() {
    // フレームバッファを元に戻す
    gl.bindFramebuffer(gl.FRAMEBUFFER, 0);
  },
});



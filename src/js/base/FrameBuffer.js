'use strict'

/**
 * FrameBuffer class
 * @access public
 */
export default class FrameBuffer {
  /**
   * constructor
   * @access public
   * @param {WebGLRenderingContext} gl -
   * @param {int} width - screen width
   * @param {int} height - screen height
   * @constructor
   */
  constructor(gl, width, height) {
    this._width = width
    this._height = height
    this._gl = gl
    this._frameBuffer = null
    this._colorBuffer = null
    this._depthBuffer = null

    // FIXME: check

    this._frameBuffer = gl.createFramebuffer()
    this._colorBuffer = gl.createTexture()
    this._depthBuffer = gl.createTexture()

    gl.bindTexture(gl.TEXTURE_2D, this._colorBuffer)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTRUE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTRUE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    gl.bindTexture(gl.TEXTURE_2D, this._depthBuffer)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, this._width, this._height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTRUE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTRUE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)

    // フレームバッファオブジェクトをバインドする
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer)

    // テクスチャをカラーアタッチメントとして指定する
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._colorBuffer, 0)

    // テクスチャをデプスアタッチメントとして指定する
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this._depthBuffer, 0)

    // フレームバッファオブジェクトが完全かをチェックする
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
    if(status !== gl.FRAMEBUFFER_COMPLETE){
      // FIXME: error handling
    }
  }

  begin() {
    const gl = this._gl

    // フレームバッファオブジェクトをバインドする
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer)

    // テクスチャをカラーアタッチメントとして指定する
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._colorBuffer, 0)

    // テクスチャをデプスアタッチメントとして指定する
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this._depthBuffer, 0)

    // バッファの初期化
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // 変数のロード
    // FIXME
  }

  end() {
    const gl = this._gl

    // フレームバッファを元に戻す
    gl.bindFramebuffer(gl.FRAMEBUFFER, 0)
  }
}


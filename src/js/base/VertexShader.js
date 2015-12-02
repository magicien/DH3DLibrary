'use strict'

/**
 * VertexShader class
 * @access public
 */
export default class VertexShader {
  /**
   * constructor
   * @access public
   * @param {WebGLRenderingContext} gl -
   * @constructor
   */
  constructor(gl) {
    this._gl = null
    this._shader = null

    if(!gl)
      return

    this._shader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(this._shader, this._program)
    gl.compileShader(this._shader)
    if(!gl.getShaderParameter(this._shader, gl.COMPILE_STATUS)){
      // alert(gl.getShaderInfoLog(this._shader)) // FIXME: DEBUG
      const info = gl.getShaderInfoLog(this._shader)
      console.log(info)
      throw new Error('vertex shader compile error: ' + info)
    }
    this._gl = gl
  }

  get _name() {
    return 'VertexShader'
  }

  getName() {
    return this._name
  }

  get _program() {
    return null
  }

  getShader() {
    return this._shader
  }

  bindAttribute(programObject) {
  }

  bindAttribute2(programObject) {
  }

  bufferDynamicVertexData(dhObject) {
  }

  setAttribPointer() {
  }

  setLightData(light) {
  }

  setMaterialData(material) {
  }

  getVertexData(dhObject) {
  }

  getDynamicVertexData(dhObject) {
  }
}


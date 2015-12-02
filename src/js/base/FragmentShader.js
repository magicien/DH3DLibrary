'use strict'

/**
 * FragmentShader class
 * @access public
 */
export default class FragmentShader {
  /**
   * constructor
   * @access public
   * @param {WebGLRenderingContext} gl -
   * @constructor
   */
  constructor(gl) {
    this._shader = null
    this._context = null

    if(!gl)
      return

    this._shader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(this._shader, this._program)
    gl.compileShader(this._shader)
    if(!gl.getShaderParameter(this._shader, gl.COMPILE_STATUS)){
      // alert(gl.getShaderInfoLog(this._shader))
      const info = gl.getShaderInfoLog(this._shader)
      console.log(info)
      throw new Error('fragment shader compile error: ' + info)
    }
    this._context = gl
  }

  get _name() {
    return 'FragmentShader'
  }

  getName() {
    return this._name
  }

  get _program() {
    return ''
  }

  getShader() {
    return this._shader
  }

  bindAttribute(programObject) {
  }

  setLightData(light) {
  }

  setMaterialData(material) {
  }
}


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

  /**
   * get shader name
   * @access public
   * @returns {string} - shader name
   */
  get _name() {
    return 'FragmentShader'
  }

  /**
   * get shader name
   * @access public
   * @returns {string} - shader name
   */
  getName() {
    return this._name
  }

  /**
   * get shader program
   * @access public
   * @returns {string} - shader program
   */
  get _program() {
    return ''
  }

  /**
   * get shader object
   * @access public
   * @returns {WebGLShader} - shader
   */
  getShader() {
    return this._shader
  }

  /**
   * bind attributes to given program
   * @access public
   * @param {WebGLProgram} programObject - program to bind attributes
   * @returns {void}
   */
  bindAttribute(programObject) {
  }

  /**
   * set light object
   * @access public
   * @param {Light} light - Light object
   * @returns {void}
   */
  setLightData(light) {
  }

  /**
   * set material data
   * @access public
   * @param {Material} material - Material object
   * @returns {void}
   */
  setMaterialData(material) {
  }
}


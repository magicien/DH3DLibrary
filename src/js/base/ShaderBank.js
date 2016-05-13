'use strict'

/**
 * ShaderBank class
 * @access public
 */
export class ShaderBank {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    this._shaders = new Map()
    this._shaderClasses = new Map()
  }

  /**
   * regist shader
   * @access public
   * @param {WebGLShader} shader - shader
   * @returns {void}
   */
  registShader(shader) {
    const shaderName = (new shader()).getName()
    this._shaderClasses.set(shaderName, shader)
    this._shaders.set(shaderName, new Map())
  }

  /**
   * get registered shader of given name
   * @access public
   * @param {string} name - name of shader
   * @returns {WebGLShader} - shader object
   */
  getShader(name) {
    const shader = this._shaderClasses.get(name)
    if(shader === undefined){
      return null
    }
    return shader
  }

  /**
   * get registered shader of given name and context
   * @access public
   * @param {string} name - name of shader
   * @param {WebGLContext} context - context of shader
   * @returns {WebGLShader} - shader object
   */
  getShaderOfContext(name, context) {
    const shader = this._shaders.get(name)
    if(shader === undefined){
      return null
    }
    let instance = shader.get(context)
    if(instance){
      return instance
    }
    const shaderClass = this._shaderClasses.get(name)
    instance = new shaderClass(context)
    shader.set(context, instance)

    return instance
  }
}

// Singleton
export default new ShaderBank()


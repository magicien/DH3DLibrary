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

  registShader(shader) {
    const shaderName = (new shader()).getName()
    this._shaderClasses.set(shaderName, shader)
    this._shaders.set(shaderName, new Map())
  }

  getShader(name) {
    const shader = this._shaderClasses.get(name)
    if(shader === null){
      return null
    }
    return shader
  }

  getShaderOfContext(name, context) {
    const shader = this._shaders.get(name)
    if(shader === null){
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


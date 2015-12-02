'use strict'

import Renderer from '../../base/Renderer'

/**
 * SimpleRenderer class
 * @access public
 */
export default class SimpleRenderer extends Renderer {
  /**
   * constructor
   * @access public
   * @param {WebGLRenderingContext} gl -
   * @param {Camera} camera -
   * @constructor
   */
  constructor(gl, camera) {
    super(gl, camera)
  }

  get _vertexShaderName() {
    return 'SimpleVertexShader'
  }

  get _fragmentShaderName() {
    return 'SimpleFragmentShader'
  }
}

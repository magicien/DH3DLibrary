'use strict'

import Renderer from '../../base/Renderer'

/**
 * ToonRenderer class
 * @access public
 */
export default class ToonRenderer extends Renderer {
  /**
   * constructor
   * @access public
   * @param {WebglContextRenderer} gl -
   * @param {Camera} camera -
   * @constructor
   */
  constructor(gl, camera) {
    super(gl, camera)
  }

  get _vertexShaderName() {
    return 'ToonVertexShader'
  }

  get _fragmentShaderName() {
    return 'ToonFragmentShader'
  }
}

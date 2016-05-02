'use strict'

import Renderer from '../../base/Renderer'

/**
 * SimpleRenderer class
 * @access public
 */
export default class SimpleRenderer extends Renderer {
  get _vertexShaderName() {
    return 'SimpleVertexShader'
  }

  get _fragmentShaderName() {
    return 'SimpleFragmentShader'
  }
}

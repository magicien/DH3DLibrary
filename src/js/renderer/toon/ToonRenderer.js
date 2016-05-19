'use strict'

import Renderer from '../../base/Renderer'
import ToonVertexShader from './ToonVertexShader'
import ToonFragmentShader from './ToonFragmentShader'

/**
 * ToonRenderer class
 * @access public
 */
export default class ToonRenderer extends Renderer {
  get _vertexShaderName() {
    return 'ToonVertexShader'
  }

  get _fragmentShaderName() {
    return 'ToonFragmentShader'
  }
}

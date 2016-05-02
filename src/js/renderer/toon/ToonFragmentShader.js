'use strict'

import FragmentShader from '../../base/FragmentShader'
import ShaderBank from '../../base/ShaderBank'

/**
 * ToonFragmentShader class
 * @access public
 */
export default class ToonFragmentShader extends FragmentShader {
  get _name() {
    return 'ToonFragmentShader'
  }

  get _program() {
    return `
      precision mediump float;
      uniform sampler2D texture;
      uniform bool enableTexture;

      varying float v_clipDist;
      varying vec2 v_TexCoord;
      varying vec4 v_FrontColor;
      
      void main() {
        vec4 v_Color = v_FrontColor;
        if(v_clipDist < 0.0)
          discard;

        if(enableTexture) {
          vec4 color = texture2D(texture, v_TexCoord);
          gl_FragColor = color * v_Color;
        }else{
          gl_FragColor = v_Color;
        }
      }
    `
  }
}

ShaderBank.registShader(ToonFragmentShader)


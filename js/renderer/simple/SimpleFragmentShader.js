/*--------------------------------------------------------------------------------
 * DH3DLibrary SimpleFragmentShader.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var SimpleFragmentShader = Class.create(FragmentShader, {
  _name: 'SimpleFragmentShader',

  _program:
"                                                  \n \
precision mediump float;                           \n \
uniform sampler2D texture;                         \n \
uniform bool enableTexture;                        \n \
                                                   \n \
varying float v_clipDist;                          \n \
varying vec2 v_TexCoord;                           \n \
varying vec4 v_FrontColor;                         \n \
                                                   \n \
void main() {                                      \n \
  vec4 v_Color = v_FrontColor;                     \n \
  if(v_clipDist < 0.0)                             \n \
    discard;                                       \n \
                                                   \n \
  if(enableTexture) {                              \n \
    vec4 color = texture2D(texture, v_TexCoord);   \n \
    gl_FragColor = color * v_Color;                \n \
    // gl_FragColor.a = color.a;                      \n \
  }else{                                           \n \
    gl_FragColor = v_Color;                        \n \
  }                                                \n \
}                                                  \n \
",

  initialize: function($super, gl) {
    $super(gl);
  },
});

ShaderBank.registShader(SimpleFragmentShader);


'use strict'

import Vector4 from './Vector4'
import Material from './Material'
import ShaderBank from './ShaderBank'

/**
 * Renderer class
 * @access public
 */
export default class Renderer {
  /**
   * constructor
   * @access public
   * @param {WebGLRenderingContext} gl -
   * @param {Camera} camera -
   * @constructor
   */
  constructor(gl, camera) {
    this._vertexShader = null
    this._fragmentShader = null
    this._programObject = null
    this._light = null

    this._clearColor = null
    this._clearDepth = 1.0
    this._clearStencil = 0
    this._stencilMask = 0xff

    this._stencilOn = false
  
    this._gl = gl
    this._camera = camera

    // initialize vertex shader
    this._vertexShader = ShaderBank.getShaderOfContext(this._vertexShaderName, gl)

    // initialize fragment shader
    this._fragmentShader = ShaderBank.getShaderOfContext(this._fragmentShaderName, gl)

    this._programObject = this._gl.createProgram()
    this._gl.attachShader(this._programObject, this._vertexShader.getShader())
    this._gl.attachShader(this._programObject, this._fragmentShader.getShader())

    // bind variables
    this._vertexShader.bindAttribute(this._programObject)

    // link program object
    this._gl.linkProgram(this._programObject)
    if(!this._gl.getProgramParameter(this._programObject, this._gl.LINK_STATUS)){
      throw new Error(this._gl.getProgramInfoLog(this._programObject))
    }
    this._vertexShader.bindAttribute2(this._programObject)

    this._gl.useProgram(this._programObject)

    this._clearColor = new Vector4(1.0, 1.0, 1.0, 1.0)
    this._gl.clearColor(this._clearColor.x, this._clearColor.y, this._clearColor.z, this._clearColor.w)
    this._gl.clearDepth(this._clearDepth)
    this._gl.clearStencil(this._clearStencil)

    this._gl.enable(gl.DEPTH_TEST)
    this._gl.enable(gl.BLEND)
    this._gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    this._gl.enable(gl.CULL_FACE)
    this._gl.cullFace(gl.FRONT)
    //this._gl.disable(gl.STENCIL_TEST)
    this.disableStencil()
    this._gl.stencilMask(this._stencilMask)

    this._gl.checkGLError('Renderer.initialize')
  }

  get _vertexShaderName() {
    return ''
  }

  get _fragmentShaderName() {
    return ''
  }

  setCamera(camera) {
    this._camera = camera
  }

  setLight(light) {
    this._light = light
  }

  setClearColor(r, g, b, a) {
    this._clearColor.setValue(r, g, b, a)
    this._gl.clearColor(this._clearColor.x, this._clearColor.y, this._clearColor.z, this._clearColor.w)
  }

  render(dhObject) {
    // FIXME: いろいろ
    this._gl.checkGLError('before render')

    if(this._gl._program !== this._programObject){
      this._gl.useProgram(this._programObject)
      this._gl._program = this._programObject
    }
    this._gl.checkGLError('gl.useProgram')

    // FIXME: culling setting
    this._gl.disable(this._gl.CULL_FACE)

    // camera setting
    this._gl.uniformMatrix4fv(this._gl.getUniformLocation(this._programObject, 'cameraProjectionViewMatrix'), false, this._camera.getProjectionViewMatrix())
    this._gl.uniform3fv(this._gl.getUniformLocation(this._programObject, 'cameraPosition'), this._camera.getPosition())
    this._gl.checkGLError('render: cameraPosition')

    // FIXME:Lightは毎回転送する必要ない？
    // FIXME:Locationのキャッシュ
    this._vertexShader.setLightData(this._light)

    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, dhObject._model.vertexBuffer)
    this._vertexShader.bufferDynamicVertexData(dhObject)
    this._vertexShader.setAttribPointer()

    // renderGroup毎に描画
    for(let i=0; i<dhObject._model.renderGroupArray.length; i++){
      const renderGroup = dhObject._model.renderGroupArray[i]
      const material = renderGroup.material

      this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, renderGroup.indexBuffer)

      this._gl.checkGLError('gl.bindBuffer(ELEMENT_ARRAY_BUFFER)')

      if(dhObject._reflectionMode){
        if(!renderGroup.reflectionMaterial){
          const m = new Material(material)
          const r = 0.5
          m.ambient.x *= r
          m.ambient.y *= r
          m.ambient.z *= r
          m.diffuse.x *= r
          m.diffuse.y *= r
          m.diffuse.z *= r
          m.specular.x *= r
          m.specular.y *= r
          m.specular.z *= r
          m.emission.x *= r
          m.emission.y *= r
          m.emission.z *= r
          m.alpha = r
          renderGroup.reflectionMaterial = m
        }
        this._vertexShader.setMaterialData(renderGroup.reflectionMaterial)
      }else{
        // FIXME: clipPlane無効化
        const zero = new Vector4(0, 0, 0, 1)
        this._vertexShader.setClipPlane(zero)

        this._vertexShader.setMaterialData(material)
      }

      // bone行列
      let boneArr = []
      for(let j=0; j<renderGroup.boneArray.length; j++){
        boneArr = boneArr.concat(renderGroup.boneArray[j].inflMatrix.getArray())
      }

      this._gl.uniformMatrix4fv(
        this._gl.getUniformLocation(this._programObject, 'effBones'),
        false, 
        new Float32Array(boneArr)
      )
      this._gl.checkGLError('boneArr')

      // TODO: toon、edgeの設定

      if(material.texture){
        // FIXME
        let texture = material.texture
        if(dhObject._dynamicTexture){
          texture = dhObject._dynamicTexture
        }

        this._gl.checkGLError('before texture')
        this._gl.uniform1i(this._gl.getUniformLocation(this._programObject, 'enableTexture'), 1)
        this._gl.checkGLError('gl.uniform1i, enableTexture=1')
        this._gl.activeTexture(this._gl.TEXTURE0)
        this._gl.checkGLError('gl.activeTexture')
        //this._gl.bindTexture(this._gl.TEXTURE_2D, material.texture)
        this._gl.bindTexture(this._gl.TEXTURE_2D, texture)
        this._gl.checkGLError('bindTexture')
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR)
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR)
        if(material.texture_repeat){
          this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.REPEAT)
          this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.REPEAT)
        }else{
          this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE)
          this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE)
        }
        this._gl.checkGLError('texParameteri')
      }else{
        this._gl.uniform1i(this._gl.getUniformLocation(this._programObject, 'enableTexture'), 0)
        this._gl.checkGLError('gl.uniform1i, enableTexture=0')
        // FIXME: error
        //this._gl.disable(this._gl.TEXTURE_2D)
        //this._gl.checkGLError('gl.disable')
      }
      this._gl.drawElements(this._gl.TRIANGLES, renderGroup.indices.length, this._gl.UNSIGNED_SHORT, 0)

      this._gl.checkGLError('gl.drawElements: length:' + renderGroup.indices.length)
    }
  }

  renderMirror(dhObject, reflectionObjectArray) {
    if(!dhObject._mirror)
      return

    const gl = this._gl

    // FIXME: save gl settings

    // set 1 to stencil buffer
    //gl.enable(gl.STENCIL_TEST)
    this.enableStencil()
    gl.colorMask(0, 0, 0, 0)
    /*
    gl.depthFunc(gl.LESS)
    gl.depthRange(0,1)
    gl.enable(gl.STENCIL_TEST)
    gl.stencilFunc(gl.ALWAYS, 1, 1)
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE)
    gl.colorMask(0,0,0,0)
    this.render(dhObject)
    */

    // reset (set 1) depth buffer
    gl.depthRange(1, 1)
    gl.depthFunc(gl.ALWAYS)
    gl.stencilFunc(gl.EQUAL, 16, this._stencilMask)
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP)
    this.render(dhObject)

    // FIXME: clip plane
    // gl.clipPlane(gl.CLIP_PLANE0, plane)
    // FIXME: set clipPlane
    const plane = new Vector4(0, 1, 0, 0)
    this._vertexShader.setClipPlane(plane)

    // draw reflection objects
    //gl.stencilFunc(gl.LESS, 1, this._stencilMask)
    gl.stencilFunc(gl.LEQUAL, 4, this._stencilMask)
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE)
    gl.depthFunc(gl.LESS)
    gl.depthRange(0, 1)
    gl.enable(gl.BLEND)
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.blendFunc(gl.ONE, gl.ZERO)
    //gl.depthFunc(gl.GREATER)
    gl.colorMask(1, 1, 1, 1)
    gl.cullFace(gl.BACK)

    // FIXME: calc mirroring matrix
    this._camera.scale(1, -1, 1)
    const myObj = this
    reflectionObjectArray.forEach( (obj) => {
      if(obj === myObj)
        return

      obj.setReflectionMode(true)
      obj.render()
      obj.setReflectionMode(false)
    })
    this._camera.scale(1, -1, 1)

    const zero = new Vector4(0, 0, 0, 1)
    this._vertexShader.setClipPlane(zero)

    // draw mirror
    gl.stencilFunc(gl.EQUAL, 4, this._stencilMask)
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP)
    gl.cullFace(gl.FRONT)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.DST_ALPHA)
    //gl.blendFunc(gl.ONE, gl.ONE)
    this.render(dhObject)

    // FIXME: restore setting
    this.disableStencil()
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  }

  getContext() {
    return this._gl
  }

  getVertexData(dhObject) {
    return this._vertexShader.getVertexData(dhObject)
  }
  getDynamicVertexData(dhObject){
    return this._vertexShader.getDynamicVertexData(dhObject)
  }

  enableStencil() {
    if(this._stencilOn)
      return

    this._gl.enable(this._gl.STENCIL_TEST)
    this._stencilOn = true
  }

  disableStencil() {
    if(!this._stencilOn)
      return

    this._gl.disable(this._gl.STENCIL_TEST)
    this._stencilOn = false
  }
}

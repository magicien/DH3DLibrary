'use strict'

import VertexShader from '../../base/VertexShader'
import ShaderBank from '../../base/ShaderBank'

/**
 * ToonVertexShader class
 * @access public
 */
export default class ToonVertexShader extends VertexShader {
  /**
   * constructor
   * @access public
   * @param {WebGLRenderingContext} gl -
   * @constructor
   */
  constructor(gl) {
    super(gl)

    this._lTypeLoc = null
    this._lPositionLoc = null
    this._lAmbientLoc = null
    this._lDiffuseLoc = null
    this._lSpecularLoc = null
  
    this._mAmbientLoc = null
    this._mDiffuseLoc = null
    this._mSpecularLoc = null
    this._mShininessLoc = null
    this._mEmissionLoc = null
    this._mAlphaLoc = null

    this._clipPlaneLoc = null
  }

  get _name() {
    return 'ToonVertexShader'
  }

  get _program() {
    return `
      precision mediump float;

      uniform mat4 cameraProjectionViewMatrix;
      uniform vec3 cameraPosition;
      uniform vec4 clipPlane;

      uniform int lType;
      uniform vec3 lPosition;
      uniform vec4 lAmbient;
      uniform vec4 lDiffuse;
      uniform vec4 lSpecular;
      
      uniform vec4 mAmbient;
      uniform vec4 mDiffuse;
      uniform vec4 mSpecular;
      uniform float mShininess;
      uniform vec4 mEmission;
      uniform float mAlpha;

      uniform mat4 effBones[20];

      attribute vec4 vPosition;
      attribute vec3 vNormal;
      attribute vec2 vUV;
      
      attribute vec4 effBoneIndex ;
      attribute vec4 effBoneWeight;

      varying vec2 v_TexCoord;
      varying float v_clipDist;

      varying vec4 v_FrontColor;

      void main() {
        vec3 position;
        vec3 normal;
        vec3 lightVec;
        vec3 viewVec;
        float diffuse;
        mat4 inflMat = mat4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        int index0 = int(effBoneIndex.x);
        int index1 = int(effBoneIndex.y);
        int index2 = int(effBoneIndex.z);
        int index3 = int(effBoneIndex.w);
        
        if(index0 >= 0){
          inflMat += effBones[index0] * effBoneWeight.x;
        }
        if(index1 >= 0){
          inflMat += effBones[index1] * effBoneWeight.y;
        }
        if(index2 >= 0){
          inflMat += effBones[index2] * effBoneWeight.z;
        }
        if(index3 >= 0){
          inflMat += effBones[index3] * effBoneWeight.w;
        }

        position = vec3(inflMat * vPosition);
        normal = normalize(vec3(inflMat * vec4(vNormal, 0.0)));
        viewVec = normalize(cameraPosition - position);
        if(lType == 1){
          lightVec = normalize(lPosition - position);
        }else{
          lightVec = normalize(lPosition);
        }
        diffuse = dot(lightVec, normal);

        v_FrontColor = lAmbient * mAmbient;
        if(diffuse > 0.0){
          vec3 halfway = normalize(lightVec + viewVec);
          float specular = pow(max(dot(normal, halfway), 0.0), mShininess);
          v_FrontColor += lSpecular * mSpecular * specular;
          v_FrontColor += lDiffuse  * mDiffuse  * diffuse;
        }
        v_FrontColor += mEmission;
        v_FrontColor.a = mAlpha;
        v_clipDist = dot(position.xyz, clipPlane.xyz) + clipPlane.w;

        v_TexCoord = vUV;

        gl_Position = cameraProjectionViewMatrix * vec4(position, 1.0);
      }
    `
  }

  bindAttribute(programObject) {
    this._gl.bindAttribLocation(programObject, 0, 'vPosition')
    this._gl.bindAttribLocation(programObject, 1, 'vNormal')
    this._gl.bindAttribLocation(programObject, 2, 'vUV')
    this._gl.bindAttribLocation(programObject, 3, 'effBoneIndex')
    this._gl.bindAttribLocation(programObject, 4, 'effBoneWeight')
    //checkGLError(this._gl, 'bindAttribute')
  }

  bindAttribute2(programObject) {
    this._lTypeLoc     = this._gl.getUniformLocation(programObject, 'lType')
    this._lPositionLoc = this._gl.getUniformLocation(programObject, 'lPosition')
    this._lAmbientLoc  = this._gl.getUniformLocation(programObject, 'lAmbient')
    this._lDiffuseLoc  = this._gl.getUniformLocation(programObject, 'lDiffuse')
    this._lSpecularLoc = this._gl.getUniformLocation(programObject, 'lSpecular')
    
    this._mAmbientLoc   = this._gl.getUniformLocation(programObject, 'mAmbient')
    this._mDiffuseLoc   = this._gl.getUniformLocation(programObject, 'mDiffuse')
    this._mSpecularLoc  = this._gl.getUniformLocation(programObject, 'mSpecular')
    this._mShininessLoc = this._gl.getUniformLocation(programObject, 'mShininess')
    this._mEmissionLoc  = this._gl.getUniformLocation(programObject, 'mEmission')
    this._mAlphaLoc     = this._gl.getUniformLocation(programObject, 'mAlpha')

    this._clipPlaneLoc  = this._gl.getUniformLocation(programObject, 'clipPlane')
    //checkGLError(this._gl, 'bindAttribute2')
  }

  bufferDynamicVertexData(dhObject) {
    if(dhObject._model.dynamicSkinOffset >= 0){
      this._gl.bufferSubData(
        this._gl.ARRAY_BUFFER,
        dhObject._model.dynamicSkinOffset * 16*4,
        this.getDynamicVertexData(dhObject)
      )
    }
  }

  setAttribPointer() {
    this._gl.enableVertexAttribArray(0)
    this._gl.enableVertexAttribArray(1)
    this._gl.enableVertexAttribArray(2)
    this._gl.enableVertexAttribArray(3)
    this._gl.enableVertexAttribArray(4)

    // vertexAttribPointer(ulong idx, long size, ulong type, bool norm, long stride, ulong offset)
    // position
    this._gl.vertexAttribPointer(0, 3, this._gl.FLOAT, false, 16*4, 0*4)
    // normal
    this._gl.vertexAttribPointer(1, 3, this._gl.FLOAT, false, 16*4, 3*4)
    // textureUV
    this._gl.vertexAttribPointer(2, 2, this._gl.FLOAT, false, 16*4, 6*4)
    // boneIndex
    this._gl.vertexAttribPointer(3, 4, this._gl.FLOAT, false, 16*4, 8*4)
    // skinWeight
    this._gl.vertexAttribPointer(4, 4, this._gl.FLOAT, false, 16*4, 12*4)
    //checkGLError(this._gl, 'vertexAttribPointer')
  }

  setLightData(light) {
    /*
    const type = light.getType()
    const position = light.getPosition()
    const ambient = light.getAmbient()
    const diffuse = light.getDiffuse()
    const specular = light.getSpecular()
    */

    this._gl.uniform1i (this._lTypeLoc,     light.getType()    )
    this._gl.uniform3fv(this._lPositionLoc, light.getPosition())
    this._gl.uniform4fv(this._lAmbientLoc,  light.getAmbient() )
    this._gl.uniform4fv(this._lDiffuseLoc,  light.getDiffuse() )
    this._gl.uniform4fv(this._lSpecularLoc, light.getSpecular())
  }

  setMaterialData(material) {
    this._gl.uniform4fv(this._mAmbientLoc,   material.getAmbient()  )
    this._gl.uniform4fv(this._mDiffuseLoc,   material.getDiffuse()  )
    this._gl.uniform4fv(this._mSpecularLoc,  material.getSpecular() )
    this._gl.uniform1f (this._mShininessLoc, material.getShininess())
    this._gl.uniform4fv(this._mEmissionLoc,  material.getEmission() )
    this._gl.uniform1f (this._mAlphaLoc,     material.getAlpha()    )
  }

  setClipPlane(vec4) {
    this._gl.uniform4fv(this._clipPlaneLoc,  vec4.getWebGLFloatArray())
  }

  getVertexData(dhObject) {
    const skinArray = dhObject.getSkinArray()
    const data = []

    skinArray.forEach( (skin) => {
      data.push(skin.position.x)
      data.push(skin.position.y)
      data.push(skin.position.z)
      data.push(skin.normal.x)
      data.push(skin.normal.y)
      data.push(skin.normal.z)
      data.push(skin.textureUV.u)
      data.push(skin.textureUV.v)

      for(let i=0; i<4; i++){
        data.push(skin.boneIndex[i])
      }
      for(let i=0; i<4; i++){
        data.push(skin.skinWeight[i])
      }
    })

    return new Float32Array(data)
  }

  getDynamicVertexData(dhObject) {
    const skinArray = dhObject.getDynamicSkinArray()
    const data = []

    skinArray.forEach( (skin) => {
      data.push(skin.position.x)
      data.push(skin.position.y)
      data.push(skin.position.z)
      data.push(skin.normal.x)
      data.push(skin.normal.y)
      data.push(skin.normal.z)
      data.push(skin.textureUV.u)
      data.push(skin.textureUV.v)

      for(let i=0; i<4; i++){
        data.push(skin.boneIndex[i])
      }
      for(let i=0; i<4; i++){
        data.push(skin.skinWeight[i])
      }
    })

    return new Float32Array(data)
  }
}

ShaderBank.registShader(ToonVertexShader)


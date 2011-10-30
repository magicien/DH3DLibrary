/*--------------------------------------------------------------------------------
 * DH3DLibrary Renderer.js v0.1.0
 * Copyright (c) 2010-2011 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var Renderer = Class.create({
  _vertexShaderName: '',
  _fragmentShaderName: '',

  _gl: null,
  _vertexShader: null,
  _fragmentShader: null,
  _programObject: null,
  _camera: null,
  _light: null,

  _clearDepth: 1.0,
  
  initialize: function(gl, camera) {
    this._gl = gl;
    this._camera = camera;

    // initialize vertex shader
    this._vertexShader = ShaderBank.getShaderOfContext(this._vertexShaderName, gl);

    // initialize fragment shader
    this._fragmentShader = ShaderBank.getShaderOfContext(this._fragmentShaderName, gl);

    this._programObject = this._gl.createProgram();
    this._gl.attachShader(this._programObject, this._vertexShader.getShader());
    this._gl.attachShader(this._programObject, this._fragmentShader.getShader());

    // bind variables
    this._vertexShader.bindAttribute(this._programObject);

    // link program object
    this._gl.linkProgram(this._programObject);
    if(!this._gl.getProgramParameter(this._programObject, this._gl.LINK_STATUS)){
      //myAlert(this._gl.getProgramInfoLog(this._programObject));
    }
    this._vertexShader.bindAttribute2(this._programObject);

    this._gl.useProgram(this._programObject);

    this._gl.clearColor(1.0, 1.0, 1.0, 1.0);
    this._gl.clearDepth(this._clearDepth);

    this._gl.enable(gl.DEPTH_TEST);
    this._gl.enable(gl.BLEND);
    this._gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    this._gl.enable(gl.CULL_FACE);
    this._gl.cullFace(gl.FRONT);
    this._gl.checkGLError("Renderer.initialize");
  },

  setCamera: function(camera) {
    this.camera = camera;
  },

  setLight: function(light) {
    this._light = light;
  },

  render: function(dhObject) {
    // FIXME: いろいろ
    this._gl.checkGLError("before render");

    this._gl.useProgram(this._programObject);
    this._gl.checkGLError("gl.useProgram");

    this._gl.disable(this._gl.CULL_FACE);

    // camera setting
    this._gl.uniformMatrix4fv(this._gl.getUniformLocation(this._programObject, "cameraProjectionViewMatrix"), false, this._camera.getProjectionViewMatrix());
    this._gl.uniform3fv(this._gl.getUniformLocation(this._programObject, "cameraPosition"), this._camera.getPosition());
    this._gl.checkGLError("render: cameraPosition");

    // FIXME:Lightは毎回転送する必要ない？
    // FIXME:Locationのキャッシュ
    this._vertexShader.setLightData(this._light);

    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, dhObject.model.vertexBuffer);
    this._vertexShader.bufferDynamicVertexData(dhObject);
    this._vertexShader.setAttribPointer();

    // renderGroup毎に描画
    for(var i=0; i<dhObject.model.renderGroupArray.length; i++){
      var renderGroup = dhObject.model.renderGroupArray[i];
      var material = renderGroup.material;

      this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, renderGroup.indexBuffer);

      this._gl.checkGLError("gl.bindBuffer(ELEMENT_ARRAY_BUFFER)");

      this._vertexShader.setMaterialData(material);

      // bone行列
      var boneArr = $A();
      for(var j=0; j<renderGroup.boneArray.length; j++){
        boneArr = boneArr.concat(renderGroup.boneArray[j].inflMatrix.getArray());
      }

      this._gl.uniformMatrix4fv(
        this._gl.getUniformLocation(this._programObject, "effBones"),
        false, 
        new Float32Array(boneArr)
      );
      //this._gl.checkGLError("boneArr");
      this._gl.getError();

      // TODO: toon、edgeの設定

      if(material.texture){
        this._gl.checkGLError("before texture");
        this._gl.uniform1i(this._gl.getUniformLocation(this._programObject, "enableTexture"), 1);
        this._gl.checkGLError("gl.uniform1i, enableTexture=1");
        this._gl.activeTexture(this._gl.TEXTURE0);
        this._gl.checkGLError("gl.activeTexture");
        this._gl.bindTexture(this._gl.TEXTURE_2D, material.texture);
        this._gl.checkGLError("bindTexture");
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
        if(material.texture_repeat){
          this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.REPEAT);
          this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.REPEAT);
        }else{
          this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
          this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
        }
        this._gl.checkGLError("texParameteri");
      }else{
        this._gl.uniform1i(this._gl.getUniformLocation(this._programObject, "enableTexture"), 0);
        this._gl.checkGLError("gl.uniform1i, enableTexture=0");
        // FIXME: error
        //this._gl.disable(this._gl.TEXTURE_2D);
        //this._gl.checkGLError("gl.disable");
      }

      this._gl.drawElements(this._gl.TRIANGLES, renderGroup.indices.length, this._gl.UNSIGNED_SHORT, 0);
      this._gl.checkGLError("gl.drawElements: length:" + renderGroup.indices.length);
    }
  },

  getContext: function() {
    return this._gl;
  },

  getVertexData: function(dhObject) {
    return this._vertexShader.getVertexData(dhObject);
  },
  getDynamicVertexData: function(dhObject){
    return this._vertexShader.getDynamicVertexData(dhObject);
  },
});


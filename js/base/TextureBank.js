/*--------------------------------------------------------------------------------
 * DH3DLibrary TextureBank.js v0.1.0
 * Copyright (c) 2010-2011 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var TextureBank = Class.create({
  _gl: null,
  _textures: null,

  initialize: function() {
    this._textures = $H();
  },

  setContext: function(gl) {
    this._gl = gl;
  },

  getTexture: function(textureName){
    var texture = this._textures.get(textureName);
    if(texture == null){
      texture = this._gl.createTexture();
      var orgImage = new Image();
      var texImage;
      var gl = this._gl;
      var obj = this;

      var texCallback = function(){
        //gl.enable(gl.TEXTURE_2D);
        gl.checkGLError("gl.TEXTURE_2D");
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.checkGLError("gl.bindTexture");
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texImage);
        gl.checkGLError("gl.texImage2D");
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.checkGLError("gl.texParameteri: MAG_FILTER");
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.checkGLError("gl.texParameteri: MIN_FILTER");
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.checkGLError("gl.texParameteri: WRAP_S");
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.checkGLError("gl.texParameteri: WRAP_T");
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.checkGLError("gl.generateMipmap");
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.checkGLError("gl.bindTexture");
        //myAlert("error:" + gl.getError());
      };

      orgImage.onload = function(){
        gl.checkGLError("before image.onload");
        texImage = obj._createTextureImage(orgImage, texCallback);
      }
      orgImage.src = textureName;

      this._textures.set(textureName, texture);
    }
    return texture;
  },

  _createTextureImage: function(orgImage, callback){
    // adjust image width/height to powers of 2
    var texImage = new Image();

    var orgWidth = (orgImage.width >> 1);
    var texWidth = 1;
    while(orgWidth > 0){
      orgWidth >>= 1;
      texWidth <<= 1;
    }
    var orgHeight = (orgImage.height >> 1);
    var texHeight = 1;
    while(orgHeight > 0){
      orgHeight >>= 1;
      texHeight <<= 1;
    }

    // create canvas
    var texCanvas;
    var texContext;
    texCanvas = document.createElement('canvas');
    texCanvas.width = texWidth;
    texCanvas.height = texHeight;
    texContext = texCanvas.getContext("2d");

    // drawImage
    texContext.drawImage(orgImage, 0, 0, orgImage.width, orgImage.height,
                                   0, 0, texWidth, texHeight);

    // createImage from canvas data
    if(callback){
      texImage.onload = callback;
    }
    texImage.src = texCanvas.toDataURL();

    return texImage;
  },

});

TextureBank = new TextureBank();


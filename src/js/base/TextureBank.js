'use strict'

/**
 * TextureBank class
 * @access public
 */
export class TextureBank {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    /** @type {WebGLContext} */
    this._gl = null

    /** @type {Map} */
    this._textures = new Map()
  }

  setContext(gl) {
    this._gl = gl
  }

  getTextureID(canvas) {
    if(!(canvas instanceof HTMLCanvasElement)){
      return ''
    }
    if(!canvas._textureID){
      const radix = 16
      const length = 20
      let id = '_'

      for(let i=0; i<length; i++){
        const n = Math.floor(Math.random() * radix)
        id += n.toString(radix)
      }
      canvas._textureID = id
    }
    //return 'CANVAS:' + canvas._textureID
    return `CANVAS:${canvas._textureID}`
  }

  getTexture(textureName){
    let key = textureName
    if(textureName instanceof HTMLCanvasElement){
      key = this.getTextureID(textureName)
    }

    let texture = this._textures.get(key)

    if(texture === undefined){
      texture = this._gl.createTexture()
      const orgImage = new Image()
      let texImage = null
      const gl = this._gl
      const obj = this

      const texCallback = () => {
        //gl.enable(gl.TEXTURE_2D)
        gl.checkGLError('gl.TEXTURE_2D')
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.checkGLError('gl.bindTexture')
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texImage)
        gl.checkGLError('gl.texImage2D')
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.checkGLError('gl.texParameteri: MAG_FILTER')
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.checkGLError('gl.texParameteri: MIN_FILTER')
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.checkGLError('gl.texParameteri: WRAP_S')
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.checkGLError('gl.texParameteri: WRAP_T')
        gl.generateMipmap(gl.TEXTURE_2D)
        gl.checkGLError('gl.generateMipmap')
        gl.bindTexture(gl.TEXTURE_2D, null)
        gl.checkGLError('gl.bindTexture')
        //myAlert('error:' + gl.getError())
      }

      if(textureName instanceof HTMLCanvasElement){
        texImage = textureName
        texCallback()
      }else{
        orgImage.onload = () => {
          gl.checkGLError('before image.onload')
          texImage = obj._createTextureImage(orgImage, texCallback)
        }
        orgImage.src = textureName
      }

      this._textures.set(key, texture)
    }
    return texture
  }

  _createTextureImage(orgImage, callback){
    // adjust image width/height to powers of 2
    const texImage = new Image()

    let orgWidth = (orgImage.width >> 1)
    let texWidth = 1
    while(orgWidth > 0){
      orgWidth >>= 1
      texWidth <<= 1
    }

    let orgHeight = (orgImage.height >> 1)
    let texHeight = 1
    while(orgHeight > 0){
      orgHeight >>= 1
      texHeight <<= 1
    }

    // create canvas
    const texCanvas = document.createElement('canvas')
    texCanvas.width = texWidth
    texCanvas.height = texHeight
    const texContext = texCanvas.getContext('2d')

    // drawImage
    texContext.drawImage(orgImage, 0, 0, orgImage.width, orgImage.height,
                                   0, 0, texWidth, texHeight)

    // createImage from canvas data
    if(callback){
      texImage.onload = callback
    }
    texImage.src = texCanvas.toDataURL()

    return texImage
  }
}

// for singleton
export default new TextureBank()

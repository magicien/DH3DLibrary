'use strict'

import ModelBank from './ModelBank'
import MotionBank from './MotionBank'
import TextureBank from './TextureBank'
import MessageWindow from './MessageWindow'
import DH3DObject from './DH3DObject'

/**
 * 2D canvas 
 * @access public
 */
export default class CanvasField {
  /**
   * constructor
   * @access public
   * @constructor
   * @param {HTMLCanvasElement} canvasElement -
   * @param {Object} options -
   */
  constructor(canvasElement, options = {}) {
    /* @type {Canvas} */
    this._canvas = null
    this._2DCanvas = null

    this._gl = null
    this._program = null
    this._2DContext = null

    this._modelBank = null
    this._motionBank = null
    this._textureBank = null

    this._cameras = null
    this._lights = null

    this._fps = null

    this._canvasWidth = 0
    this._canvasHeight = 0
    this._widthPerX = 100.0

    //this._timer = null
    this._prevTime = null
    this._spf = 0
    this._fps = 0
    this._animating = false

    this._requestAnimationFrame = null
    this._frameCallback = null

    this._objs = null
    this._alphaObjs = null
    this._refObjs = null
    this._mirrorOn = false


    this._canvas = canvasElement

    /*
    const opt = {}
    opt.alpha = options.alpha || true
    opt.depth = options.depth || true
    opt.stencil = options.stencil || true
    opt.antialias = options.antialias || true
    opt.premultipliedAlpha = options.premultipliedAlpha || true
    opt.preserveDrawingBuffer = options.preserveDrawingBuffer || false
    opt.preferLowPowerToHighPerformance = options.preferLowPowerToHighPerformance || false
    opt.failIfMajorPerformanceCaveat = options.failIfMajorPerformanceCaveat || false
    */

    // DEBUG:
    const opt = { stencil: true }

    try{
      this._gl = this._canvas.getContext('webgl', opt)
    }catch(e){ /* nothing to do */ }

    try{
      if(!this._gl){
        this._gl = this._canvas.getContext('webkit-3d', opt)
      }
    }catch(e){ /* nothing to do */}

    try{
      if(!this._gl){
        this._gl = this._canvas.getContext('moz-webgl', opt)
      }
    }catch(e){ /* nothing to do */ }

    try{
      if(!this._gl){
        this._gl = this._canvas.getContext('experimental-webgl', opt)
      }
    }catch(e){ /* nothing to do */ }

    if(!this._gl){
      throw new Error('Canvas.getContext error')
    }

    try{
      // http://d.hatena.ne.jp/calpo/20110523/p1
      this._requestAnimationFrame = window.requestAnimationFrame ||
                                    window.webkitRequestAnimationFrame ||
                                    window.mozRequestAnimationFrame ||
                                    window.oRequestAnimationFrame ||
                                    window.msRequestAnimationFrame ||
                                    ((callback) => { window.setTimeout(callback, 1000 / 60) })
                                    //function() { alert('requestAnimationFrame not supported.') }
    }catch(e){ /* nothing to do */ }

    const canvas2D = document.createElement('canvas')
    this._canvas.parentNode.insertBefore(canvas2D, this._canvas.nextSibling)
    const style = canvas2D.style
    style.position = 'absolute'
    style['z-index'] = 10

    this._copyPosition(this._canvas, canvas2D)

    this._2DCanvas = canvas2D
    this._2DContext = this._2DCanvas.getContext('2d')

    this.setProgram(this._gl.createProgram())

    TextureBank.setContext(this._gl)

    this._objs = []
    this._alphaObjs = []
    this._refObjs = []

    this._modelBank = ModelBank
    this._motionBank = MotionBank
    this._textureBank = TextureBank

    this._cameras = []
    this._lights = []

    this.setFPS(30)

    this._gl.checkGLError = (message) => { this.checkGLError(message) }
  }

  /**
   * copy canvas element position, from prototype.js
   * @access private
   * @param {HTMLCanvasElement} src - source
   * @param {HTMLCanvasElement} dst - destination 
   * @returns {void}
   */
  _copyPosition(src, dst) {
    const offset = this._viewportOffset(src)
    let delta = [0, 0]

    if(src.style.position === 'absolute') {
      const parent = this._getOffsetParent(src)
      if (parent !== document.body) delta = this._viewportOffset(parent)
    }

    dst.width = src.width
    dst.height = src.height

    dst.style.left = offset.x + window.pageXOffset - delta.x + 'px'
    dst.style.top  = offset.y + window.pageYOffset - delta.y + 'px'
  }

  /**
   * get viewport offset of element
   * @access private
   * @param {Element} element - 
   * @returns {Object} viewport offset {x, y}
   */
  _viewportOffset(element) {
    let x = 0
    let y = 0

    for(let e = element; e != null; e = e.offsetParent) {
      x += e.offsetLeft || 0
      y += e.offsetTop  || 0
      if(e.offsetParent === document.body &&
         e.style.position === 'absolute')
        break
    }

    for(let e = element; e != null; e = e.offsetParent) {
      x -= e.scrollLeft || 0
      y -= e.scrollTop  || 0
    }

    return { x, y }
  }

  _getOffsetParent(element) {
    //if(!Element.descendantOf(element, document.body)){
    if((element.compareDocumentPosition(document.body) & 8) !== 8){
      return document.body
    }

    if(element.style.display !== 'inline' && element.offsetParent){
      return element.offsetParent
    }

    let e = element
    while((e = e.parentNode) && e !== document.body){
      if(e.style.position !== 'static'){
        if(element === document)
          return document.body

        return e
      }
    }

    return document.body
  }

  _callNextFrame() {
    const obj = this

    // "Reflect" is not yet implemented...
    this._requestAnimationFrame.call(window, () => { obj.drawPicture() } )
    //Reflect.apply(this._requestAnimationFrame, window, () => { obj.drawPicture() } )
  }

  getContext() {
    return this._gl
  }

  get2DContext() {
    return this._2DContext
  }

  addObject(obj, alpha, notReflection) {
    // FIXME: auto detection of alpha object
    if(alpha){
      this._alphaObjs.push(obj)
    }else{
      this._objs.push(obj)
    }

    if(!notReflection && obj instanceof DH3DObject){
      this._refObjs.push(obj)
    }
  }

  removeObject(obj) {
    //this._objs = this._objs.without(obj)
    this._objs = this._objs.filter((o) => { return o !== obj })
    //this._alphaObjs = this._alphaObjs.without(obj)
    this._alphaObjs = this._alphaObjs.filter((o) => { return o !== obj })
    //this._refObjs = this._refObjs.without(obj)
    this._refObjs = this._refObjs.filter((o) => { return o !== obj })
  }

  start() {
    if(!this._animating){
      this._animating = true
      this._prevTime = null
      this._callNextFrame()
    }
  }

  pause() {
    this._animating = false
  }

  reshape(force) {
    if (!force && this._canvas.clientWidth === this._canvasWidth && this._canvas.clientHeight === this._canvasHeight)
      return

    this._2DCanvas.width  = this._canvas.clientWidth
    this._2DCanvas.height = this._canvas.clientHeight

    this._canvasWidth =  this._canvas.clientWidth
    this._canvasHeight = this._canvas.clientHeight

    this._gl.viewport(0, 0, this._canvasWidth, this._canvasHeight)
  }

  drawPicture() {
    let elapsedTime = 0
    const nowTime = (new Date()).getTime()

    if(this._prevTime == null){
      elapsedTime = 0.0
    }else{
      elapsedTime = (nowTime - this._prevTime) * 0.001
    }
    this._prevTime = nowTime

    this.reshape()
    if(this._frameCallback){
      this._frameCallback(elapsedTime)
    }

    this._objs.forEach( (obj) => {
      obj.move(elapsedTime)
    })
    this._alphaObjs.forEach( (obj) => {
      obj.move(elapsedTime)
    })
    // FIXME: z-sort of alpha objects

    this._cameras.forEach( (camera) => { camera.update(elapsedTime) })

    this._2DContext.clearRect(0, 0, this._canvasWidth, this._canvasHeight)
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT | this._gl.STENCIL_BUFFER_BIT)

    if(this._mirrorOn){
      // render with mirror effect
      // FIXME: multipass

      // draw without mirror
      this._objs.forEach( (obj) => {
        obj.animate(elapsedTime)

        // FIXME
        if(obj._renderer){
          const gl = obj._renderer._gl
          obj._renderer.enableStencil()
          gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE)
          if(obj._mirror){
            // fill 16 to mirror area
            gl.stencilFunc(gl.ALWAYS, 16, obj._renderer._stencilMask)
          }else{
            // fill 0 to not mirror area
            gl.stencilFunc(gl.ALWAYS,  0, obj._renderer._stencilMask)
          }
        }
        obj.render()
      })

      // update stencil buffer
      const refObjs = this._refObjs
      this._objs.forEach( (obj) => {
        if(obj._mirror){
          // FIXME
          obj._renderer.enableStencil()
          obj.renderMirror(refObjs)
        }
      })

      this._alphaObjs.forEach( (obj) => {
        obj._renderer.disableStencil()
        obj.animate(elapsedTime)
        obj.render()
      })
    }else{
      // render without mirror effect
      this._objs.forEach( (obj) => {
        obj.animate(elapsedTime)
        obj.render()
      })
      this._alphaObjs.forEach( (obj) => {
        obj.animate(elapsedTime)
        obj.render()
      })
    }

    this._gl.flush()

    if(this._animating){
      this._callNextFrame()
    }
  }

  drawOneFrame() {
    this._prevTime = null
    this.drawPicture()
  }

  setFrameCallback(func) {
    this._frameCallback = func
  }

  getFPS() {
    return this._fps
  }

  setFPS(fps) {
    this._fps = fps
    this._spf = 1.0 / fps
    if(this._timer){
      this.pause()
      this.start()
    }
  }

  getProgram() {
    return this._program
  }

  setProgram(program) {
    this._program = program
  }

  checkGLError(message) {
    const err = this._gl.getError()

    if(err){
      console.log(`${message} : ${err}`)
    }
  }

  getCameras() {
    return this._cameras
  }

  setCamera(camera) {
    this._cameras.length = 0
    this._cameras.push(camera)
  }

  getLights() {
    return this.lights
  }

  setLights(light) {
    this._lights.length = 0
    this._lights.push(light)
  }

  enableMirror() {
    this._mirrorOn = true
  }

  disableMirror() {
    this._mirrorOn = false
  }

  createMessageWindow() {
    const mw = new MessageWindow()
    mw.setCanvas(this)
    this.addObject(mw)

    return mw
  }

  setDropEvent(func) {
    this._2DCanvas.observe('dragenter', function(e){ e.preventDefault() })
    this._2DCanvas.observe('dragover',  function(e){ e.preventDefault() })
    this._2DCanvas.observe('drop', function(e){
      e.preventDefault()
      func(e)
    })
  }

  disableDropEvent() {
    // FIXME
  }
}


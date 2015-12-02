/*--------------------------------------------------------------------------------
 * DH3DLibrary CanvasField.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var CanvasField = Class.create({
  _canvas: null,
  _2DCanvas: null,

  _gl: null,
  _program: null,
  _2DContext: null,

  _modelBank: null,
  _motionBank: null,
  _textureBank: null,

  _cameras: null,
  _lights: null,

  _fps: null,
  _logger: null,

  _canvasWidth: 0,
  _canvasHeight: 0,
  _widthPerX: 100.0,
  //_cameraFar: 100.0,
  //_cameraNear: 1.0,

  _timer: null,
  _prevTime: null,
  _spf: 0,
  _fps: 0,

  _frameCallback: null,

  _objs: null,
  _alphaObjs: null,
  _refObjs: null,
  _mirrorOn: false,

  initialize: function(canvasElement) {
    this._canvas = canvasElement;
    try{
      this._gl = this._canvas.getContext('webkit-3d', {stencil: true});
    }catch(e){}
    try{
      if(!this._gl){
        this._gl = this._canvas.getContext('moz-webgl', {stencil: true});
      }
    }catch(e){}
    try{
      if(!this._gl){
        this._gl = this._canvas.getContext('experimental-webgl', {stencil: true});
      }
    }catch(e){}

    var canvas2D = document.createElement('canvas');
    this._canvas.insert( {after: canvas2D} );
    Element.setStyle(canvas2D, {
      position: 'absolute',
      'z-index': 10
    });
    Position.clone(this._canvas, canvas2D);

    canvas2D.width  = this._canvas.width;
    canvas2D.height = this._canvas.height;

    this._2DCanvas = canvas2D;
    this._2DContext = this._2DCanvas.getContext("2d");

    this.setProgram(this._gl.createProgram());

    TextureBank.setContext(this._gl);

    this._objs = $A();
    this._alphaObjs = $A();
    this._refObjs = $A();

    this._modelBank = ModelBank;
    this._motionBank = MotionBank;
    this._textureBank = TextureBank;

    this._cameras = $A();
    this._lights = $A();

    this.setFPS(30);
    this.setLogger(new Logger());

    var obj = this;
    this._gl.checkGLError = function(message){ obj.checkGLError(message); };
  },

  getContext: function() {
    return this._gl;
  },

  get2DContext: function() {
    return this._2DContext;
  },

  //addObject: function(obj, alpha, notReflection) {
  addObject: function(obj, alpha, notReflection) {
    // FIXME: auto detection of alpha object
    if(alpha){
      this._alphaObjs.push(obj);
    }else{
      this._objs.push(obj);
    }
    //this._objs.push(obj);

    if(!notReflection && (obj instanceof DH3DObject)){
      this._refObjs.push(obj);
    }
  },

  removeObject: function(obj) {
    this._objs = this._objs.without(obj);
    this._alphaObjs = this._alphaObjs.without(obj);
    this._refObjs = this._refObjs.without(obj);
  },

  start: function() {
    var obj = this;
    if(!this._timer){
      this._prevTime = undefined;
      this._timer = setInterval(function() { obj.drawPicture(); }, obj.spf);
    }
  },

  pause: function() {
    if(this._timer){
      clearInterval(this._timer);
      this._timer = undefined;
    }
  },

  reshape: function(force) {
    if (!force && this._canvas.clientWidth == this._canvasWidth && this._canvas.clientHeight == this._canvasHeight)
      return;

    var worldWidth;
    var worldHeight;

    this._2DCanvas.width  = this._canvas.clientWidth;
    this._2DCanvas.height = this._canvas.clientHeight;

    this._canvasWidth =  this._canvas.clientWidth;
    this._canvasHeight = this._canvas.clientHeight;

    this._gl.viewport(0, 0, this._canvasWidth, this._canvasHeight);

    /*
    var cameraFar =  this._cameraFar;
    var cameraNear = this._cameraNear;
    worldWidth  = this._canvasWidth  * 0.5 / this._widthPerX;
    worldHeight = this._canvasHeight * 0.5 / this._widthPerX;
    this._cameras.each( function(camera){
      camera.identity();
      camera.frustum(-worldWidth, worldWidth, -worldHeight, worldHeight, cameraNear, cameraFar);
    });
    */
  },

  drawPicture: function() {
    var elapsedTime;
    var nowTime = (new Date()).getTime();
    if(this._prevTime == undefined){
      //elapsedTime = 1.0;
      elapsedTime = 0.0;
    }else{
      elapsedTime = (nowTime - this._prevTime) * 0.001;
    }
    this._prevTime = nowTime;

    this.reshape();
    if(this._frameCallback){
      this._frameCallback(elapsedTime);
    }

    this._objs.each( function(obj){
      obj.move(elapsedTime);
    });
    this._alphaObjs.each( function(obj){
      obj.move(elapsedTime);
    });
    // FIXME: z-sort of alpha objects

    this._cameras.each(function(camera){ camera.update(elapsedTime); });

    this._2DContext.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT | this._gl.STENCIL_BUFFER_BIT);

    if(this._mirrorOn){
      // render with mirror effect
      // FIXME: multipass

      // draw without mirror
      this._objs.each( function(obj){
        obj.animate(elapsedTime);

        // FIXME
        if(obj._renderer){
          var gl = obj._renderer._gl;
          obj._renderer.enableStencil();
          gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
          if(obj._mirror){
            // fill 16 to mirror area
            gl.stencilFunc(gl.ALWAYS, 16, obj._renderer._stencilMask);
          }else{
            // fill 0 to not mirror area
            gl.stencilFunc(gl.ALWAYS,  0, obj._renderer._stencilMask);
          }
        }
        obj.render();
      });

      // update stencil buffer
      var refObjs = this._refObjs;
      this._objs.each( function(obj){
        if(obj._mirror){
          // FIXME
          obj._renderer.enableStencil();
          obj.renderMirror(refObjs);
        }
      });

      this._alphaObjs.each( function(obj){
        obj._renderer.disableStencil();
        obj.animate(elapsedTime);
        obj.render();
      });
    }else{
      // render without mirror effect
      this._objs.each( function(obj){
        obj.animate(elapsedTime);
        obj.render();
      });
      this._alphaObjs.each( function(obj){
        obj.animate(elapsedTime);
        obj.render();
      });
    }

    this._gl.flush();
  },

  drawOneFrame: function() {
    this._prevTime = undefined;
    this.drawPicture();
  },

  setFrameCallback: function(func) {
    this._frameCallback = func;
  },

  getFPS: function() {
    return this._fps;
  },

  setFPS: function(fps) {
    this._fps = fps;
    this._spf = 1.0 / fps;
    if(this._timer){
      this.pause();
      this.start();
    }
  },

  getProgram: function() {
    return this._program;
  },

  setProgram: function(program) {
    this._program = program;
  },

  checkGLError: function(message) {
    // FIXME
    return;

    var err = this._gl.getError();
    if(err){
      this.log(message + ":" + err);
    }
  },

  getCameras: function() {
    return this._cameras;
  },

  setCamera: function(camera) {
    //this._cameras.push(camera);
    this._cameras.clear().push(camera);
  },

  getLights: function() {
    return this.lights;
  },

  setLights: function(light) {
    //this._lights.push(light);
    this._lights.clear().push(light);
  },

  enableMirror: function() {
    this._mirrorOn = true;
  },

  disableMirror: function() {
    this._mirrorOn = false;
  },

  getLogger: function() {
    return this._logger;
  },

  setLogger: function(logger) {
    this._logger = logger;
  },

  createMessageWindow: function() {
    var mw = new MessageWindow();
    mw.setCanvas(this);
    this.addObject(mw);

    return mw;
  },

  setDropEvent: function(func) {
    this._2DCanvas.observe('dragenter', function(e){ e.preventDefault(); });
    this._2DCanvas.observe('dragover',  function(e){ e.preventDefault(); });
    this._2DCanvas.observe('drop', function(e){
      e.preventDefault();
      func(e);
    });
  },

  disableDropEvent: function() {
    // FIXME
  },

  log: function(message) {
    if(this._logger){
      this._logger.log(message);
    }
  },

  debug: function(message) {
  },
});

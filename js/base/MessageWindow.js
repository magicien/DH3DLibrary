/*--------------------------------------------------------------------------------
 * DH3DLibrary MessageWindow.js v0.1.0
 * Copyright (c) 2010-2011 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var MessageWindow = Class.create(DH2DObject, {
  _bindedObject: null,
  _bindedCanvas: null,
  _bindedCamera: null,
  _bindedBone:   null,

  _time: 0.0,
  _speed: 3.0,

  MODE_READY: 0,
  MODE_OPEN: 1,
  MODE_STRING: 2,
  MODE_STAY: 3,
  MODE_CLOSE: 4,
  _mode: 0,

  _x: 100,
  _y: 140,

  _message: "",
  _messageWidth: 0,
  _offset: null,
  _screenOffset: null,
  _margin: 5,
  _padding: 5,
  _iconPadding: 5,

  _icon: null,

  // balloon context
  _borderColor: "black",
  _backgroundColor: "white",
  _globalAlpha: 1,
  _globalCompositeOperation: "source-over",
  _lineCap: "butt",
  _lineJoin: "miter",
  _lineWidth: 1,
  _miterLimit: 10,
  _balloonShadowBlur: 0,
  _balloonShadowColor: "rgba(0, 0, 0, 0.0)",
  _balloonShadowOffsetX: 0,
  _balloonShadowOffsetY: 0,

  // text context
  _textColor: "black",
  _font: "10px sans-serif",
  _textAlign: "start",
  _textBaseline: "alphabetic",
  _textShadowBlur: 0,
  _textShadowColor: "rgba(0, 0, 0, 0.0)",
  _textShadowOffsetX: 0,
  _textShadowOffsetY: 0,

  initialize: function($super) {
    $super();
  },

  animate: function(elapsedTime) {
    if(  this._mode == this.MODE_OPEN
      || this._mode == this.MODE_STRING
      || this._mode == this.MODE_CLOSE){
      this._time += this._speed * elapsedTime;
    }
  },

  render: function() {
    var c = this._bindedCanvas._2DContext;
    var padding = this._padding;
    var iconPadding = this._iconPadding;
    var vHeight = 10;
    var textHeight = 10; // FIXME
    var heightMax = textHeight + padding * 2;
    var widthMax = this._messageWidth + padding * 2;
    var height;
    var width;

    if(this._icon) {
      widthMax  += this._icon.width  + iconPadding;
      heightMax += this._icon.height + iconPadding;
    }

    var targetX = this._x;
    var targetY = this._y;
    if(this._bindedObject && this._bindedCamera){
      var worldPos;
      var windowPos;

      worldPos = new DHVector3(this._bindedObject.position);
      if(this._bindedBone){ // FIXME
        var bone = this._bindedObject.model.boneHash.get(this._bindedBone);
        worldPos.add(worldPos, bone.position);
      }

      if(this._offset){
        worldPos.add(worldPos, this._offset);
      }
      windowPos = this._bindedCamera.getScreenPosition(worldPos);
      /*
      this._x = this._bindedCanvas._canvasWidth * 0.5
              + this._bindedCanvas._widthPerX * windowPos.x;
      this._y = this._bindedCanvas._canvasHeight * 0.5
              - this._bindedCanvas._widthPerX * windowPos.y;
      */
      this._x = this._bindedCanvas._canvasWidth  * 0.5 * (1.0 + windowPos.x);
      this._y = this._bindedCanvas._canvasHeight * 0.5 * (1.0 - windowPos.y);
      /*
      var cw = this._bindedCanvas._canvasWidth;
      var ch = this._bindedCanvas._canvasHeight;
      var maxWidth;
      if(cw > ch){
        maxWidth = cw;
      }else{
        maxWidth = ch;
      }
      this._x = cw * 0.5 + maxWidth * 0.5 * windowPos.x;
      this._y = ch * 0.5 - maxWidth * 0.5 * windowPos.y;
      */

      if(this._screenOffset){
        this._x += this._screenOffset.x;
        this._y += this._screenOffset.y;
      }
      targetX = this._x;
      targetY = this._y;
      var left = this._x - widthMax * 0.5;
      var right = this._x + widthMax * 0.5;
      //var top = this._y - heightMax * 0.5;
      //var bottom = this._y + heightMax * 0.5;
      var top = this._y - heightMax;
      var bottom = this._y;

      if(widthMax > this._bindedCanvas._canvasWidth - this._margin * 2){
        // size over
        // FIXME
      }else if(left < this._margin){
        // too left
        this._x += this._margin - left;
      }else if(right > this._bindedCanvas._canvasWidth - this._margin){
        // too right
        this._x -= right - this._bindedCanvas._canvasWidth + this._margin;
      }

      if(heightMax > this._bindedCanvas._canvasHeight - this._margin * 2){
        // size over
        // FIXME
      }else if(top < this._margin){
        // too high
        this._y += this._margin - top;
      }else if(bottom > this._bindedCanvas._canvasHeight - this._margin){
        // too low
        this._y -= bottom - this._bindedCanvas._canvasHeight + this._margin;
      }
    }

    if(this._mode == this.MODE_OPEN){
      if(this._time >= 1.0){
        this._time = 0.0;
        this._mode = this.MODE_STRING;
        height = heightMax;
        width = widthMax;
      }else{
        height = heightMax * this._time;
        width = widthMax * this._time;
      }
      //this.drawBalloon(this._x - width * 0.5, this._y - height * 0.5, width, height);
      // FIXME
      this.drawBalloon(targetX, targetY + vHeight, this._x - width * 0.5, this._y - height, width, height);
    }else if(this._mode == this.MODE_STRING){
      var iconTop;
      var iconLeft;
      var textLeft = this._x - widthMax * 0.5 + padding;
      var text;

      if(this._icon){
        iconTop  = this._y - heightMax + padding;
        iconLeft = textLeft;
        textLeft += this._icon.width + iconPadding;
      }

      if(this._time >= 1.0){
        this._time = 0.0;
        this._mode = this.MODE_STAY;
        text = this._message;
      }else{
        var textLen = Math.ceil(this._message.length * this._time);
        text = this._message.substr(0, textLen);
      }
      //this.drawBalloon(this._x - widthMax * 0.5, this._y - heightMax * 0.5, widthMax, heightMax);
      // FIXME
      this.drawBalloon(targetX, targetY + vHeight, this._x - widthMax * 0.5, this._y - heightMax, widthMax, heightMax);

      if(this._icon){
        c.drawImage(this._icon, iconLeft, iconTop);
      }
      
      this.setupTextContext();
      c.strokeText(text, textLeft, this._y - heightMax * 0.5, widthMax);
    }else if(this._mode == this.MODE_STAY){
      //this.drawBalloon(this._x - widthMax * 0.5, this._y - heightMax * 0.5, widthMax, heightMax);
      // FIXME
      this.drawBalloon(targetX, targetY + vHeight, this._x - widthMax * 0.5, this._y - heightMax, widthMax, heightMax);

      var textLeft = this._x - widthMax * 0.5 + padding;
      if(this._icon){
        var iconTop  = this._y - heightMax + padding;
        var iconLeft = textLeft;
        textLeft += this._icon.width + iconPadding;

        c.drawImage(this._icon, iconLeft, iconTop);
      }

      this.setupTextContext();
      c.strokeText(this._message, textLeft, this._y - heightMax * 0.5, widthMax);
    }else if(this._mode == this.MODE_CLOSE){
      if(this._time >= 1.0){
        this._time = 0.0;
        this._mode = this.MODE_READY;
      }else{
        height = heightMax * (1.0 - this._time);
        width = widthMax * (1.0 - this._time);
        //this.drawBalloon(this._x - width * 0.5, this._y - height * 0.5, width, height);
        // FIXME
        this.drawBalloon(targetX, targetY + vHeight, this._x - width * 0.5, this._y - height, width, height);
      }
    }
  },

  setupTextContext: function() {
    var c = this._bindedCanvas._2DContext;

    c.font          = this._font;
    c.strokeStyle   = this._textColor;
    c.textAlign     = this._textAlign;
    c.textBaseline  = this._textBaseline;

    c.shadowBlue    = this._textShadowBlur;
    c.shadowColor   = this._textShadowColor;
    c.shadowOffsetX = this._textShadowOffsetX;
    c.shadowOffsetY = this._textShadowOffsetY;
  },

  setupBalloonContext: function() {
    var c = this._bindedCanvas._2DContext;

    c.fillStyle     = this._backgroundColor;
    c.strokeStyle   = this._borderColor;

    c.globalAlpha   = this._globalAlpha;
    c.globalCompositeOperation
                    = this._globalCompositeOperation;

    c.lineCap       = this._lineCap;
    c.lineJoin      = this._lineJoin;
    c.lineWidth     = this._lineWidth;

    c.shadowBlur    = this._balloonShadowBlur;
    c.shadowColor   = this._balloonShadowColor;
    c.shadowOffsetX = this._balloonShadowOffsetX;
    c.shadowOffsetY = this._balloonShadowOffsetY;
  },

  drawBalloon: function(speakerX, speakerY, left, top, width, height) {
    var c = this._bindedCanvas._2DContext;
    var vWidth = 5;
    var bottom = top  + height;
    var right  = left + width;
    var vLeft  = speakerX - vWidth;
    var vRight = speakerX + vWidth;
    var p      = this._padding;
    var w      = this._padding * 0.67;

    var vLeftLimit  = p + this._margin;
    var vRightLimit = this._bindedCanvas._canvasWidth - p - this._margin;
    if(vLeft < vLeftLimit){
      vLeft = vLeftLimit;
      vRight = vLeft + vWidth * 2;
    }else if(vRight > vRightLimit){
      vRight = vRightLimit;
      vLeft = vRight - vWidth * 2;
    }

    // set balloon context
    this.setupBalloonContext();

    c.beginPath();

    c.moveTo(speakerX, speakerY);
    c.lineTo(vLeft, bottom)
    c.lineTo(left + p, bottom);
    c.bezierCurveTo(left + w, bottom,
                    left, bottom - w,
                    left, bottom - p);
    c.lineTo(left, top + p);
    c.bezierCurveTo(left, top + w,
                    left + w, top,
                    left + p, top);
    c.lineTo(right - p, top);
    c.bezierCurveTo(right - w, top,
                    right, top + w,
                    right, top + p);
    c.lineTo(right, bottom - p);
    c.bezierCurveTo(right, bottom - w,
                    right - w, bottom,
                    right - p, bottom);
    c.lineTo(vRight, bottom);
    c.lineTo(speakerX, speakerY);

    c.closePath();

    c.fill();
    c.stroke();
  },

  open: function() {
    this._mode = this.MODE_OPEN;
    this._time = 0.0;
  },

  close: function() {
    this._mode = this.MODE_CLOSE;
    this._time = 0.0;
  },

  getContext: function() {
    return this._bindedCanvas._2DContext;
  },

/*
  setContext: function(context) {
    this._bindedContext = context;
  },
*/

  getCanvas: function() {
    return this._bindedCanvas;
  },

  setCanvas: function(canvas) {
    this._bindedCanvas = canvas;
  },

  getIcon: function() {
    return this._icon;
  },

  setIcon: function(icon) {
    this._icon = icon;
  },

  getOffset: function() {
    return this._offset;
  },

  setOffset: function(x, y, z) {
    if(x instanceof DHVector3){
      this._offset = x;
    }else{
      this._offset = new DHVector3(x, y, z);
    }
  },

  getScreenOffset: function() {
    return this._screenOffset;
  },

  setScreenOffset: function(x, y, z) {
    if(x instanceof DHVector3){
      this._screenOffset = x;
    }else{
      this._screenOffset = new DHVector3(x, y, z);
    }
  },

  getMessage: function() {
    return this._message;
  },

  setMessage: function(message) {
    this._message = message;

    var met = this._bindedCanvas._2DContext.measureText(message);
    this._messageWidth = met.width;
  },

  getState: function() {
    return this._mode;
  },
});

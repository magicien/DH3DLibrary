/*--------------------------------------------------------------------------------
 * DH3DLibrary MessageWindow.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
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
  _formattedMessage: $A(),
  _lines: 0,
  _lineHeight: 15,
  _messageWidth: 0,
  _messageHeight: 0,
  _messageNumChars: 0,
  _maxWidth: -1,
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
  _textBaseline: "top",
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
    var heightMax = this._messageHeight + padding * 2;
    var widthMax = this._messageWidth + padding * 2;
    var height;
    var width;

    var targetX = this._x;
    var targetY = this._y;
    if(this._bindedObject && this._bindedCamera){
      var worldPos = new DHVector3();
      var windowPos;

      if(this._bindedBone){ // FIXME
        var bone = this._bindedObject._model.boneHash.get(this._bindedBone);
        worldPos.x = bone.localMatrix.m41;
        worldPos.y = bone.localMatrix.m42;
        worldPos.z = bone.localMatrix.m43;
      }else{
        worldPos.setValue(this._bindedObject._position);
      }

      if(this._offset){
        worldPos.add(worldPos, this._offset);
      }
      windowPos = this._bindedCamera.getScreenPosition(worldPos);
      this._x = this._bindedCanvas._canvasWidth  * 0.5 * (1.0 + windowPos.x);
      this._y = this._bindedCanvas._canvasHeight * 0.5 * (1.0 - windowPos.y);

      if(this._screenOffset){
        this._x += this._screenOffset.x;
        this._y += this._screenOffset.y;
      }
      targetX = this._x;
      targetY = this._y;
      var left = this._x - widthMax * 0.5;
      var right = this._x + widthMax * 0.5;
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
      // FIXME
      this.drawBalloon(targetX, targetY + vHeight, this._x - width * 0.5, this._y - height, width, height);
    }else if(this._mode == this.MODE_STRING){
      var textLen;

      if(this._time >= 1.0){
        this._time = 0.0;
        this._mode = this.MODE_STAY;
	textLen = this._messageNumChars;
      }else{
        textLen = Math.ceil(this._messageNumChars * this._time);
      }
      // FIXME
      this.drawBalloon(targetX, targetY + vHeight, this._x - widthMax * 0.5, this._y - heightMax, widthMax, heightMax);

      this._drawIconAndText(textLen);
    }else if(this._mode == this.MODE_STAY){
      // FIXME
      this.drawBalloon(targetX, targetY + vHeight, this._x - widthMax * 0.5, this._y - heightMax, widthMax, heightMax);

      this._drawIconAndText();
    }else if(this._mode == this.MODE_CLOSE){
      if(this._time >= 1.0){
        this._time = 0.0;
        this._mode = this.MODE_READY;
      }else{
        height = heightMax * (1.0 - this._time);
        width = widthMax * (1.0 - this._time);
        // FIXME
        this.drawBalloon(targetX, targetY + vHeight, this._x - width * 0.5, this._y - height, width, height);
      }
    }
  },

  _drawIconAndText: function(len) {
    var c = this._bindedCanvas._2DContext;

    var drawLen = this._messageNumChars;
    if(0 < len && len < drawLen){
      drawLen = len;
    }

    var widthMax = this._messageWidth + this._padding * 2;
    var heightMax = this._messageHeight + this._padding * 2;
    var textLeft = this._x - widthMax * 0.5 + this._padding;
    var textTop = this._y - heightMax + this._padding;
    var iconLeft = 0;
    var iconTop = 0;
    var iconLines = 0;
    var iconTextLeft = textLeft;
    var iconPadding = this._iconPadding;

    // drawIcon
    if(this._icon){
      iconTop  = textTop;
      iconLeft = textLeft;
      iconLines = Math.ceil((this._icon.height + iconPadding) / this._lineHeight);
      iconTextLeft += this._icon.width + iconPadding;

      c.drawImage(this._icon, iconLeft, iconTop);
    }

    // drawText
    this.setupTextContext();
    var numChars = 0;
    var line = 0;
    var top = this._y - this._messageHeight - this._padding;
    while(numChars < drawLen){
      var str = this._formattedMessage[line];
      var strLen = str.length;
      if(strLen + numChars > drawLen){
        strLen = drawLen - numChars;
        str = str.substr(0, strLen);
      }

      var left = textLeft;
      if(line < iconLines){
        left = iconTextLeft;
      }

      //c.strokeText(str, left, top);
      c.fillText(str, left, top);

      numChars += strLen;
      top += this._lineHeight;
      line++;
    }
  },

  setupTextContext: function() {
    var c = this._bindedCanvas._2DContext;

    c.font          = this._font;
    c.fillStyle     = this._textColor;
    c.textAlign     = this._textAlign;
    c.textBaseline  = this._textBaseline;

    c.shadowBlur    = this._textShadowBlur;
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
    this._updateMessageSize();
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
    this._updateMessageSize();
  },

  getIcon: function() {
    return this._icon;
  },

  setIcon: function(icon) {
    this._icon = icon;
    this._updateMessageSize();
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
    this._updateMessageSize();
  },

  getMaxWidth: function() {
    return this._maxWidth;
  },

  setMaxWidth: function(maxWidth) {
    this._maxWidth = maxWidth;
    this._updateMessageSize();
  },

  _updateMessageSize: function() {
    var iconWidth = 0;
    var iconHeight = 0;

    if(this._icon){
      iconWidth  = this._icon.width  + this._iconPadding;
      iconHeight = this._icon.height + this._iconPadding;
    }
    if(this._message == null){
      this._messageNumChars = 0;
      this._messageWidth  = iconWidth;
      this._messageHeight = iconHeight;
      return;
    }
    
    var mArr = this._message.split("\n");
    this._formattedMessage = $A();
    var iconLines = Math.ceil(iconHeight / this._lineHeight);

    var maxLineWidth = this._maxWidth - this._padding * 2;
    if(this._maxWidth < 0){
      maxLineWidth = 65535;
    }

    var strMaxWidth = 0;
    var maxWidth;
    var messageNumChars = 0;
    var obj = this;
    var line = 0;
    mArr.forEach( function(str){
      var lineStr = str;
      while(lineStr.length > 0){
        if(line < iconLines){
          maxWidth = maxLineWidth - iconWidth;
        }else{
          maxWidth = maxLineWidth;
        }
        var numChars = obj._getLineChars(lineStr, maxWidth);
	var chars = lineStr.substr(0, numChars);
	var charsWidth = obj._bindedCanvas._2DContext.measureText(chars).width;
	if(line < iconLines){
	  charsWidth += iconWidth;
        }
	if(charsWidth > strMaxWidth){
	  strMaxWidth = charsWidth;
        }
	obj._formattedMessage.push(chars);
	lineStr = lineStr.substr(numChars);

	messageNumChars += numChars;
	line++;
      }
    });
    this._messageNumChars = messageNumChars;
    this._messageWidth = strMaxWidth;
    this._messageHeight = line * this._lineHeight;
    if(this._messageHeight < iconHeight){
      this._messageHeight = iconHeight;
    }
  },

  _getLineChars: function(str, maxWidth) {
    var c = this._bindedCanvas._2DContext;
    var met = c.measureText(str);
    var strlen = str.length;
    var strWidth = met.width;
    if(strWidth < maxWidth){
      return strlen;
    }

    var minLen = 0;
    var maxLen = strlen;
    var newLen = strlen >> 1;
    var newMet;
    while(minLen < maxLen - 1){
      newMet = c.measureText(str.substr(0,newLen));
      if(newMet.width < maxWidth){
        minLen = newLen;
        newLen = (newLen + maxLen) >> 1;
      }else{
        maxLen = newLen;
        newLen = (newLen + minLen) >> 1;
      }
    }
    if(newMet.width > maxWidth){
      return newLen - 1;
    }else{
      return newLen;
    }
  },

  getState: function() {
    return this._mode;
  },
});

'use strict'

import DH2DObject from './DH2DObject'
import Vector3 from './Vector3'

/**
 * MessageWindow class
 * @access public
 */
export default class MessageWindow extends DH2DObject {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    super()

    this._bindedObject = null
    this._bindedCnavas = null
    this._bindedCamera = null
    this._bindedBone = null

    this._time = 0.0
    this._speed = 3.0

    this._mode = 0
    this._x = 100
    this._y = 140

    this._message = ''
    this._formattedMessage = []
    this._lines = 0
    this._lineHeight = 15
    this._messageWidth = 0
    this._messageHeight = 0
    this._messageNumChars = 0
    this._maxWidth = -1
    this._offset = null
    this._screenOffset = null
    this._margin = 5
    this._padding = 5
    this._iconPadding = 5

    this._icon = null

    // balloon context
    this._borderColor = 'black'
    this._backgroundColor = 'white'
    this._globalAlpha = 1
    this._globalCompositeOperation = 'source-over'
    this._lineCap = 'butt'
    this._lineJoin = 'miter'
    this._lineWidth = 1
    this._miterLimit = 10
    this._balloonShadowBlur = 0
    this._balloonShadowColor = 'rgba(0, 0, 0, 0.0)'
    this._balloonShadowOffsetX = 0
    this._balloonShadowOffsetY = 0

    // text context
    this._textColor = 'black'
    this._font = '10px sans-serif'
    this._textAlign = 'start'
    this._textBaseline = 'top'
    this._textShadowBlur = 0
    this._textShadowColor = 'rgba(0, 0, 0, 0.0)'
    this._textShadowOffsetX = 0
    this._textShadowOffsetY = 0
  }

  animate(elapsedTime) {
    if(  this._mode === this.MODE_OPEN
      || this._mode === this.MODE_STRING
      || this._mode === this.MODE_CLOSE){
      this._time += this._speed * elapsedTime
    }
  }

  render() {
    const c = this._bindedCanvas._2DContext
    const padding = this._padding
    const iconPadding = this._iconPadding
    const vHeight = 10
    const heightMax = this._messageHeight + padding * 2
    const widthMax = this._messageWidth + padding * 2
    let height = 0
    let width = 0

    let targetX = this._x
    let targetY = this._y
    if(this._bindedObject && this._bindedCamera){
      const worldPos = new Vector3()

      if(this._bindedBone){ // FIXME
        const bone = this._bindedObject._model.boneHash[this._bindedBone]
        worldPos.x = bone.localMatrix.m41
        worldPos.y = bone.localMatrix.m42
        worldPos.z = bone.localMatrix.m43
      }else{
        worldPos.setValue(this._bindedObject._position)
      }

      if(this._offset){
        worldPos.add(worldPos, this._offset)
      }
      const windowPos = this._bindedCamera.getScreenPosition(worldPos)
      this._x = this._bindedCanvas._canvasWidth  * 0.5 * (1.0 + windowPos.x)
      this._y = this._bindedCanvas._canvasHeight * 0.5 * (1.0 - windowPos.y)

      if(this._screenOffset){
        this._x += this._screenOffset.x
        this._y += this._screenOffset.y
      }
      targetX = this._x
      targetY = this._y
      const left = this._x - widthMax * 0.5
      const right = this._x + widthMax * 0.5
      const top = this._y - heightMax
      const bottom = this._y

      if(widthMax > this._bindedCanvas._canvasWidth - this._margin * 2){
        // size over
        // FIXME
      }else if(left < this._margin){
        // too left
        this._x += this._margin - left
      }else if(right > this._bindedCanvas._canvasWidth - this._margin){
        // too right
        this._x -= right - this._bindedCanvas._canvasWidth + this._margin
      }

      if(heightMax > this._bindedCanvas._canvasHeight - this._margin * 2){
        // size over
        // FIXME
      }else if(top < this._margin){
        // too high
        this._y += this._margin - top
      }else if(bottom > this._bindedCanvas._canvasHeight - this._margin){
        // too low
        this._y -= bottom - this._bindedCanvas._canvasHeight + this._margin
      }
    }

    if(this._mode === this.MODE_OPEN){
      if(this._time >= 1.0){
        this._time = 0.0
        this._mode = this.MODE_STRING
        height = heightMax
        width = widthMax
      }else{
        height = heightMax * this._time
        width = widthMax * this._time
      }
      // FIXME
      this.drawBalloon(targetX, targetY + vHeight, this._x - width * 0.5, this._y - height, width, height)
    }else if(this._mode === this.MODE_STRING){
      let textLen = 0

      if(this._time >= 1.0){
        this._time = 0.0
        this._mode = this.MODE_STAY
        textLen = this._messageNumChars
      }else{
        textLen = Math.ceil(this._messageNumChars * this._time)
      }
      // FIXME
      this.drawBalloon(targetX, targetY + vHeight, this._x - widthMax * 0.5, this._y - heightMax, widthMax, heightMax)

      this._drawIconAndText(textLen)
    }else if(this._mode === this.MODE_STAY){
      // FIXME
      this.drawBalloon(targetX, targetY + vHeight, this._x - widthMax * 0.5, this._y - heightMax, widthMax, heightMax)

      this._drawIconAndText()
    }else if(this._mode === this.MODE_CLOSE){
      if(this._time >= 1.0){
        this._time = 0.0
        this._mode = this.MODE_READY
      }else{
        height = heightMax * (1.0 - this._time)
        width = widthMax * (1.0 - this._time)
        // FIXME
        this.drawBalloon(targetX, targetY + vHeight, this._x - width * 0.5, this._y - height, width, height)
      }
    }
  }

  _drawIconAndText(len) {
    const c = this._bindedCanvas._2DContext

    let drawLen = this._messageNumChars
    if(0 < len && len < drawLen){
      drawLen = len
    }

    const widthMax = this._messageWidth + this._padding * 2
    const heightMax = this._messageHeight + this._padding * 2
    const textLeft = this._x - widthMax * 0.5 + this._padding
    const textTop = this._y - heightMax + this._padding
    let iconLeft = 0
    let iconTop = 0
    let iconLines = 0
    let iconTextLeft = textLeft
    const iconPadding = this._iconPadding

    // drawIcon
    if(this._icon){
      iconTop  = textTop
      iconLeft = textLeft
      iconLines = Math.ceil((this._icon.height + iconPadding) / this._lineHeight)
      iconTextLeft += this._icon.width + iconPadding

      c.drawImage(this._icon, iconLeft, iconTop)
    }

    // drawText
    this.setupTextContext()
    let numChars = 0
    let line = 0
    let top = this._y - this._messageHeight - this._padding
    while(numChars < drawLen){
      let str = this._formattedMessage[line]
      let strLen = str.length
      if(strLen + numChars > drawLen){
        strLen = drawLen - numChars
        str = str.substr(0, strLen)
      }

      let left = textLeft
      if(line < iconLines){
        left = iconTextLeft
      }

      //c.strokeText(str, left, top)
      c.fillText(str, left, top)

      numChars += strLen
      top += this._lineHeight
      line++
    }
  }

  setupTextContext() {
    const c = this._bindedCanvas._2DContext

    c.font          = this._font
    c.fillStyle     = this._textColor
    c.textAlign     = this._textAlign
    c.textBaseline  = this._textBaseline

    c.shadowBlur    = this._textShadowBlur
    c.shadowColor   = this._textShadowColor
    c.shadowOffsetX = this._textShadowOffsetX
    c.shadowOffsetY = this._textShadowOffsetY
  }

  setupBalloonContext() {
    const c = this._bindedCanvas._2DContext

    c.fillStyle     = this._backgroundColor
    c.strokeStyle   = this._borderColor

    c.globalAlpha   = this._globalAlpha
    c.globalCompositeOperation
                    = this._globalCompositeOperation

    c.lineCap       = this._lineCap
    c.lineJoin      = this._lineJoin
    c.lineWidth     = this._lineWidth

    c.shadowBlur    = this._balloonShadowBlur
    c.shadowColor   = this._balloonShadowColor
    c.shadowOffsetX = this._balloonShadowOffsetX
    c.shadowOffsetY = this._balloonShadowOffsetY
  }

  drawBalloon(speakerX, speakerY, left, top, width, height) {
    const c = this._bindedCanvas._2DContext
    const vWidth = 5
    const bottom = top  + height
    const right  = left + width
    let vLeft  = speakerX - vWidth
    let vRight = speakerX + vWidth
    const p      = this._padding
    const w      = this._padding * 0.67

    const vLeftLimit  = p + this._margin
    const vRightLimit = this._bindedCanvas._canvasWidth - p - this._margin
    if(vLeft < vLeftLimit){
      vLeft = vLeftLimit
      vRight = vLeft + vWidth * 2
    }else if(vRight > vRightLimit){
      vRight = vRightLimit
      vLeft = vRight - vWidth * 2
    }

    // set balloon context
    this.setupBalloonContext()

    c.beginPath()

    c.moveTo(speakerX, speakerY)
    c.lineTo(vLeft, bottom)
    c.lineTo(left + p, bottom)
    c.bezierCurveTo(left + w, bottom,
                    left, bottom - w,
                    left, bottom - p)
    c.lineTo(left, top + p)
    c.bezierCurveTo(left, top + w,
                    left + w, top,
                    left + p, top)
    c.lineTo(right - p, top)
    c.bezierCurveTo(right - w, top,
                    right, top + w,
                    right, top + p)
    c.lineTo(right, bottom - p)
    c.bezierCurveTo(right, bottom - w,
                    right - w, bottom,
                    right - p, bottom)
    c.lineTo(vRight, bottom)
    c.lineTo(speakerX, speakerY)

    c.closePath()

    c.fill()
    c.stroke()
  }

  open() {
    this._updateMessageSize()
    this._mode = this.MODE_OPEN
    this._time = 0.0
  }

  close() {
    this._mode = this.MODE_CLOSE
    this._time = 0.0
  }

  getContext() {
    return this._bindedCanvas._2DContext
  }

/*
  setContext(context) {
    this._bindedContext = context
  }
*/

  getCanvas() {
    return this._bindedCanvas
  }

  setCanvas(canvas) {
    this._bindedCanvas = canvas
    this._updateMessageSize()
  }

  getIcon() {
    return this._icon
  }

  setIcon(icon) {
    this._icon = icon
    this._updateMessageSize()
  }

  getOffset() {
    return this._offset
  }

  setOffset(x, y, z) {
    if(x instanceof Vector3){
      this._offset = x
    }else{
      this._offset = new Vector3(x, y, z)
    }
  }

  getScreenOffset() {
    return this._screenOffset
  }

  setScreenOffset(x, y, z) {
    if(x instanceof Vector3){
      this._screenOffset = x
    }else{
      this._screenOffset = new Vector3(x, y, z)
    }
  }

  getMessage() {
    return this._message
  }

  setMessage(message) {
    this._message = message
    this._updateMessageSize()
  }

  getMaxWidth() {
    return this._maxWidth
  }

  setMaxWidth(maxWidth) {
    this._maxWidth = maxWidth
    this._updateMessageSize()
  }

  _updateMessageSize() {
    let iconWidth = 0
    let iconHeight = 0

    if(this._icon){
      iconWidth  = this._icon.width  + this._iconPadding
      iconHeight = this._icon.height + this._iconPadding
    }
    if(this._message == null){
      this._messageNumChars = 0
      this._messageWidth  = iconWidth
      this._messageHeight = iconHeight
      return
    }
    
    const mArr = this._message.split('\n')
    this._formattedMessage = []
    const iconLines = Math.ceil(iconHeight / this._lineHeight)

    let maxLineWidth = this._maxWidth - this._padding * 2
    if(this._maxWidth < 0){
      maxLineWidth = 65535
    }

    let strMaxWidth = 0
    let maxWidth = 0
    let messageNumChars = 0
    let line = 0
    const obj = this
    mArr.forEach( (str) => {
      let lineStr = str
      while(lineStr.length > 0){
        if(line < iconLines){
          maxWidth = maxLineWidth - iconWidth
        }else{
          maxWidth = maxLineWidth
        }
        const numChars = obj._getLineChars(lineStr, maxWidth)
        const chars = lineStr.substr(0, numChars)
        let charsWidth = obj._bindedCanvas._2DContext.measureText(chars).width
        if(line < iconLines){
          charsWidth += iconWidth
        }
        if(charsWidth > strMaxWidth){
          strMaxWidth = charsWidth
        }
        obj._formattedMessage.push(chars)
        lineStr = lineStr.substr(numChars)

        messageNumChars += numChars
        line++
      }
    })
    this._messageNumChars = messageNumChars
    this._messageWidth = strMaxWidth
    this._messageHeight = line * this._lineHeight
    if(this._messageHeight < iconHeight){
      this._messageHeight = iconHeight
    }
  }

  _getLineChars(str, maxWidth) {
    const c = this._bindedCanvas._2DContext
    const met = c.measureText(str)
    const strlen = str.length
    const strWidth = met.width
    if(strWidth < maxWidth){
      return strlen
    }

    let minLen = 0
    let maxLen = strlen
    let newLen = strlen >> 1
    let newMet = null
    while(minLen < maxLen - 1){
      newMet = c.measureText(str.substr(0, newLen))
      if(newMet.width < maxWidth){
        minLen = newLen
        newLen = (newLen + maxLen) >> 1
      }else{
        maxLen = newLen
        newLen = (newLen + minLen) >> 1
      }
    }
    if(newMet.width > maxWidth){
      return newLen - 1
    }

    return newLen
  }

  getState() {
    return this._mode
  }
}

MessageWindow.prototype.MODE_READY  = 0
MessageWindow.prototype.MODE_OPEN   = 1
MessageWindow.prototype.MODE_STRING = 2
MessageWindow.prototype.MODE_STAY   = 3
MessageWindow.prototype.MODE_CLOSE  = 4

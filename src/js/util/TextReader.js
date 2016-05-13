'use strict'

import TextRequest from './TextRequest'

/**
 * TextReader class
 * @access public
 */
export default class TextReader {
  /**
   * constructor
   * @access public
   * @constructor
   * @param {string} url -
   * @param {string} encoding -
   * @param {function} onload -
   * @param {function} onerror -
   */
  constructor(url, encoding = 'utf-8', onload = null, onerror = null) {
    this.url = ''
    this.position = 0
    this.eof = true
    this.data = null

    this.encoding = encoding
    this.onloadFunc = onload
    this.onerrorFunc = onerror

    if(encoding === 'sjis'){
      this.encoding = 'shift_jis'
    }

    const obj = this
    if(url instanceof File){
      this.url = url.name
      const reader = new FileReader()
      reader.onloadend = () => {
        obj._onload(reader.result)
      }
      reader.readAsText(url, this._encoding)
    }else{
      this.url = url

      TextRequest.getWithCharset(url, this.encoding)
        .then((value) => { obj._onload(value) })
        .catch((e) => { obj._onerror(e) })
    }
  }

  _onload(textData) {
    this.position = 0

    this.data = textData
    this.eof = false
    
    if(this.onloadFunc){
      this.onloadFunc(this)
    }
  }

  _onerror(error) {
    if(this.onerrorFunc){
      this.onerrorFunc(error)
    }
  }

  getText() {
    return this.data
  }

  // FIXME: implementation
  hasBytesAvailable() {
    return !this.eof
  }

  readData(length) {
    /*
    if(this.eof){
      return null
    }
    const dataStr = String.fromCharCode.apply(String, this.data.slice(this.position, this.position + length))

    this.position += length
    if(this.position >= this.data.length){
      this.eof = true
    }

    return dataStr
    */
  }

  readInteger(length, signed) {
    /*
    if(this.eof){
      return null
    }

    const value = this.parser.decodeInt(this.readData(length), length * 8, signed)

    return value
    */
  }
    
  readByte() {
    /*
    return this.readInteger(1, true)
    */
  }
      
  readUnsignedByte() {
    /*
    return this.readInteger(1, false)
    */
  }

  readShort() {
    /*
    return this.readInteger(2, true)
    */
  }

  readUnsignedShort() {
    //return this.readInteger(2, false)
  }

  readInt() {
    //return this.readInteger(4, true)
  }

  readUnsignedInt() {
    //return this.readInteger(4, false)
  }

  readFloat() {
    /*
    if(this.eof){
      return null
    }
    const floatSize = 4
    const value = this.parser.toFloat(this.readData(floatSize))

    return value
    */
  }

  readDouble() {
    /*
    if(this.eof){
      return null
    }
    const doubleSize = 8
    const value = this.parser.toDouble(this.readData(doubleSize))

    return value
    */
  }

  readString(length) {
    /*
    if(this.eof){
      return null
    }

    const escapeString = ''
    for(var i=0 i<length i++){
      const charCode = this.data[this.position + i]
      if(charCode == 0){
        break
      }
      else if(charCode < 16){
        escapeString += '%0' + charCode.toString(16)
      }else{
        escapeString += '%' + charCode.toString(16)
      }
    }
      
    this.position += length 
    if(this.position >= this.data.length)
      this.eof = true

    const value
    if(this.encoding == 'sjis'){
      value = UnescapeSJIS(escapeString)
    }else if(this.encoding == 'euc-jp'){
      value = UnescapeEUCJP(escapeString)
    }else if(this.encoding == 'jis-7'){
      value = UnescapeJIS7(escapeString)
    }else if(this.encoding == 'jis-8'){
      value = UnescapeJIS8(escapeString)
    }else if(this.encoding == 'unicode'){
      value = UnescapeUnicode(escapeString)
    }else if(this.encoding == 'utf7'){
      value = UnescapeUTF7(escapeString)
    }else if(this.encoding == 'utf-8'){
      value = UnescapeUTF8(escapeString)
    }else if(this.encoding == 'utf-16'){
      value = UnescapeUTF16LE(escapeString)
    }

    return value
    */
  }
}

TextReader.open = (url, encoding) => {
  return new Promise((resolve, reject) => {
    return new TextReader(url, encoding, resolve, reject)
  })
}


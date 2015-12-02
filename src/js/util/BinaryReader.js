'use strict'

import BinaryRequest from './BinaryRequest'
import BinaryParser from './BinaryParser'
import {UnescapeSJIS, UnescapeEUCJP, UnescapeJIS7, UnescapeJIS8, 
        UnescapeUnicode, UnescapeUTF7, UnescapeUTF8, UnescapeUTF16LE} from './ecl'

/**
 * BinaryReader class
 * @access public
 */
export default class BinaryReader {
  /**
   * constructor
   * @access public
   * @param {string} url -
   * @param {boolean} bigEndian -
   * @param {string} encoding -
   * @param {function} onload -
   * @constructor
   */
  constructor(url, bigEndian = false, encoding = '', onload = null, onerror = null) {
    this.url = ''
    this.position = 0
    this.eof = true
    this.parser = null
    this.data = null

    this.bigEndian = bigEndian
    this.encoding = encoding
    this.onloadFunc = onload
    this.onerrorFunc = onerror

    const obj = this
    if(url instanceof File){
      this.url = url.name
      const reader = new FileReader()
      reader.onloadend = () => {
        obj._onload(reader.result)
      }
      reader.readAsBinaryString(url)
    }else{
      this.url = url

      /*
      new BinaryRequest(url, {
        method: 'GET',
        onComplete(response) {
          obj._onload(response.responseText)
        },
      })
      */
      BinaryRequest.get(url)
        .then((value) => { obj._onload(value) })
        .catch((e) => { obj._onerror(e) })
    }
  }

  _onload(binData) {
    this.position = 0
    this.eof = true

    const binStream = []
    for(let i=0; i<binData.length; i++){
      binStream[i] = binData.charCodeAt(i) & 0xff
    }
    this.data = binStream

    this.eof = false
    
    this.parser = new BinaryParser(this.bigEndian, true)

    if(this.onloadFunc){
      this.onloadFunc(this)
    }
  }

  _onerror(error) {
    if(this.onerrorFunc){
      this.onerrorFunc(error)
    }
  }

  hasBytesAvailable(length = 1) {
    //return !this.eof
    return this.position + length <= this.data.length
  }

  readData(length) {
    if(this.eof){
      return null
    }
    // const dataStr = String.fromCharCode.apply(String, this.data.slice(this.position, this.position + length))
    const dataStr = String.fromCharCode(...(this.data.slice(this.position, this.position + length)))

    this.position += length
    if(this.position >= this.data.length){
      this.eof = true
    }

    return dataStr
  }

  readInteger(length, signed) {
    if(this.eof){
      return null
    }

    const value = this.parser.decodeInt(this.readData(length), length * 8, signed)

    return value
  }
    
  readByte() {
    return this.readInteger(1, true)
  }
      
  readUnsignedByte() {
    return this.readInteger(1, false)
  }

  readShort() {
    return this.readInteger(2, true)
  }

  readUnsignedShort() {
    return this.readInteger(2, false)
  }

  readInt() {
    return this.readInteger(4, true)
  }

  readUnsignedInt() {
    return this.readInteger(4, false)
  }

  readFloat() {
    if(this.eof){
      return null
    }
    const floatSize = 4
    const value = this.parser.toFloat(this.readData(floatSize))

    return value
  }

  readDouble() {
    if(this.eof){
      return null
    }
    const doubleSize = 8
    const value = this.parser.toDouble(this.readData(doubleSize))

    return value
  }

  readString(length) {
    if(this.eof){
      return null
    }

    let escapeString = ''
    for(let i=0; i<length; i++){
      const charCode = this.data[this.position + i]
      if(charCode === 0){
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

    let value = ''
    if(this.encoding === 'sjis'){
      value = UnescapeSJIS(escapeString)
    }else if(this.encoding === 'euc-jp'){
      value = UnescapeEUCJP(escapeString)
    }else if(this.encoding === 'jis-7'){
      value = UnescapeJIS7(escapeString)
    }else if(this.encoding === 'jis-8'){
      value = UnescapeJIS8(escapeString)
    }else if(this.encoding === 'unicode'){
      value = UnescapeUnicode(escapeString)
    }else if(this.encoding === 'utf7'){
      value = UnescapeUTF7(escapeString)
    }else if(this.encoding === 'utf-8'){
      value = UnescapeUTF8(escapeString)
    }else if(this.encoding === 'utf-16'){
      value = UnescapeUTF16LE(escapeString)
    }

    return value
  }

  skipBytes(length) {
    if(length <= 0){
      return null
    }

    this.position += length
    if(this.position >= this.data.length){
      this.eof = true
    }
  }
}
 
BinaryReader.open = (url, bigEndian, encoding) => {
  return new Promise((resolve, reject) => {
    return new BinaryReader(url, bigEndian, encoding, resolve, reject)
  })
}


'use strict'

import ModelReader from '../base/ModelReader'
import TextReader from '../util/TextReader'
import XModel from './XModel'
import XParser from './XParser'
import ModelBank from '../base/ModelBank'

/**
 * XReader class
 * @access public
 */
export default class XReader extends ModelReader {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    super()

    this._model = null
    this._parentDirName = null

    this._error = 0
    this._loaded = false
  }

  readModel(url) {
    if(url.substr(-2) !== '.x'){
      return false
    }

    const obj = this
    const onload = () => { obj.readModelProcess(url) }

    this._model = new XModel()
    this._textReader = new TextReader(url, 'sjis', onload)

    return this._model
  }

  readModelFromFile(file) {
    if(file.name.substr(-2) !== '.x'){
      console.log('filename_error: ' + file.name)
      return false
    }

    const obj = this
    const onload = () => { obj.readModelProcess(null) }

    this._model = new XModel()
    this._textReader = new TextReader(file, 'sjis', onload)

    return this._model
  }

  readModelProcess(url) {
    this.readModelSub(url)

    if(this._error){
      if(this._model.onerror){
        this._model.onerror()
      }
    }

    if(this._loaded){
      this._model.loaded = true
      if(this._model.onload){
        this._model.onload()
      }
    }

    if(this._error || this._loaded){
      if(this._model.onloadend){
        this._model.onloadend()
      }
    }
  }

  readModelSub(url){
    //this._parentDirName = (new String(url)).gsub(/\/[^\/]*$/, '/')
    this._parentDirName = url.replace(/\/[^\/]*$/, '/')
    if(url === this._parentDirName){
      this._parentDirName = './'
    }

    const parser = new XParser()
    parser.setParentDirName(this._parentDirName)
    parser.setModel(this._model)
    const model = parser.parse(this._textReader.getText())

    if(model === null){
      this._error = 1
    }else{
      this._loaded = true
    }
  }
}

ModelBank.addModelReader(XReader)

'use strict'

import ModelReader from '../base/ModelReader'
import ObjParser from './ObjParser'
import TextReader from '../util/TextReader'
import ModelBank from '../base/ModelBank'
import ObjModel from './ObjModel'

/**
 * ObjReader class
 * @access public
 */
export default class ObjReader extends ModelReader {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    super()
    this._model = null
    this._parentDirName = null
    this._parser = null

    this._error = 0
    this._loaded = false
  }

  readModel(url){
    if(url.substr(-4) !== '.obj'){
      return false
    }

    const obj = this
    const onload = () => { 
      obj.readModelPreProcess(url) 
      obj.readModelProcess(url) 
    }

    this._model = new ObjModel()
    this._textReader = new TextReader(url, 'sjis', onload)

    return this._model
  }

  readModelFromFile(file) {
    if(file.name.substr(-4) !== '.obj'){
      console.log('filename_error: ' + file.name)
      return false
    }

    const obj = this
    const onload = () => { 
      obj.readModelPreProcess(null)
      obj.readModelProcess(null)
    }

    this._model = new ObjModel()
    this._textReader = new TextReader(file, 'sjis', onload)

    return this._model
  }

  readModelPreProcess(url) {
    //this._parentDirName = (new String(url)).gsub(/\/[^\/]*$/, '/')
    this._parentDirName = url.replace(/\/[^\/]*$/, '/')
    if(url === this._parentDirName){
      this._parentDirName = './'
    }
    this._parser = new ObjParser()
    this._parser.setParentDirName(this._parentDirName)
    this._parser.setModel(this._model)
    this._parser.setData(this._textReader.getText())
    
    // FIXME: initialize parser
    this._parser._skinArray = this._model.skinArray
    this._parser._offset = 0
    this._parser._err = 0
  }

  readModelProcess(url) {
    this.readModelSub()

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
      this.readModelPostProcess()
      if(this._model.onloadend){
        this._model.onloadend()
      }
    }
  }

  readModelPostProcess() {
  }

  readModelSub(url){
    const result = this._parser.process()

    if(result){
      this._loaded = true
    }
    if(this._model === null){
      this._error = 1
    }
  }
}

ModelBank.addModelReader(ObjReader)


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

    /* @type {XModel} */
    this._model = null
    
    /* @type {string} */
    this._parentDirName = null

    /* @type {int} */
    this._error = 0

    /* @type {boolean} */
    this._loaded = false
  }

  /**
   * read X file data from given URL
   * @access public
   * @param {string} url - URL of X file
   * @returns {Promise} - resolved when loading model is completed
   */
  readModel(url) {
    if(!XReader.canRead(url))
      return false

    const obj = this
    const onload = () => { obj.readModelProcess(url) }

    this._model = new XModel()
    //this._textReader = new TextReader(url, 'sjis', onload)

    const promise = TextReader.open(url, 'sjis')
      .then((reader) => {
        this._textReader = reader
        return this.readModelProcess(url)
      })
      .catch((err) => {
        console.error(`file (${url}) open error: ${err}`)
      })

    //return this._model
    return promise
  }

  /**
   * read X file data from File object
   * @access public
   * @param {File} file - X file
   * @returns {boolean} - true: success, false: failure
   */
  readModelFromFile(file) {
    if(!XReader.canRead(file))
      return false
    
    //const obj = this
    //const onload = () => { obj.readModelProcess(null) }

    this._model = new XModel()
    //this._textReader = new TextReader(file, 'sjis', onload)

    const promise = TextReader.open(file, 'sjis')
      .then((reader) => {
        this._textReader = reader
        return this.readModelProcess(null)
      })
      .catch((err) => {
        console.error(`file (${file.name}) open error: ${err}`)
      })

    //return this._model
    return promise
  }

  readModelProcess(url) {
    const result = this.readModelSub(url)

    /*
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
    */
    if(!result){
      if(this._model.onerror){
        this._model.onerror()
      }
      return Promise.reject('read model error')
    }

    this._model.loaded = true
    if(this._model.onload){
      this._model.onload()
    }

    if(this._model.onloadend){
      this._model.onloadend()
    }
    return Promise.resolve(this._model)
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

    return model
  }
}

XReader.canRead = (file) => {
  let ext = ''
  if(file instanceof File){
    ext = file.name.substr(-2)
  }else if(typeof file === 'string' || file instanceof String){
    ext = file.substr(-2)
  }

  if(ext === '.x'){
    return true
  }

  return false
}

ModelBank.addModelReader(XReader)


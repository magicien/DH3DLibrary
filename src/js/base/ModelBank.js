'use strict'

/**
 * ModelBank class
 * @access public
 */
export class ModelBank {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    /** @type {Map} */
    //this._models = new Map()
    /** @type {Map} */
    this._loadingModels = new Map()
    /** @type {Map} */
    this._promises = new Map()
    /** @type {Map} */
    this._modelsOfContext = new Map()
    /** @type {Array<ModelReader>} */
    this._modelReaders = []
  }

  addModelReader(modelReader) {
    this._modelReaders.push(modelReader)
  }

  getFileID(file) {
    if(!(file instanceof File)){
      return ''
    }
    return `FILE:${file.name}_${file.size}_${file.lastModifiedDate}`
  }

  getModel(modelFile, options) {
    if(modelFile instanceof File){
      return this.getModelFromFile(modelFile, options)
    }

    let promise = this._promises.get(modelFile)
    if(promise){
      return promise.then((loadedModel) => {
        loadedModel.hashName = modelFile
        return loadedModel.clone()
      })
    }

    let reader = null
    this._modelReaders.some((readerClass) => {
      if(readerClass.canRead(modelFile)){
        reader = new readerClass()
        return true
      }
      return false
    })

    if(!reader){
      return Promise.reject(`can't read file: ${modelFile}`)
    }

    promise = reader.readModel(modelFile)
    this._promises.set(modelFile, promise)

    return promise.then((loadedModel) => {
      loadedModel.hashName = modelFile
      return loadedModel.clone()
    })
  }

  getModelFromFile(modelFile, options) {
    const id = this.getFileID(modelFile)
    const model = this._models.get(id)

    if(model){
      const m = model.clone()
      return Promise.resolve(m)
    }

    let promise = null
    this._modelReaders.some((readerClass) => {
      if(readerClass.canRead(modelFile)){
        const reader = new readerClass()
        promise = reader.readModelFromFile(modelFile)
        return true
      }
      return false
    })
    
    if(promise){
      return promise.then((loadedModel) => {
        // FIXME: don't use model.hashName
        loadedModel.hashName = id

        this._models.set(id, loadedModel)

        const newModel = loadedModel.clone()

        return newModel
      })
    }

    return Promise.reject(`can't read file: ${modelFile}`)
  }

  getModelForRenderer(modelFile, renderer) {
    let models = this._modelsOfContext.get(modelFile)
    if(!models){
      models = new Map()
      this._modelsOfContext.set(modelFile, models)
    }

    const gl = renderer.getContext()
    const model = models.get(gl)
    if(model){
      return Promise.resolve(model)
    }

    const promise = this.getModel(modelFile).then((orgModel) => {
      // vertex buffer
      orgModel.vertexBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, orgModel.vertexBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, renderer.getVertexData(orgModel), gl.DYNAMIC_DRAW)

      // index buffer
      orgModel.renderGroupArray.forEach( (group) => {
        group.indexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, group.indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, group.getIndexData(), gl.STATIC_DRAW)
      })

      orgModel.renderer = renderer
      models.set(gl, orgModel)

      return orgModel.clone()
    })

    return promise
  }
}

// for singleton
export default new ModelBank()


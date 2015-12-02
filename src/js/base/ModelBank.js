/*--------------------------------------------------------------------------------
 * DH3DLibrary ModelBank.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var ModelBank = Class.create({
  _models: $H(),
  _loadingModels: $H(),
  _modelsOfContext: $H(),
  _modelReaders: $A(),

  initialize: function() {
  },

  addModelReader: function(modelReader) {
    this._modelReaders.push(modelReader);
  },

  getFileID: function(file) {
    if(!(file instanceof File)){
      return "";
    }
    return "FILE:" + file.name + "_" + file.size + "_" + file.lastModifiedDate;
  },

  getModel: function(modelFile, options) {
    if(modelFile instanceof File){
      return this.getModelFromFile(modelFile, options);
    }
   
    var model = this._models.get(modelFile);
    if(model){
      var m = model.clone();
      if(options && options.onload) {
        m.onload = options.onload;
      }else{
        m.onload = undefined;
      }

      if(m.loaded){
        if(m.onload){
          m.onload();
        }
      }else{
        var arr = this._loadingModels.get(modelFile);
        arr.push(m);
      }
      return m;
    }

    this._modelReaders.find( function(readerClass){
      var reader = new readerClass();
      model = reader.readModel(modelFile);

      if(model)
        return true;
      
      return false;
    });

    if(model){
      model.onload = function(){ ModelBank.onloadModel(model); };

      model.hashName = modelFile;
      this._models.set(modelFile, model);

      var arr = $A();
      var m = model.clone();
      if(options && options.onload) {
        m.onload = options.onload;
      }else{
        m.onload = undefined;
      }
      arr.push(m);
      this._loadingModels.set(model.hashName, arr);

      return m;
    }
    return null;
  },

  getModelFromFile: function(modelFile, options) {
    var id = this.getFileID(modelFile);
    var model = this._models.get(id);
    if(model){
      var m = model.clone();
      if(options && options.onload) {
        m.onload = option.onload;
      }else{
        m.onload = undefined;
      }

      if(m.loaded){
        if(m.onload){
          m.onload();
        }
      }else{
        var arr = this._loadingModels.get(modelFile);
        arr.push(m);
      }
      return m;
    }

    this._modelReaders.find( function(readerClass){
      var reader = new readerClass();
      model = reader.readModelFromFile(modelFile);

      if(model)
        return true;

      return false;
    });
    
    if(model){
      model.onload = function(){ ModelBank.onloadModel(model); };

      model.hashName = id;
      this._models.set(id, model);

      var arr = $A();
      var m = model.clone();
      if(options && options.onload){
        m.onload = options.onload;
      }else{
        m.onload = undefined;
      }
      arr.push(m);
      this._loadingModels.set(model.hashName, arr);

      return m;
    }

    return null;
  },

  onloadModel: function(model) {
    model.loaded = true;

    var arr = this._loadingModels.get(model.hashName);
    if(arr){
      arr.each( function(m){
        m.loaded = true;
        if(m.onload){
          m.copy(model);
          m.onload();
        }
      });
    }
  },

  getModelForRenderer: function(modelFile, renderer) {
    var models = this._modelsOfContext.get(modelFile);
    if(!models){
      models = $H();
      this._modelsOfContext.set(modelFile, models);
    }
    var gl = renderer.getContext();
    var orgModel = models.get(gl);
    if(!orgModel){
      orgModel = this.getModel(modelFile);

      // vertex buffer
      orgModel.vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, orgModel.vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, renderer.getVertexData(orgModel), gl.DYNAMIC_DRAW);

      // index buffer
      orgModel.renderGroupArray.each( function(group){
        group.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, group.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, group.getIndexData(), gl.STATIC_DRAW);
      });

      orgModel.renderer = renderer;
      models.set(gl, orgModel);
    }
    var model = orgModel.clone();

    return model;
  },
});

ModelBank = new ModelBank();

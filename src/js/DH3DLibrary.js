/*--------------------------------------------------------------------------------
 * DH3DLibrary DH3DLibrary.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/

var DH3DLibrary = Class.create({
  Version: '0.1.0',
  REQUIRED_PROTOTYPE: '1.7',

  basePath: '',
  loadedFiles: $A(),

  initialize: function() {
    function convertVersionString(versionString) {
      var v = versionString.replace(/_.*|\./g, '');
      v = parseInt(v + '0'.times(4-v.length));
      return versionString.indexOf('_') > -1 ? v-1 : v;
    }

    if((typeof Prototype=='undefined') ||
       (typeof Element == 'undefined') ||
       (typeof Element.Methods=='undefined') ||
       (convertVersionString(Prototype.Version) <
        convertVersionString(this.REQUIRED_PROTOTYPE)))
       throw("DH3DLibrary requires the Prototype JavaScript framework >= " +
        DH3DLibrary.REQUIRED_PROTOTYPE);


    var js = /DH3DLibrary\.js(\?.*)?$/;
    this.basePath = $$('head script[src]').find(function(s) {
      return s.src.match(js);
    }).src.replace(js, '');
  },

  loaded: function(libraryName) {
    return (this.loadedFiles.indexOf(libraryName) >= 0);
  },

  require: function(libraryName, type) {
    if(this.loaded(libraryName)){
      return;
    }
    if(!type){
      type = "text/javascript";
    }

    try{
      // inserting via DOM fails in Safari 2.0, so brute force approach
      document.write('<script type="text/javascript" src="'+libraryName+'"><\/script>');
    } catch(e) {
      // for xhtml+xml served content, fall back to DOM methods
      var script = document.createElement('script');
      script.type = type;
      script.src = libraryName;
      document.getElementsByTagName('head')[0].appendChild(script);
    }
    this.loadedFiles.push(libraryName);
  },

  add: function(fileName, type) {
    if(!type){
      type = "text/javascript";
    }

    var script = document.createElement('script');
    script.type = type;
    script.src = fileName;
    document.getElementsByTagName('body')[0].appendChild(script);
  },

  load: function(package, fileList) {
    var basePath = this.basePath;
    fileList.split(",").each( function(js){
      DH3DLibrary.require(basePath + package + "/" + js + ".js");
    });
  },

  loadVertexShader: function(package, fileList) {
    var basePath = this.basePath;
    fileList.split(",").each( function(js){
      DH3DLibrary.require(basePath + package + "/" + js + ".js", "x-shader/x-vertex");
    });
  },

  loadFragmentShader: function(package, fileList) {
    var basePath = this.basePath;
    fileList.split(",").each( function(js){
      DH3DLibrary.require(basePath + package + "/" + js + ".js", "x-shader/x-fragment");
    });
  },

  loadPackage: function(package) {
    this.require(this.basePath + package + "/loader.js");
  }
});

var DH3DLibrary = new DH3DLibrary();

DH3DLibrary.loadPackage("base");
DH3DLibrary.loadPackage("util");
DH3DLibrary.loadPackage("mmd");
DH3DLibrary.loadPackage("xfile");
DH3DLibrary.loadPackage("obj");
DH3DLibrary.loadPackage("renderer/simple");


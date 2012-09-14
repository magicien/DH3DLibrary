/*--------------------------------------------------------------------------------
 * DH3DLibrary TextReader.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var TextReader = Class.create({
  url: '',
  encoding: 'utf-8',
  position: 0,
  eof: true,
  //parser: null,
  data: null,
  onloadFunc: null,

  initialize: function(url, encoding, onload) {
    this.encoding = encoding;
    this.onloadFunc = onload;

    if(encoding == "sjis"){
      this._encoding = "shift_jis";
    }

    var obj = this;
    if(url instanceof File){
      this.url = url.name;
      var reader = new FileReader();
      reader.onloadend = function(){
        obj._onload(reader.result);
      };
      reader.readAsText(url, this._encoding);
    }else{
      this.url = url;

      new TextRequest(url, this._encoding, {
        method: 'GET',
        onComplete: function(response) {
          obj._onload(response.responseText);
        },
      });
    }
  },

  _onload: function(textData) {
    this.position = 0;

    this.data = textData;
    this.eof = false;
    
    if(this.onloadFunc){
      this.onloadFunc();
    }
  },

  getText: function() {
    return this.data;
  },

  // FIXME: implementation
/*
  hasBytesAvailable: function() {
    return !this.eof;
  },

  readData: function(length) {
    if(this.eof){
      return null;
    }
    var dataStr = String.fromCharCode.apply(String, this.data.slice(this.position, this.position + length));

    this.position += length;
    if(this.position >= this.data.length){
      this.eof = true;
    }

    return dataStr;
  },

  readInteger: function(length, signed) {
    if(this.eof){
      return null;
    }

    var value = this.parser.decodeInt(this.readData(length), length * 8, signed);

    return value;
  },
    
  readByte: function() {
    return this.readInteger(1, true);
  },
      
  readUnsignedByte: function() {
    return this.readInteger(1, false);
  },

  readShort: function() {
    return this.readInteger(2, true);
  },

  readUnsignedShort: function() {
    return this.readInteger(2, false);
  },

  readInt: function() {
    return this.readInteger(4, true);
  },

  readUnsignedInt: function() {
    return this.readInteger(4, false);
  },

  readFloat: function() {
    if(this.eof){
      return null;
    }
    var floatSize = 4;
    var value = this.parser.toFloat(this.readData(floatSize));

    return value;
  },

  readDouble: function() {
    if(this.eof){
      return null;
    }
    var doubleSize = 8;
    var value = this.parser.toDouble(this.readData(doubleSize));

    return value;
  },

  readString: function(length) {
    if(this.eof){
      return null;
    }

    var escapeString = '';
    for(var i=0; i<length; i++){
      var charCode = this.data[this.position + i];
      if(charCode == 0){
        break;
      }
      else if(charCode < 16){
        escapeString += '%0' + charCode.toString(16);
      }else{
        escapeString += '%' + charCode.toString(16);
      }
    }
      
    this.position += length; 
    if(this.position >= this.data.length)
      this.eof = true;

    var value;
    if(this.encoding == 'sjis'){
      value = UnescapeSJIS(escapeString);
    }else if(this.encoding == 'euc-jp'){
      value = UnescapeEUCJP(escapeString);
    }else if(this.encoding == 'jis-7'){
      value = UnescapeJIS7(escapeString);
    }else if(this.encoding == 'jis-8'){
      value = UnescapeJIS8(escapeString);
    }else if(this.encoding == 'unicode'){
      value = UnescapeUnicode(escapeString);
    }else if(this.encoding == 'utf7'){
      value = UnescapeUTF7(escapeString);
    }else if(this.encoding == 'utf-8'){
      value = UnescapeUTF8(escapeString);
    }else if(this.encoding == 'utf-16'){
      value = UnescapeUTF16LE(escapeString);
    }

    return value;
  },
  */
});


  

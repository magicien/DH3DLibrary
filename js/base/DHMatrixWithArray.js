/*--------------------------------------------------------------------------------
 * DH3DLibrary DHMatrixWithArray.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var DHMatrixWithArray = Class.create({
  data: null,
  rows: 0,
  cols: 0,

  initialize: function(row, col) {
    this.rows = row;
    this.cols = col;

    if(this.rows > 0 && this.cols > 0){
      this.data = $A();
      for(var i=0; i<this.rows; i++){
        this.data[i] = $A();
        for(var j=0; j<this.cols; j++){
          this.data[i][j] = 0.0;
        }
      }
    }else{
      this.rows = 0;
      this.cols = 0;
      this.data = null;
    }
  },

  copy: function(src) {
    this.rows = src.rows;
    this.cols = src.cols;
    this.data = $A();
    for(var i=0; i<this.rows; i++){
      this.data[i] = $A();
      for(var j=0; j<this.cols; j++){
        this.data[i][j] = src.data[i][j];
      }
    }
  },

  identity: function() {
    if(this.rows != this.cols){
      return false;
    }

    for(var i=0; i<this.rows; i++){
      for(var j=0; j<this.cols; j++){
        if(i==j){
          this.data[i][j] = 1.0;
        }else{
          this.data[i][j] = 0.0;
        }
      }
    }
    return true;
  },

  inverse: function(src) {
    if(src.cols != src.rows){
      return false;
    }
    if(this.rows != src.cols || this.cols != src.cols){
      this.initialize(src.cols, src.cols);
    }
    this.identity();

    var srcCopy = new DHMatrixWithArray(src.rows, src.cols);
    srcCopy.copy(src);

    var srcData = srcCopy.data;
    var dstData = this.data;

    var w;
    for(var i=0; i<this.rows; i++){
      if(srcData[i][i] == 0){
        return false;
      }else if(srcData[i][i] != 1.0){
        w = 1.0 / srcData[i][i];
        for(var j=0; j<this.cols; j++){
          srcData[i][j] *= w;
          dstData[i][j] *= w;
        }
      }
      for(var j=0; j<this.cols; j++){
        if(i != j){
          w = srcData[j][i];
          for(var k=0; k<src.cols; k++){
            srcData[j][k] -= srcData[i][k] * w;
            dstData[j][k] -= dstData[i][k] * w;
          }
        }
      }
    }

    return true;
  },

  pseudoInverse: function(src) {
    var s = new DHMatrixWithArray(src.rows, src.cols);
    s.copy(src);

    if(s.rows == s.cols){
      this.inverseLUD(s);
      return true;
    }

    var t = new DHMatrixWithArray(s.cols, s.rows);
    t.transpose(s);
    if(s.rows > s.cols){
      var w = new DHMatrixWithArray(s.cols, s.cols);
      w.multiplyMatrix(t, s);
      w.inverseLUD(w);
      this.multiplyMatrix(w, t);
    }else{
      var w = new DHMatrixWithArray(s.rows, s.rows);
      w.multiplyMatrix(s, t);
      w.inverseLUD(w);
      this.multiplyMatrix(t, w);
    }
    return true;
  },

  inverseLUD: function(src) {
    if(src.rows != src.cols){
      return false;
    }
    var s = new DHMatrixWithArray(src.rows, src.rows);
    var p = $A();

    s.luDecomp(src, p);
    this.luInvert(s, p);

    return true;
  },

  luDecomp: function(src, ivec) {
    if(src.rows != src.cols){
      return 0;
    }
    var n = src.rows;
    var srcCopy = new DHMatrixWithArray(n, n);
    srcCopy.copy(src);

    this.initialize(n, n);
    this.copy(srcCopy);
    var dst = this.data;

    var weight = $A();
    for(var k=0; k<n; k++){
      ivec[k] = k;
      var u = 0;
      for(var j=0; j<n; j++){
        var t = Math.abs(dst[k][j]);
        if(t > u) {
          u = t;
        }
      }
      if(u == 0){
        return 0;
      }
      weight[k] = 1.0 / u;
    }
    var det = 1;
    var m = n;
    for(var k=0; k<n; k++){
      var u = -1;
      for(var i=k; i<n; i++){
        var ii = ivec[i];
        var t = Math.abs(dst[ii][k]) * weight[ii];
        if(t > u){
          u = t;
          m = i;
        }
      }
      var ik = ivec[m];
      if(m != k){
        ivec[m] = ivec[k];
        ivec[k] = ik;
        det = -det;
      }
      u = dst[ik][k];
      det *= u;
      if(u == 0){
        return 0;
      }
      for(var i=k+1; i<n; i++){
        var ii = ivec[i];
        dst[ii][k] /= u;
        var t = dst[ii][k];
        for(var j=k+1; j<n; j++){
          dst[ii][j] -= t * dst[ik][j];
        }
      }
    }
    return det;
  },

  luInvert: function(src, ivec) {
    if(src.rows != src.cols){
      return false;
    }
    var sdata = src.data;
    var n = src.rows;

    this.initialize(n, n);
    dst = this.data;

    var t;
    var ii;
    for(var k=0; k<n; k++){
      for(var i=0; i<n; i++){
        ii = ivec[i];
        if(k == ii){
          t = 1.0;
        }else{
          t = 0.0;
        }
        for(j = 0; j<i; j++){
          if(sdata[ii] == undefined){
            return false;
          }
          t -= sdata[ii][j] * dst[j][k];
        }
        dst[i][k] = t;
      }
      for(var i=n-1; i>=0; i--){
        t = dst[i][k];
        ii = ivec[i];
        for(var j=i+1; j<n; j++){
          t -= sdata[ii][j] * dst[j][k];
        }
        dst[i][k] = t / sdata[ii][i];
      }
    }
  },

  transpose: function(src) {
    var sdata = src.data;
    this.initialize(src.cols, src.rows);

    for(var i=0; i<this.rows; i++){
      for(var j=0; j<this.cols; j++){
        this.data[i][j] = sdata[j][i];
      }
    }
    return true;
  },

  add: function(src1, src2) {
    if(src1.rows != src2.rows || src1.cols != src2.cols){
      return false;
    }

    var data1 = src1.data;
    var data2 = src2.data;
    if(this.rows != src1.rows || this.cols != src1.cols){
      this.initialize(src1.rows, src1.cols);
    }

    var dstData = this.data;
    for(var i=0; i<this.rows; i++){
      for(var j=0; j<this.cols; j++){
        dstData[i][j] = data1[i][j] + data2[i][j];
      }
    }
  },

  sub: function(src1, src2) {
    if(src1.rows != src2.rows || src1.cols != src2.cols){
      return false;
    }
    var data1 = src1.data;
    var data2 = src2.data;
    if(this.rows != src1.rows || this.cols != src1.cols){
      this.initialize(src1.rows, src1.cols);
    }
    var dstData = this.data;

    for(var i=0; i<this.rows; i++){
      for(var j=0; j<this.cols; j++){
        dstData[i][j] = data1[i][j] - data2[i][j];
      }
    }
  },

  multiplyScalar: function(src1, val) {
    if(this.rows != src1.rows || this.cols != src1.cols){
      this.initialize(src1.rows, src1.cols);
    }
    for(var i=0; i<this.rows; i++){
      for(var j=0; j<this.cols; j++){
        this.data[i][j] = src1.data[i][j] * val;
      }
    }
  },

  multiplyMatrix: function(src1, src2) {
    if(src1.cols != src2.rows){
      return false;
    }

    data1 = src1.data;
    data2 = src2.data;
    this.initialize(src1.rows, src2.cols);

    for(var i=0; i<src1.rows; i++){
      for(var j=0; j<src2.cols; j++){
        this.data[i][j] = 0.0;
        for(var k=0; k<src1.cols; k++){
          this.data[i][j] += data1[i][k] * data2[k][j];
        }
      }
    }

    return true;
  }
});

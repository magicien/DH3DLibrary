/*--------------------------------------------------------------------------------
 * DH3DLibrary Logger.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var Logger = Class.create({
  LOG_LEVEL_INFO:    0,
  LOG_LEVEL_DEBUG:   1,
  LOG_LEVEL_WARNING: 3,
  LOG_LEVEL_ERROR:   5,

  _logLevel: 5,

  logMessages: null,

  initialize: function() {
    this.logMessages = $A();
  },

  setLogLevel: function(level) {
    this._logLevel = level;
  },

  info: function(message) {
    this.log(this.LOG_LEVEL_INFO, message);
  },

  debug: function(message) {
    this.log(this.LOG_LEVEL_DEBUG, message);
  },

  warning: function(message) {
    this.log(this.LOG_LEVEL_WARNING, message);
  },

  error: function(message) {
    this.log(this.LOG_LEVEL_ERROR, message);
  },

  log: function(level, message) {
    if(level >= this._logLevel){
      this.writeLog(level, message);
    }
  },

  writeLog: function(level, message) {
    this.logMessages.push(message);
  },
});

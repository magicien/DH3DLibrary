/*--------------------------------------------------------------------------------
 * DH3DLibrary BinaryRequest.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var BinaryRequest = Class.create(Ajax.Request, {
  initialize: function($super, url, options) {
    $super(url, options);
  },

  request: function() {
    this.transport.overrideMimeType('text/plain; charset=x-user-defined');
    Ajax.Request.prototype.request.apply(this, arguments);
  },
});

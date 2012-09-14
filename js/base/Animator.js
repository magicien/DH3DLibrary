/*--------------------------------------------------------------------------------
 * DH3DLibrary Animator.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var Animator = Class.create({

  initialize: function() {
  },

  animate: function(dhObject, elapsedTime) {
    var model = dhObject._model;

    this.updateMotion(dhObject, elapsedTime);
    
    model.rootBone.updateMatrixRecursive();

    model.ikArray.each( function(ik){
      ik.update();
    });
  },

  updateMotion: function(dhObject, elapsedTime) {
  },
});

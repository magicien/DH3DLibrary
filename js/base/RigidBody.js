/*--------------------------------------------------------------------------------
 * DH3DLibrary RigidBody.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var RigidBody = Class.create({
  // FIXME: field name
  name: '',
  boneIndex: 0,
  groupIndex: 0,
  groupTarget: 0,
  shapeType: 0,
  shapeW: 0.0,
  shapeH: 0.0,
  shapeD: 0.0,
  position: null,
  rotate: null,
  weight: 0.0,
  positionDim: 0.0,
  rotateDim: 0.0,
  recoil: 0.0,
  friction: 0.0,
  type: 0,

  initialize: function() {
  },
});


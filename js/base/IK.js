/*--------------------------------------------------------------------------------
 * DH3DLibrary IK.js v0.2.0
 * Copyright (c) 2010-2012 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var IK = Class.create({
  boneList: null,
  minAngleList: null,
  maxAngleList: null,
  targetBone: null,
  effectBone: null,
  iteration: 0,
  weight: 0.0,
  linkNo: null,

  _angle: null,
  _orgTargetPos: null,
  _rotAxis: null,
  _rotQuat: null,
  _inverseMat: null,
  _diff: null,
  _effectPos: null,
  _targetPos: null,

  initialize: function() {
    this._angle = new DHVector3();
    this._orgTargetPos = new DHVector3();
    this._rotAxis = new DHVector3();
    this._rotQuat = new DHVector4();
    this._inverseMat = new DHMatrix();
    this._diff = new DHVector3();
    this._effectPos = new DHVector3();
    this._targetPos = new DHVector3();
  },

  clone: function() {
    var newIK = Object.clone(this);

    newIK._angle        = Object.clone(this._angle);
    newIK._orgTargetPos = Object.clone(this._orgTargetPos);
    newIK._rotAxis      = Object.clone(this._rotAxis);
    newIK._rotQuat      = Object.clone(this._rotQuat);
    newIK._inverseMat   = new DHMatrix(this._inverseMat);
    newIK._diff         = Object.clone(this._diff);
    newIK._effectPos    = Object.clone(this._effectPos);
    newIK._targetPos    = Object.clone(this._targetPos);

    return newIK;
  },

  limitAngle: function(limitMinAngle, limitMaxAngle, quat) {
    var angle = this._angle;

    angle.quaternionToEuler(quat);

    if(angle.x < limitMinAngle.x)
      angle.x = limitMinAngle.x;
    else if(angle.x > limitMaxAngle.x)
      angle.x = limitMaxAngle.x;

    if(angle.y < limitMinAngle.y)
      angle.y = limitMinAngle.y;
    else if(angle.y > limitMaxAngle.y)
      angle.y = limitMaxAngle.y;

    if(angle.z < limitMinAngle.z)
      angle.z = limitMinAngle.z;
    else if(angle.z > limitMaxAngle.z)
      angle.z = limitMaxAngle.z;

    quat.eulerToQuaternion(angle);
  },

  update: function() {
    var zeroThreshold = 0.00000001;
    var targetMat = this.targetBone.localMatrix;
    var orgTargetPos = this._orgTargetPos;
    orgTargetPos.setValue(targetMat.m41, targetMat.m42, targetMat.m43);
    var rotAxis = this._rotAxis;
    var rotQuat = this._rotQuat;
    var inverseMat = this._inverseMat;
    var diff = this._diff;
    var effectPos = this._effectPos;
    var targetPos = this._targetPos;

    for(var i=this.boneList.length-1; i>=0; i--){
      this.boneList[i].updateMatrix();
    }
    this.effectBone.updateMatrix();

    // FIXME: 要再考
    for(var calcCount=0; calcCount<this.iteration; calcCount++){
      for(var linkIndex=0; linkIndex<this.boneList.length; linkIndex++){
        var linkedBone = this.boneList[linkIndex];
        var effectMat = this.effectBone.localMatrix;
        effectPos.setValue(effectMat.m41, effectMat.m42, effectMat.m43);

        inverseMat.inverseMatrix(linkedBone.localMatrix);
        effectPos.transform(effectPos, inverseMat);
        targetPos.transform(orgTargetPos, inverseMat);

        diff.sub(effectPos, targetPos);
        if(diff.length() < zeroThreshold){
          return;
        }

        effectPos.normalize();
        targetPos.normalize();

        var eDotT = effectPos.dot(targetPos);
        if(eDotT >  1.0) eDotT =  1.0;
        if(eDotT < -1.0) eDotT = -1.0;

        var rotAngle = Math.acos(eDotT);
        if(rotAngle > this.weight * (linkIndex + 1) * 4){
                rotAngle = this.weight * (linkIndex + 1) * 4;
        }

        rotAxis.cross(effectPos, targetPos);
        if(rotAxis.length() < zeroThreshold){
          break;
        }
        rotAxis.normalize();
        rotQuat.createAxis(rotAxis, rotAngle);
        rotQuat.normalize();
        if(this.minAngleList[linkIndex]){
          this.limitAngle(this.minAngleList[linkIndex], this.maxAngleList[linkIndex], rotQuat);
        }

        linkedBone.rotate.cross(linkedBone.rotate, rotQuat);
        linkedBone.rotate.normalize();

        for(var i=linkIndex; i>=0; i--){
          this.boneList[i].updateMatrix();
        }
        this.effectBone.updateMatrix();
      }
    }
  },
});


'use strict'

import Vector3 from './Vector3'
import Vector4 from './Vector4'
import Matrix from './Matrix'

import ObjectAssign from '../etc/ObjectAssign'

/**
 * IK class
 * @access public
 */
export default class IK {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    this.boneList = []
    this.minAngleList = []
    this.maxAngleList = []
    this.targetBone = null
    this.effectBone = null
    this.iteration = 0
    this.weight = 0.0
    this.linkNo = null

    this._angle = new Vector3()
    this._orgTargetPos = new Vector3()
    this._rotAxis = new Vector3()
    this._rotQuat = new Vector4()
    this._inverseMat = new Matrix()
    this._diff = new Vector3()
    this._effectPos = new Vector3()
    this._targetPos = new Vector3()
  }

  clone() {
    //const newIK = Object.assign(new IK(), this)
    const newIK = ObjectAssign(new IK(), this)

    newIK._angle        = this._angle.clone()
    newIK._orgTargetPos = this._orgTargetPos.clone()
    newIK._rotAxis      = this._rotAxis.clone()
    newIK._rotQuat      = this._rotQuat.clone()
    newIK._inverseMat   = this._inverseMat.clone()
    newIK._diff         = this._diff.clone()
    newIK._effectPos    = this._effectPos.clone()
    newIK._targetPos    = this._targetPos.clone()

    return newIK
  }

  limitAngle(limitMinAngle, limitMaxAngle, quat) {
    const angle = this._angle

    angle.quaternionToEuler(quat)

    if(angle.x < limitMinAngle.x)
      angle.x = limitMinAngle.x
    else if(angle.x > limitMaxAngle.x)
      angle.x = limitMaxAngle.x

    if(angle.y < limitMinAngle.y)
      angle.y = limitMinAngle.y
    else if(angle.y > limitMaxAngle.y)
      angle.y = limitMaxAngle.y

    if(angle.z < limitMinAngle.z)
      angle.z = limitMinAngle.z
    else if(angle.z > limitMaxAngle.z)
      angle.z = limitMaxAngle.z

    quat.eulerToQuaternion(angle)
  }

  update() {
    const zeroThreshold = 0.00000001
    const targetMat = this.targetBone.localMatrix
    const orgTargetPos = this._orgTargetPos
    orgTargetPos.setValue(targetMat.m41, targetMat.m42, targetMat.m43)
    const rotAxis = this._rotAxis
    const rotQuat = this._rotQuat
    const inverseMat = this._inverseMat
    const diff = this._diff
    const effectPos = this._effectPos
    const targetPos = this._targetPos

    for(let i=this.boneList.length-1; i>=0; i--){
      this.boneList[i].updateMatrix()
    }
    this.effectBone.updateMatrix()

    // FIXME: 要再考
    for(let calcCount=0; calcCount<this.iteration; calcCount++){
      for(let linkIndex=0; linkIndex<this.boneList.length; linkIndex++){
        const linkedBone = this.boneList[linkIndex]
        const effectMat = this.effectBone.localMatrix
        effectPos.setValue(effectMat.m41, effectMat.m42, effectMat.m43)

        inverseMat.inverseMatrix(linkedBone.localMatrix)
        effectPos.transform(effectPos, inverseMat)
        targetPos.transform(orgTargetPos, inverseMat)

        diff.sub(effectPos, targetPos)
        if(diff.length() < zeroThreshold){
          return
        }

        effectPos.normalize()
        targetPos.normalize()

        let eDotT = effectPos.dot(targetPos)
        if(eDotT >  1.0) eDotT =  1.0
        if(eDotT < -1.0) eDotT = -1.0

        let rotAngle = Math.acos(eDotT)
        if(rotAngle > this.weight * (linkIndex + 1) * 4){
          rotAngle = this.weight * (linkIndex + 1) * 4
        }

        rotAxis.cross(effectPos, targetPos)
        if(rotAxis.length() < zeroThreshold){
          break
        }
        rotAxis.normalize()
        rotQuat.createAxis(rotAxis, rotAngle)
        rotQuat.normalize()
        if(this.minAngleList[linkIndex]){
          this.limitAngle(this.minAngleList[linkIndex], this.maxAngleList[linkIndex], rotQuat)
        }

        linkedBone.rotate.cross(linkedBone.rotate, rotQuat)
        linkedBone.rotate.normalize()

        for(let i=linkIndex; i>=0; i--){
          this.boneList[i].updateMatrix()
        }
        this.effectBone.updateMatrix()
      }
    }
  }
}


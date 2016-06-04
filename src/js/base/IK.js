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

  /**
   * clone IK object
   * @access public
   * @returns {IK} - copied object
   */
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

  /**
   * limit angle of joint
   * @access public
   * @param {float} limitMinAngle - minimum angle of joint
   * @param {float} limitMaxAngle - maximum angle of joint
   * @param {Vector4} quat - Quaternion
   * @returns {void}
   */
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

  /**
   * update
   * @access public
   * @returns {void}
   */
  update() {
    const zeroThreshold = 0.0000001
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

        effectPos.normalize()
        targetPos.normalize()

        diff.sub(effectPos, targetPos)
        if(diff.length() < zeroThreshold){
          return
        }

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

        // limit angle
        
        rotQuat.createAxis(rotAxis, rotAngle)
        rotQuat.normalize()

        linkedBone.rotate.cross(linkedBone.rotate, rotQuat)
        linkedBone.rotate.normalize()

        for(let i=linkIndex; i>=0; i--){
          this.boneList[i].updateMatrix()
        }
        this.effectBone.updateMatrix()
      }
    }

    /* new IK update
    const zeroThreshold = 0.0000001
    const ikBone = this.targetBone
    const targetBone = this.effectBone
    const numBones = this.boneList.length

    const v = new Vector3()
    const v1 = new Vector3()
    const v2 = new Vector3()
    const diff = new Vector3()

    for(let i=this.boneList.length-1; i>=0; i--){
      this.boneList[i].updateMatrix()
    }
    this.effectBone.updateMatrix()

    for(let it=0; it<this.iteration; it++){
      for(let index=0; index<numBones; index++){
        const bone = this.boneList[index]
        const bonePosition = bone.localMatrix.getPosition()
        const targetPosition = targetBone.localMatrix.getPosition()
        const ikPosition = ikBone.localMatrix.getPosition()

        v1.sub(bonePosition, targetPosition)
        v2.sub(bonePosition, ikPosition)

        v1.normalize()
        v2.normalize()

        diff.sub(v1, v2)
        const x2 = diff.x * diff.x
        const y2 = diff.y * diff.y
        const z2 = diff.z * diff.z
        if(x2 + y2 + z2 < zeroThreshold){
          break
        }

        v.cross(v1, v2)
        v.inverseCross(v, bone.parentBone.localMatrix)
        v.normalize()

        if(bone.isKnee){
          if(v.x > 0){
            v.x = 1.0
          }else{
            v.x = -1.0
          }
          v.y = 0
          v.z = 0
        }

        let innerProduct = v1.dot(v2)
        if(innerProduct > 1){
          innerProduct = 1
        }else if(innerProduct < -1){
          innerProduct = -1
        }

        let ikRot = 0.5 * Math.acos(innerProduct)

        const maxRot = this.weight * (index + 1) * 2
        if(ikRot > maxRot){
          ikRot = maxRot
        }

        const ikSin = Math.sin(ikRot)
        const ikCos = Math.cos(ikRot)
        let quat = new Vector4()

        quat.x = v.x * ikSin
        quat.y = v.y * ikSin
        quat.z = v.z * ikSin
        quat.w = ikCos

        const orgQuat = new Vector4()
        orgQuat.rotationToQuaternion(bone.localMatrix.rotation)

        quat.cross(quat, orgQuat)
        
        const q = new Vector4()
        q.quaternionToRotation(quat)
        bone.localMatrix.rotation = q

        if(bone.isKnee){
          if(bone.localMatrix.eulerAngles.x < 0){
            quat.x = -quat.x
            q.quaternionToRotation(quat)
            bone.localMatrix.rotation = q
          }
        }

        for(let i=index; i>=0; i--){
          this.boneList[i].updateMatrix()
        }
        this.effectBone.updateMatrix()
      }
    }
    */
  }
}


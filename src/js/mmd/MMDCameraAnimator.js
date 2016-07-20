'use strict'

import Matrix from '../base/Matrix'
import Vector3 from '../base/Vector3'
import CameraAnimator from '../base/CameraAnimator'

/**
 * MMDCameraAnimator class
 * @access public
 */
export default class MMDCameraAnimator extends CameraAnimator {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    super()

    this._work_vec3_1 = new Vector3()
    this._work_vec3_2 = new Vector3()
    this._work_mat = new Matrix()

    // debug
    this.camera_dx = 0
    this.camera_dy = 0
    this.camera_dz = 0

    // debug
    this._rot_pattern = 0
    this._eye_pattern = 0
    this._rot_minusx = false
    this._rot_minusy = false
    this._rot_minusz = false
  }

  updateMotion(camera, elapsedTime) {
    const motion = camera._motion

    camera._animationTime += elapsedTime
    const frameNo = camera._animationTime * motion.defaultFPS
    if(frameNo > motion.frameLength){
      if(camera._loop){
        camera._animationTime -= motion.frameLength / motion.defaultFPS
      }else{
        camera._animationTime = motion.frameLength / motion.defaultFPS
        camera._animating = false
      }
    }
    if(camera._motionBlendStep){
      camera._motionBlendCount -= camera._motionBlendStep * motion.defaultFPS * elapsedTime
      if(camera._motionBlendCount < 0){
        camera._motionBlendCount = 0
        camera._motionBlendStep = 0
      }
    }
    camera._animationFrame = camera._animationTime * motion.defaultFPS

    // update camera parameters 
    let indexNo = camera._motionNumCache
    const motionArray = motion.motionArray
    const motionLen = motionArray.length
    const time = camera._animationFrame
    let key0 = 0
    let key1 = 0
    if(!indexNo)
      indexNo = 0

    if(motionLen <= indexNo)
      indexNo = motionLen - 1

    if(motionArray[indexNo].frameNo < time){
      for(; indexNo < motionLen; indexNo++){
        if(motionArray[indexNo].frameNo >= time)
          break
      }
      key0 = indexNo - 1
      key1 = indexNo
    }else{
      for(; indexNo >= 0; indexNo--){
        if(motionArray[indexNo].frameNo < time)
          break
      }
      key0 = indexNo
      key1 = indexNo + 1
    }
    if(key0 <= 0)         key0 = 0
    if(key1 >= motionLen) key1 = motionLen - 1

    camera._motionNumCache = key0

    const motion0 = motionArray[key0]
    const motion1 = motionArray[key1]
    const time0 = motion0.frameNo
    const time1 = motion1.frameNo

    let k = 0
    if(!camera._pos){
      camera._pos = new Vector3()
      camera._rot = new Vector3()
    }
    const pos = camera._pos
    const rot = camera._rot
    let distance = 0
    let angle = 0

    if(time0 !== time1){
      k = 127 * (time - time0) / (time1 - time0)
      /*
      pos.x = this.getBezierValue(motion1.interpolation[0],  motion1.interpolation[1],
                                  motion1.interpolation[2],  motion1.interpolation[3],
                                  motion0.position.x, motion1.position.x, k)
      pos.y = this.getBezierValue(motion1.interpolation[4],  motion1.interpolation[5],
                                  motion1.interpolation[6],  motion1.interpolation[7],
                                  motion0.position.y, motion1.position.y, k)
      pos.z = this.getBezierValue(motion1.interpolation[8],  motion1.interpolation[9],
                                  motion1.interpolation[10], motion1.interpolation[11],
                                  motion0.position.z, motion1.position.z, k)

      const r = this.getBezierValue(motion1.interpolation[12], motion1.interpolation[13],
                                  motion1.interpolation[14], motion1.interpolation[15],
                                  0, 1, k)
      //rot.slerp(motion0.rotate, motion1.rotate, r)
      rot.lerp(motion0.rotate, motion1.rotate, r)

      distance = this.getBezierValue(motion1.interpolation[16], motion1.interpolation[17],
                                     motion1.interpolation[18], motion1.interpolation[19],
                                     motion0.distance, motion1.distance, k)

      angle = this.getBezierValue(motion1.interpolation[20], motion1.interpolation[21],
                                  motion1.interpolation[22], motion1.interpolation[23],
                                  motion0.angle, motion1.angle, k)
      */
      pos.x = this.getBezierValue(motion1.interpolation[0],  motion1.interpolation[2],
                                  motion1.interpolation[1],  motion1.interpolation[3],
                                  motion0.position.x, motion1.position.x, k)
      pos.y = this.getBezierValue(motion1.interpolation[4],  motion1.interpolation[6],
                                  motion1.interpolation[5],  motion1.interpolation[7],
                                  motion0.position.y, motion1.position.y, k)
      pos.z = this.getBezierValue(motion1.interpolation[8],  motion1.interpolation[10],
                                  motion1.interpolation[9],  motion1.interpolation[11],
                                  motion0.position.z, motion1.position.z, k)

      const r = this.getBezierValue(motion1.interpolation[12], motion1.interpolation[14],
                                  motion1.interpolation[13], motion1.interpolation[15],
                                  0, 1, k)
      //rot.slerp(motion0.rotate, motion1.rotate, r)
      rot.lerp(motion0.rotate, motion1.rotate, r)

      distance = this.getBezierValue(motion1.interpolation[16], motion1.interpolation[18],
                                     motion1.interpolation[17], motion1.interpolation[19],
                                     motion0.distance, motion1.distance, k)

      angle = this.getBezierValue(motion1.interpolation[20], motion1.interpolation[22],
                                  motion1.interpolation[21], motion1.interpolation[23],
                                  motion0.angle, motion1.angle, k)

    }else{
      pos.setValue(motion0.position)
      rot.setValue(motion0.rotate)
      distance = motion0.distance
      angle = motion0.angle
    }

    if(camera._motionBlendCount){
      // FIXME: implementation
      //pos.lerp(pos, camera._pos, camera._motionBlendCount)
    }

    // projection matrix
    const near = 1.0
    const far = 10000.0
    const aspect = camera._aspect // FIXME
    if(motion0.perspective){
      camera.perspective(angle, aspect, near, far)
    }else{
      const height = 20.0 // FIXME
      const width = height * aspect
      const left = -0.5 * width
      const right = 0.5 * width
      const bottom = 0.5 * height
      const top = -0.5 * height
//alert('ortho: left=' + left + ', right=' + right + ', bottom=' + bottom + ', top=' + top
//        + ', near=' + near + ', far=' + far)
      camera.ortho(left, right, bottom, top, near, far)
    }

    // roll: z, yaw: y, pitch: x
    // view matrix
    //var cosX = Math.cos(rot.x) const sinX = Math.sin(rot.x)
    //var cosY = Math.cos(rot.y) const sinY = Math.sin(rot.y)
    //var cosZ = Math.cos(rot.z) const sinZ = Math.sin(rot.z)
    const eye = this._work_vec3_1
    const up = this._work_vec3_2
    const rotMat = this._work_mat
    eye.setValue(0, 0, -distance)
    up.setValue(0, 1, 0)

    rotMat.identity()
    rotMat.rotate(rotMat,  rot.z, 0, 0, 1)
    rotMat.rotate(rotMat, -rot.x, 1, 0, 0)
    rotMat.rotate(rotMat, -rot.y, 0, 1, 0)
    // ******** DEBUG **************
    if(this._rot_pattern){
      rotMat.identity()
      let rotX = 0
      let rotY = 0
      let rotZ = 0
      if(this._rot_minusx){
        rotX = -rot.x
      }else{
        rotX = rot.x
      }
      if(this._rot_minusy){
        rotY = -rot.y
      }else{
        rotY = rot.y
      }
      if(this._rot_minusz){
        rotZ = -rot.z
      }else{
        rotZ = rot.z
      }
      switch(this._rot_pattern) {
        case 1:
          rotMat.rotate(rotMat, rotX, 1, 0, 0)
          rotMat.rotate(rotMat, rotY, 0, 1, 0)
          rotMat.rotate(rotMat, rotZ, 0, 0, 1)
          break
        case 2:
          rotMat.rotate(rotMat, rotX, 1, 0, 0)
          rotMat.rotate(rotMat, rotZ, 0, 0, 1)
          rotMat.rotate(rotMat, rotY, 0, 1, 0)
          break
        case 3:
          rotMat.rotate(rotMat, rotY, 0, 1, 0)
          rotMat.rotate(rotMat, rotX, 1, 0, 0)
          rotMat.rotate(rotMat, rotZ, 0, 0, 1)
          break
        case 4:
          rotMat.rotate(rotMat, rotY, 0, 1, 0)
          rotMat.rotate(rotMat, rotZ, 0, 0, 1)
          rotMat.rotate(rotMat, rotX, 1, 0, 0)
          break
        case 5:
          rotMat.rotate(rotMat, rotZ, 0, 0, 1)
          rotMat.rotate(rotMat, rotX, 1, 0, 0)
          rotMat.rotate(rotMat, rotY, 0, 1, 0)
          break
        case 6:
          rotMat.rotate(rotMat, rotZ, 0, 0, 1)
          rotMat.rotate(rotMat, rotY, 0, 1, 0)
          rotMat.rotate(rotMat, rotX, 1, 0, 0)
          break
        default:
          break
      }
      switch(this._eye_pattern) {
        case 1:
          eye.setValue(distance, 0, 0)
          break
        case 2:
          eye.setValue(0, distance, 0)
          break
        case 3:
          eye.setValue(0, 0, distance)
          break
        case 4:
          eye.setValue(-distance, 0, 0)
          break
        case 5:
          eye.setValue(0, -distance, 0)
          break
        case 6:
        default:
          eye.setValue(0, 0, -distance)
          break
      }
    }

    eye.rotate(eye, rotMat)
    up.rotate(up, rotMat)

    // ******* DEBUG ************
    pos.x += this.camera_dx
    pos.y += this.camera_dy
    pos.z += this.camera_dz
    //up.x = 0
    //up.y = 1
    //up.z = 0
    //eye.x = pos.x
    //eye.y = pos.y
    //eye.z = pos.z - 15.0

    eye.x += pos.x
    eye.y += pos.y
    eye.z += pos.z

    camera.lookat(eye.x, eye.y, eye.z, pos.x, pos.y, pos.z, up.x, up.y, up.z)
  }

  getBezierValue(bx1, by1, bx2, by2, y0, y1, k) {
    let r = 0
    let val = 0
    let t0 = 0
    let t1 = 127 / 127.0
    let t = 63.5 / 127.0
    const nx1 = bx1 / 127.0
    const ny1 = by1 / 127.0
    const nx2 = bx2 / 127.0
    const ny2 = by2 / 127.0
    const nk = k / 127.0

    for(let i=0; i<8; i++){
      r = 1-t
      val = 3*t*r*(nx1*r + nx2*t) + t*t*t
      if(nk > val){
        t0 = t
      }else{
        t1 = t
      }
      t = (t0 + t1) / 2
    }
    r = 1-t
    val = (3*t*r*(ny1*r + ny2*t) + t*t*t)

    return (y0 + (y1 - y0) * val)
  }

}

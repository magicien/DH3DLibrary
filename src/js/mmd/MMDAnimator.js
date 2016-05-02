'use strict'

import Animator from '../base/Animator'

/**
 * MMDAnimator class
 * @access public
 */
export default class MMDAnimator extends Animator {

  updateMotion(dhObject, elapsedTime) {
    const model = dhObject._model
    const motion = dhObject._motion
    const time = elapsedTime * dhObject._animationSpeed

    if(dhObject._animating){
      dhObject._animationTime += time
      const frameNo = dhObject._animationTime * motion.defaultFPS
      if(frameNo > motion.frameLength){
        if(dhObject._loop){
          dhObject._animationTime -= motion.frameLength / motion.defaultFPS
        }else{
          dhObject._animationTime = motion.frameLength / motion.defaultFPS
          dhObject._animating = false
        }
      }
      if(dhObject._motionBlendStep){
        dhObject._motionBlendCount -= dhObject._motionBlendStep * motion.defaultFPS * time
        if(dhObject._motionBlendCount < 0){
          dhObject._motionBlendCount = 0
          dhObject._motionBlendStep = 0
        }
      }
    }
    dhObject._animationFrame = dhObject._animationTime * motion.defaultFPS

    const animator = this
    motion.motionArray.forEach( (boneMotion, key) => {
      const bone = model.boneHash.get(key)
      if(bone === null){
        return
      }

      animator.setBone(dhObject, boneMotion, bone)
    })

    if(model.faceArray.length > 0){
      model.faceArray[0].setFace(model)
      motion.faceMotionArray.forEach( (faceMotion, key) => {
        const face = model.faceHash.get(key)
        if(face === null)
          return

        animator.setFace(dhObject, faceMotion, face)
      })
    }
  }

  setBone(dhObject, motion, bone) {
    if(!dhObject._motionNumCache)
      dhObject._motionNumCache = new Map()

    let frameNo = dhObject._motionNumCache.get(bone.name)
    const time = dhObject._animationFrame
    const motionLen = motion.length
    let key0 = 0
    let key1 = 0

    if(!frameNo)
      frameNo = 0

    if(motionLen <= frameNo)
      frameNo = motionLen - 1

    if(motion[frameNo].frameNo < time){
      for(; frameNo < motionLen; frameNo++){
        if(motion[frameNo].frameNo >= time)
          break
      }
      key0 = frameNo - 1
      key1 = frameNo
    }else{
      for(; frameNo >= 0; frameNo--){
        if(motion[frameNo].frameNo < time)
          break
      }
      key0 = frameNo
      key1 = frameNo + 1
    }
    if(key0 <= 0)         key0 = 0
    if(key1 >= motionLen) key1 = motionLen - 1

    // cache motion number
    dhObject._motionNumCache.set(bone.name, key0)

    const motion0 = motion[key0]
    const motion1 = motion[key1]
    const time0 = motion0.frameNo
    const time1 = motion1.frameNo

    const pos = bone.position
    const rot = bone.rotate
    if(time0 !== time1){
      const k = 127 * (time - time0) / (time1 - time0)
      pos.x = this.getBezierValue(motion1.interpolation[0],  motion1.interpolation[4],
                                  motion1.interpolation[8],  motion1.interpolation[12],
                                  motion0.position.x, motion1.position.x, k)
      pos.y = this.getBezierValue(motion1.interpolation[1],  motion1.interpolation[5],
                                  motion1.interpolation[9],  motion1.interpolation[13],
                                  motion0.position.y, motion1.position.y, k)
      pos.z = this.getBezierValue(motion1.interpolation[2],  motion1.interpolation[6],
                                  motion1.interpolation[10], motion1.interpolation[14],
                                  motion0.position.z, motion1.position.z, k)
      const r = this.getBezierValue(motion1.interpolation[3],  motion1.interpolation[7],
                                  motion1.interpolation[11], motion1.interpolation[15],
                                  0, 1, k)
      // DEBUG
      //rot.slerp(motion0.rotate, motion1.rotate, r)
      rot.lerp(motion0.rotate, motion1.rotate, r)
      rot.normalize()
    }else{
      pos.setValue(motion0.position)
      rot.setValue(motion0.rotate)
    }

    if(dhObject._motionBlendCount){
      pos.lerp(pos, bone.blendPosition, dhObject._motionBlendCount)
      rot.lerp(rot, bone.blendRotation, dhObject._motionBlendCount)
    }
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

  setFace(dhObject, faceMotion, face) {
    if(!dhObject._faceMotionNumCache)
      dhObject._faceMotionNumCache = new Map()

    let frameNo = dhObject._faceMotionNumCache.get(face.name)
    let time = dhObject._animationFrame
    const motionLen = faceMotion.length
    let key0 = 0
    let key1 = 0

    if(!frameNo)
      frameNo = 0

    if(time > faceMotion[motionLen-1].frameNo){
      time = faceMotion[motionLen-1].frameNo
    }

    if(faceMotion[frameNo].frameNo < time){
      for(; frameNo < motionLen; frameNo++){
        if(faceMotion[frameNo].frameNo >= time)
          break
      }
      key0 = frameNo - 1
      key1 = frameNo
    }else{
      for(; frameNo >= 0; frameNo--){
        if(faceMotion[frameNo].frameNo < time)
          break
      }
      key0 = frameNo
      key1 = frameNo + 1
    }
    if(key0 < 0)          key0 = 0
    if(key1 >= motionLen) key1 = motionLen - 1

    const motion0 = faceMotion[key0]
    const motion1 = faceMotion[key1]
    const time0 = motion0.frameNo
    const time1 = motion1.frameNo

    let rate = 0
    if(time0 !== time1){
      const k = (time1 - time) / (time1 - time0)
      rate = motion0.factor * k + motion1.factor * (1.0 - k)
    }else{
      rate = motion0.factor
    }
    face.blendFace(dhObject._model, rate)
  }
}

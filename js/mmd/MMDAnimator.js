/*--------------------------------------------------------------------------------
 * DH3DLibrary MMDAnimator.js v0.1.0
 * Copyright (c) 2010-2011 DarkHorse
 *
 * DH3DLibrary is freely distributable under the terms of an MIT-style license.
 * For details, see the DH3DLibrary web site: http://darkhorse2.0spec.jp/dh3d/
 *
 *------------------------------------------------------------------------------*/
var MMDAnimator = Class.create(Animator, {
  initialize: function($super) {
    $super();
  },

  updateMotion: function(dhObject, elapsedTime) {
    var model = dhObject._model;
    var motion = dhObject._motion;

    if(dhObject._animating){
      dhObject._animationTime += elapsedTime;
      var frameNo = dhObject._animationTime * motion.defaultFPS;
      if(frameNo > motion.frameLength){
        if(dhObject._loop){
          dhObject._animationTime -= motion.frameLength / motion.defaultFPS;
        }else{
          dhObject._animationTime = motion.frameLength / motion.defaultFPS;
          dhObject._animating = false;
        }
      }
      if(dhObject._motionBlendStep){
        dhObject._motionBlendCount -= dhObject._motionBlendStep * motion.defaultFPS * elapsedTime;
        if(dhObject._motionBlendCount < 0){
          dhObject._motionBlendCount = 0;
          dhObject._motionBlendStep = 0;
        }
      }
    }
    dhObject._animationFrame = dhObject._animationTime * motion.defaultFPS;

    var animator = this;
    motion.motionArray.each( function(boneMotion){
      var bone = model.boneHash.get(boneMotion.key);
      if(bone == undefined){
        return;
      }

      animator.setBone(dhObject, boneMotion.value, bone);
    });

    if(model.faceArray.length > 0){
      model.faceArray[0].setFace(model);
      motion.faceMotionArray.each( function(faceMotion){
        var face = model.faceHash.get(faceMotion.key);
        if(face == undefined)
          return;

        animator.setFace(dhObject, faceMotion.value, face);
      });
    }
  },

  setBone: function(dhObject, motion, bone) {
    if(!dhObject._motionNumCache)
      dhObject._motionNumCache = $H();

    var frameNo = dhObject._motionNumCache.get(bone.name);
    var time = dhObject._animationFrame;
    var motionLen = motion.length;
    var key0;
    var key1;

    if(!frameNo)
      frameNo = 0;

    if(motionLen <= frameNo)
      frameNo = motionLen - 1;

    if(motion[frameNo].frameNo < time){
      for(; frameNo < motionLen; frameNo++){
        if(motion[frameNo].frameNo >= time)
          break;
      }
      key0 = frameNo - 1;
      key1 = frameNo;
    }else{
      for(; frameNo >= 0; frameNo--){
        if(motion[frameNo].frameNo < time)
          break;
      }
      key0 = frameNo;
      key1 = frameNo + 1;
    }
    if(key0 <= 0)         key0 = 0;
    if(key1 >= motionLen) key1 = motionLen - 1;

    // cache motion number
    dhObject._motionNumCache.set(bone.name, key0);

    var motion0 = motion[key0];
    var motion1 = motion[key1];
    var time0 = motion0.frameNo;
    var time1 = motion1.frameNo;

    var k;
    var pos = bone.position;
    var rot = bone.rotate;
    if(time0 != time1){
      k = 127 * (time - time0) / (time1 - time0);
      pos.x = this.getBezierValue(motion1.interpolation[0],  motion1.interpolation[4],
                                  motion1.interpolation[8],  motion1.interpolation[12],
                                  motion0.position.x, motion1.position.x, k);
      pos.y = this.getBezierValue(motion1.interpolation[1],  motion1.interpolation[5],
                                  motion1.interpolation[9],  motion1.interpolation[13],
                                  motion0.position.y, motion1.position.y, k);
      pos.z = this.getBezierValue(motion1.interpolation[2],  motion1.interpolation[6],
                                  motion1.interpolation[10], motion1.interpolation[14],
                                  motion0.position.z, motion1.position.z, k);
      var r = this.getBezierValue(motion1.interpolation[3],  motion1.interpolation[7],
                                  motion1.interpolation[11], motion1.interpolation[15],
                                  0, 1, k);
      rot.slerp(motion0.rotate, motion1.rotate, r);
      rot.normalize();
    }else{
      pos.setValue(motion0.position);
      rot.setValue(motion0.rotate);
    }

    if(dhObject._motionBlendCount){
      pos.lerp(pos, bone.blendPosition, dhObject._motionBlendCount);
      rot.lerp(rot, bone.blendRotation, dhObject._motionBlendCount);
    }
  },

  getBezierValue: function(bx1, by1, bx2, by2, y0, y1, k) {
    var r;
    var val;
    var t0 = 0;
    var t1 = 127 / 127.0;
    var t = 63.5 / 127.0;
    bx1 /= 127.0;
    by1 /= 127.0;
    bx2 /= 127.0;
    by2 /= 127.0;

    k = k / 127.0;

    for(var i=0; i<8; i++){
      r = 1-t;
      val = 3*t*r*(bx1*r + bx2*t) + t*t*t;
      if(k > val){
        t0 = t;
      }else{
        t1 = t;
      }
      t = (t0 + t1) / 2;
    }
    r = 1-t;
    val = (3*t*r*(by1*r + by2*t) + t*t*t);

    return (y0 + (y1 - y0) * val);
  },

  setFace: function(dhObject, faceMotion, face) {
    if(!dhObject._faceMotionNumCache)
      dhObject._faceMotionNumCache = $H();

    var frameNo = dhObject._faceMotionNumCache.get(face.name);
    var time = dhObject._animationFrame;
    var motionLen = faceMotion.length;
    var key0;
    var key1;

    if(!frameNo)
      frameNo = 0;

    if(time > faceMotion[motionLen-1].frameNo){
      time = faceMotion[motionLen-1].frameNo;
    }

    if(faceMotion[frameNo].frameNo < time){
      for(; frameNo < motionLen; frameNo++){
        if(faceMotion[frameNo].frameNo >= time)
          break;
      }
      key0 = frameNo - 1;
      key1 = frameNo;
    }else{
      for(; frameNo >= 0; frameNo--){
        if(faceMotion[frameNo].frameNo < time)
          break;
      }
      key0 = frameNo;
      key1 = frameNo + 1;
    }
    if(key0 < 0)          key0 = 0;
    if(key1 >= motionLen) key1 = motionLen - 1;

    var motion0 = faceMotion[key0];
    var motion1 = faceMotion[key1];
    var time0 = motion0.frameNo;
    var time1 = motion1.frameNo;

    var rate;
    if(time0 != time1){
      var k = (time1 - time) / (time1 - time0);
      rate = motion0.factor * k + motion1.factor * (1.0 - k);
    }else{
      rate = motion0.factor;
    }
    face.blendFace(dhObject._model, rate);
  },
});

'use strict'

import MotionReader from '../base/MotionReader'
import BinaryReader from '../util/BinaryReader'
import FaceMotion from './FaceMotion'
import KeyFrame from '../base/KeyFrame'
import CameraKeyFrame from '../base/CameraKeyFrame'
import LightKeyFrame from '../base/LightKeyFrame'
import ShadowKeyFrame from '../base/ShadowKeyFrame'
import VMDMotion from './VMDMotion'
import Vector3 from '../base/Vector3'
import Vector4 from '../base/Vector4'
import IKFrame from './IKFrame'
import MotionBank from '../base/MotionBank'

/**
 * VMDReader class
 * @access public
 */
export default class VMDReader extends MotionReader {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    super()
    this._binaryReader = null
    this._motion = null
    this._type = 'unknown'
  }

  readMotion(url) {
    if(!VMDReader.canRead(url))
      return false

    const obj = this
    const onload = () => { obj.readMotionProcess(url) }

    this._motion = new VMDMotion()

    const promise = new BinaryReader.open(url, false, 'sjis')
      .then((reader) => {
        this._binaryReader = reader
        return this.readMotionProcess(url)
      })
      .catch((err) => {
        console.error(`file (${url}) open error: ${err}`)
      })

    return promise
  }

  readMotionFromFile(file) {
    if(!VMDReader.canRead(file))
      return false

    this._motion = new VMDMotion()

    const promise = new BinaryReader.open(file, false, 'sjis')
      .then((reader) => {
        this._binaryReader = reader
        return this.readMotionProcess(null)
      })
      .catch((err) => {
        console.error(`file (${file.name}) open error: ${err}`)
      })

    return promise
  }

  readMotionProcess(url) {
    const result = this.readMotionSub(url)

    if(!result){
      if(this._motion.onerror){
        this._motion.onerror()
      }
      return Promise.reject('read motion error')
    }

    this._motion.loaded = true
    if(this._motion.onload){
      this._motion.onload()
    }

    if(this._motion.onloadend){
      this._motion.onloadend()
    }
    return Promise.resolve(this._motion)
  }

  readMotionSub(){
    this._motion.frameLength = 0

    this.readHeader()
    this.readFrames()
    this.readFace()

    if(!this._binaryReader.hasBytesAvailable())
      return this._motion

    this.readCamera()
    this.readLight()

    if(!this._binaryReader.hasBytesAvailable())
      return this._motion

    console.log(`data length: ${this._binaryReader.data.length}`)
    console.log(`position: ${this._binaryReader.position}`)
    this.readShadow()

    if(!this._binaryReader.hasBytesAvailable())
      return this._motion

    this.readVisibilityAndIK()

    return this._motion
  }

  readHeader() {
    const header = this._binaryReader.readString(30)
    if(header !== 'Vocaloid Motion Data 0002'){
      console.log(`VMD Format Error: ${header}`)
      //myAlert('VMD Format Error')
    }
    this._motion.name = this._binaryReader.readString(20)

    console.log(this._motion.name)
    if(this._motion.name === 'カメラ・照明'){
      console.log('camera/light motion')
      this._type = 'camera/light'
    }else{
      this._type = 'model'
    }
  }

  readFrames() {
    const frames = this._binaryReader.readUnsignedInt()
    const motionArray = this._motion.motionArray
    const bytesPerFrame = 111

    console.log(`bone frames: ${frames}`)

    if(frames === 0)
      return

    if(this._type !== 'model'){
      console.log('error: not model motion data has bone motion data')

      // skip data
      this._binaryReader.skipBytes(bytesPerFrame * frames)
      return
    }

    for(let i=0; i<frames; i++){
      const frame = new KeyFrame()
      const boneName = this._binaryReader.readString(15)

      frame.frameNo = this._binaryReader.readUnsignedInt()
      if(frame.frameNo > this._motion.frameLength)
        this._motion.frameLength = frame.frameNo

      frame.position = new Vector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
       -this._binaryReader.readFloat()
      )

      frame.rotate = new Vector4(
       -this._binaryReader.readFloat(),
       -this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat()
      )
      frame.rotate.normalize(frame.rotate)

      frame.interpolation = []
      for(let j=0; j<64; j++){
        frame.interpolation[j] = this._binaryReader.readUnsignedByte()
      }

      if(!motionArray.get(boneName)){
        motionArray.set(boneName, [])
      }
      motionArray.get(boneName).push(frame)
    }

    // sort each keyFrames in ascending order of frameNo
    motionArray.forEach( (keyFrames, key) => {
      keyFrames.sort( (a, b) => { return a.frameNo - b.frameNo } )
    })
  }

  readFace() {
    const frames = this._binaryReader.readUnsignedInt()
    const faceMotionArray = this._motion.faceMotionArray
    const bytesPerFrame = 23

    console.log(`face frames: ${frames}`)

    if(frames === 0)
      return

    if(this._type !== 'model'){
      console.log('error: not model motion data has face motion data')

      // skip data
      this._binaryReader.skipBytes(bytesPerFrame * frames)
      return
    }

    for(let i=0; i<frames; i++){
      const faceMotion = new FaceMotion()
      const faceName = this._binaryReader.readString(15)

      faceMotion.frameNo = this._binaryReader.readUnsignedInt()
      if(faceMotion.frameNo > this._motion.frameLength)
        this._motion.frameLength = faceMotion.frameNo

      faceMotion.factor = this._binaryReader.readFloat()

      if(!faceMotionArray.get(faceName)){
        faceMotionArray.set(faceName, [])
      }
      faceMotionArray.get(faceName).push(faceMotion)
    }

    // sort each keyFrames in ascending order of frameNo
    faceMotionArray.forEach( (keyFrames, key) => {
      keyFrames.sort( (a, b) => { return a.frameNo - b.frameNo } )
    })
  }

  readCamera() {
    const frames = this._binaryReader.readUnsignedInt()
    const motionArray = this._motion.motionArray
    const bytesPerFrame = 61

    console.log(`camera frame: ${frames}`)

    if(frames === 0)
      return

    if(this._type !== 'camera/light'){
      console.error('error: not camera motion has camera motion data')
      // skip data
      this._binaryReader.skipBytes(bytesPerFrame * frames)
      return
    }
    this._type = 'camera'

    for(let i=0; i<frames; i++){
      const frame = new CameraKeyFrame()

      frame.frameNo = this._binaryReader.readUnsignedInt()
      if(frame.frameNo > this._motion.frameLength)
        this._motion.frameLength = frame.frameNo

      frame.distance = this._binaryReader.readFloat()

      frame.position = new Vector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat()
      )

      frame.rotate = new Vector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat()
      )

      frame.interpolation = []
      for(let j=0; j<24; j++){
        frame.interpolation[j] = this._binaryReader.readUnsignedByte()
      }

      const angleDegree = this._binaryReader.readInt()
      //frame.angle = Math.PI * angleDegree / 180.0
      frame.angle = angleDegree

      const perspective = this._binaryReader.readByte()
      frame.perspective = (perspective === 0)

      motionArray.push(frame)
    }

    // sort motionArray in ascending order of frameNo
    motionArray.sort( (a, b) => {
      return a.frameNo - b.frameNo
    })
  }

  readLight() {
    const frames = this._binaryReader.readUnsignedInt()
    const motionArray = this._motion.motionArray
    const bytesPerFrame = 28

    console.log(`light frame: ${frames}`)

    if(frames === 0)
      return

    if(this._type !== 'camera/light'){
      console.error('error: not light motion has light motion data')

      // skip data
      this._binaryReader.skipBytes(bytesPerFrame * frames)
      return
    }
    this._type = 'light'
    
    for(let i=0; i<frames; i++){
      const frame = new LightKeyFrame()

      frame.frameNo = this._binaryReader.readUnsignedInt()
      if(frame.frameNo > this._motion.frameLength)
        this._motion.frameLength = frame.frameNo

      frame.color = new Vector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat()
      )

      frame.position = new Vector3(
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat(),
        this._binaryReader.readFloat()
      )

      motionArray.push(frame)
    }

    // sort motionArray in ascending order of frameNo
    motionArray.sort( (a, b) => {
      return a.frameNo - b.frameNo
    })
  }

  readShadow() {
    const frames = this._binaryReader.readUnsignedInt()
    const shadowArray = this._motion.shadowArray
    const bytesPerFrame = 9

    console.log(`shadow frame: ${frames}`)

    if(frames === 0)
      return

    if(this._type !== 'model'){
      console.error('error: not model motion has shadow data')

      // skip data
      this._binaryReader.skipBytes(bytesPerFrame * frames)
      return
    }

    if(!this._binaryReader.hasBytesAvailable(bytesPerFrame * frames)){
      console.error('it seems to be bad format...')

      this._binaryReader.skipBytes(9 * frames)
      return
    }

    for(let i=0; i<frames; i++){
      const frame = new ShadowKeyFrame()

      frame.frameNo = this._binaryReader.readUnsignedInt()
      frame.mode = this._binaryReader.readUnsignedByte()
      frame.distance = this._binaryReader.readFloat()

      shadowArray.push(frame)
    }

    this._motion.shadowArray.sort( (a, b) => {
      return a.frameNo - b.frameNo
    })
  }

  readVisibilityAndIK() {
    const frames = this._binaryReader.readUnsignedInt()
    const ikArray = this._motion.ikArray

    console.log(`ik frame: ${frames}`)

    if(frames === 0)
      return

    if(this._type !== 'model'){
      console.error('error: not model motion has ik data')
      return
    }

    if(!this._binaryReader.hasBytesAvailable(9 * frames)){
      console.error('it seems to be bad format...')

      this._binaryReader.skipBytes(9 * frames)
      return
    }

    for(let i=0; i<frames; i++){
      const frame = new IKFrame()

      frame.frameNo = this._binaryReader.readUnsignedInt()
      frame.visible = this._binaryReader.readUnsignedByte()
      frame.ikNum = this._binaryReader.readUnsignedInt()
      frame.ikData = []

      const ikNum = frame.ikNum

      for(let j=0; j<ikNum; j++){
        const boneName = this._binaryReader.readString(20)
        const ikOn = this._binaryReader.readUnsignedByte()

        frame.ikData.push(new Map(boneName, ikOn))
      }
      ikArray.push(frame)
    }

    ikArray.sort( (a, b) => {
      return a.frameNo - b.frameNo
    })
  }
}

VMDReader.canRead = (file) => {
  let ext = ''
  if(file instanceof File){
    ext = file.name.substr(-4)
  }else if(typeof file === 'string' || file instanceof String){
    ext = file.substr(-4)
  }

  if(ext === '.vmd'){
    return true
  }

  return false
}


MotionBank.addMotionReader(VMDReader)


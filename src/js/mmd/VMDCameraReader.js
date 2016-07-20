'use strict'

import CameraMotionReader from '../base/CameraMotionReader'
import BinaryReader from '../util/BinaryReader'
import CameraKeyFrame from '../base/CameraKeyFrame'
import VMDCameraMotion from './VMDCameraMotion'
import VMDMotion from './VMDMotion'
import CameraMotionBank from '../base/CameraMotionBank'
import Vector3 from '../base/Vector3'

/**
 * VMDCameraReader class
 * @access public
 */
export default class VMDCameraReader extends CameraMotionReader {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    super()
    this._binaryReader = null
    this._motion = null
    this._error = 0
  }

  readMotion(url) {
    if(!VMDCameraReader.canRead(url))
      return false

    const obj = this
    const onload = () => { obj.readMotionProcess(url) }

    this._motion = new VMDCameraMotion()

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
    if(!VMDCameraReader.canRead(url))
      return false

    const obj = this
    const onload = () => { obj.readMotionProcess(file) }

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
    }else{
      this._motion.loaded = true
      if(this._motion.onload){
        this._motion.onload()
      }
    }
    if(this._motion.onloadend){
      this._motion.onloadend()
    }
    return Promise.resolve(this._motion)
  }

  readMotionSub(){
    this._motion.frameLength = 0

    this.readHeader()
    this.readModelMotionFrames()
    this.readFrames()

    return this._motion
  }

  readHeader() {
    const header = this._binaryReader.readString(30)
    if(header !== 'Vocaloid Motion Data 0002'){
      console.warn(`VMD Format Error: ${header}`)
    }
    // 'カメラ・照明'
    this._motion.name = this._binaryReader.readString(20)
  }

  readModelMotionFrames() {
    const modelFrames = this._binaryReader.readUnsignedInt()
    // skip model motion
    const motionDataLength = modelFrames * 111
    this._binaryReader.skipBytes(motionDataLength)

    const faceFrames = this._binaryReader.readUnsignedInt()
    // skip face motion
    const faceDataLength = faceFrames * 23
    this._binaryReader.skipBytes(faceDataLength)
  }

  readFrames() {
    const frames = this._binaryReader.readUnsignedInt()
    var motionArray = this._motion.motionArray

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
      frame.angle = angleDegree

      const perspective = this._binaryReader.readByte()
      frame.perspective = (perspective === 0)

      motionArray.push(frame)
    }

    // sort motionArray in ascending order of frameNo
    this._motion.motionArray.sort( (a, b) => {
      return a.frameNo - b.frameNo
    })
  }
}

VMDCameraReader.canRead = (file) => {
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

CameraMotionBank.addMotionReader(VMDCameraReader)


'use strict'

/**
 * MotionBank class
 * @access public
 */
export class MotionBank {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    /** @type {Map} */
    this._motions = new Map()
    /** @type {Map} */
    this._loadingMotions = new Map()
    /** @type {Array<MotionReader>} */
    this._motionReaders = []
  }

  addMotionReader(motionReader) {
    this._motionReaders.push(motionReader)
  }

  getFileID(file) {
    if(!(file instanceof File)){
      return ''
    }
    //return 'FILE:' + file.name + '_' + file.size + '_' + file.lastModifiedDate
    return `FILE:${file.name}_${file.size}_${file.lastModifiedDate}`
  }

  getMotion(motionFile, options) {
    if(motionFile instanceof File){
      return this.getMotionFromFile(motionFile, options)
    }

    const motion = this._motions.get(motionFile)
    if(motion){
      const m = motion.clone()
      return Promise.resolve(m)
    }

    let promise = null
    this._motionReaders.some((readerClass) => {
      if(readerClass.canRead(motionFile)){
        const reader = new readerClass()
        promise = reader.readMotion(motionFile)
        return true
      }
      return false
    })

    if(promise){
      return promise.then((loadedMotion) => {
        this._motions.set(motionFile, loadedMotion)
        return loadedMotion.clone()
      })
    }

    return Promise.reject(`can't read file: ${motionFile}`)
  }

  getMotionFromFile(motionFile, options) {
    const id = this.getFileID(motionFile)
    const motion = this._motions.get(id)

    if(motion){
      const m = motion.clone()
      return Promise.resolve(m)
    }

    let promise = null
    this._motionReaders.some((readerClass) => {
      if(readerClass.canRead(motionFile)){
        const reader = new readerClass()
        promise = reader.readMotionFromFile(motionFile)
        return true
      }
      return false
    })

    if(promise){
      return promise.then((loadedMotion) => {
        this._motions.set(id, loadedMotion)
        return loadedMotion.clone()
      })
    }

    return Promise.reject(`can't read file: ${motionFile}`)
  }
}

// for singleton
export default new MotionBank()


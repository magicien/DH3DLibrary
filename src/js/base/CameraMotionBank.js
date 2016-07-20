'use strict'

/**
 * CameraMotionBank class
 * @access public
 */
export class CameraMotionBank {
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

    /** @type {Array} */
    this._motionReaders = []
  }

  /**
   * add motion reader to this bank
   * @access public
   * @param {MotionReader} motionReader - camera motion reader
   * @returns {void}
   */
  addMotionReader(motionReader) {
    this._motionReaders.push(motionReader)
  }

  /**
   * get file ID 
   * @access public
   * @param {File} file -
   * @returns {String} - file ID
   */
  getFileID(file) {
    if(!(file instanceof File)){
      return ''
    }
    //return 'FILE:' + file.name + '_' + file.size + '_' + file.lastModifiedDate
    return `FILE:${file.name}_${file.size}_${file.lastModifiedDate}`
  }

  /**
   * get camera motion from file
   * @access public
   * @param {String|File} motionFile - motion file URL or File object
   * @param {Object} options - onload: function()
   * @returns {File} -
   */
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

  /**
   * get camera motion from File object
   * @access public
   * @param {File} motionFile - File object of motion data
   * @param {Object} options - onload: function()
   * @returns {File} -
   */
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
export default new CameraMotionBank()


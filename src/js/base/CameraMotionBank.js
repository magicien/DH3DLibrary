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

    let motion = this._motions.get(motionFile)
    if(motion){
      const m = motion.clone()
      if(options && options.onload){
        m.onload = options.onload
      }else{
        m.onload = null
      }

      if(m.loaded){
        if(m.onload){
          m.onload()
        }
      }else{
        const arr = this._loadingMotions.get(motionFile)
        arr.push(m)
      }
      return m
    }

    //this._motionReaders.find( (readerClass) => {
    this._motionReaders.some( (readerClass) => {
      const reader = new readerClass()
      // FIXME: do not overwrite motion value
      motion = reader.readMotion(motionFile)

      if(motion)
        return true

      return false
    })

    if(motion){
      const obj = this
      motion.onload = () => { obj.onloadMotion(motion) }

      motion.hashName = motionFile
      this._motions.set(motionFile, motion)

      const arr = []
      const m = motion.clone()
      if(options && options.onload){
        m.onload = options.onload
      }else{
        m.onload = null
      }
      arr.push(m)
      this._loadingMotions.set(motion.hashName, arr)

      return m
    }
    return null
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
    let motion = this._motions.get(id)
    if(motion){
      const m = motion.clone()
      if(options && options.onload){
        m.onload = options.onload
      }else{
        m.onload = null
      }

      if(m.loaded){
        if(m.onload){
          m.onload()
        }
      }else{
        const arr = this._loadingMotions.get(motionFile)
        arr.push(m)
      }
      return m
    }

    //this._motionReaders.find( (readerClass) => {
    this._motionReaders.some( (readerClass) => {
      const reader = new readerClass()
      // FIXME: do not overwrite motion value
      motion = reader.readMotionFromFile(motionFile)

      if(motion)
        return true

      return false
    })

    if(motion){
      const obj = this
      motion.onload = () => { obj.onloadMotion(motion) }

      motion.hashName = id
      this._motions.set(id, motion)

      const arr = []
      const m = motion.clone()
      if(options && options.onload){
        m.onload = options.onload
      }else{
        m.onload = null
      }
      arr.push(m)
      this._loadingMotions.set(motion.hashName, arr)

      return m
    }

    return null
  }

  /**
   * 
   * @access public
   * @param {Motion} motion -
   * @returns {void}
   */
  onloadMotion(motion) {
    motion.loaded = true

    const arr = this._loadingMotions.get(motion.hashName)
    if(arr){
      arr.forEach( (m) => {
        m.loaded = true
        if(m.onload){
          m.copy(motion)
          m.onload()
        }
      })
    }
  }
}

export default new CameraMotionBank()


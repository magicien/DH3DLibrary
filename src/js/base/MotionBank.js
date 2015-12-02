'use strict'

/**
 * MotionBank class
 * @access public
 */
export default class MotionBank {
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

    /*
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
    */
    const motion = this._motions.get(motionFile)
    if(motion){
      const m = motion.clone()
      return Promise.resolve(m)
    }

    /*
    //this._motionReaders.find( (readerClass) => {
    this._motionReaders.some( (readerClass) => {
      const reader = new readerClass()
      // FIXME: do not overwrite motion value
      motion = reader.readMotion(motionFile)

      if(motion)
        return true

      return false
    })
    */
    let promise = null
    this._motionReaders.some((readerClass) => {
      if(readerClass.canRead(motionFile)){
        const reader = new readerClass()
        promise = reader.readMotion(motionFile)
        return true
      }
      return false
    })

    /*
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
    */
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

    /*
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
    */
    if(motion){
      const m = motion.clone()
      return Promise.resolve(m)
    }

    /*
    //this._motionReaders.find( (readerClass) => {
    this._motionReaders.some( (readerClass) => {
      const reader = new readerClass()
      // FIXME: do not overwrite motion value
      motion = reader.readMotionFromFile(motionFile)

      if(motion)
        return true

      return false
    })
    */
    let promise = null
    this._motionReaders.some((readerClass) => {
      if(readerClass.canRead(motionFile)){
        const reader = new readerClass()
        promise = reader.readMotionFromFile(motionFile)
        return true
      }
      return false
    })

    /*
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
    */
    if(promise){
      return promise.then((loadedMotion) => {
        this._motions.set(id, loadedMotion)
        return loadedMotion.clone()
      })
    }

    return Promise.reject(`can't read file: ${motionFile}`)
  }

/*
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
*/
}

// for singleton
export default new MotionBank()


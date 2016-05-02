'use strict'

/**
 * ModelReader class
 * @access public
 */
export default class ModelReader {
  /**
   * read model file from url
   * @access public
   * @param {String} url - url of model file
   * @returns {Model} - model
   */
  readModel(url) {
    return null
  }

  /**
   * read model file from File object
   * @access public
   * @param {String} file - File object
   * @returns {Model} - model
   */
  readModelFromFile(file) {
    return null
  }
}

ModelReader.canRead = (file) => {
  return false
}


'use strict'

import {AjaxRequest} from './AjaxRequest'

/**
 * TextRequest class
 * @access public
 */
export class TextRequest extends AjaxRequest {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    super()
    this.defaultOptions.mimeType = 'text/plain; charset=utf-8'
  }

  getWithCharset(url, charset, options={}) {
    options.mimeType = 'text/plain; charset=' + charset
    return this.get(url, options)
  }

  postWithCharset(url, charset, options={}) {
    options.mimeType = 'text/plain; charset=' + charset
    return this.post(url, options)
  }
}

export default new TextRequest()


'use strict'

/**
 * AjaxRequest class
 * @access public
 */
export class AjaxRequest {
  /**
   * constructor
   * @access public
   * @constructor
   */
  constructor() {
    this.defaultOptions = {
      method: 'POST',
      async: true,
      data: null,
      user: null,
      password: null,
      mimeType: null,
      requestHeader: {}
    }
  }

  get(url, options = {}) {
    options.method = 'GET'
    return this.request(url, options)
  }

  post(url, options = {}) {
    options.method = 'POST'
    return this.request(url, options)
  }

  request(url, options = {}) {
    let requestURL = url
    let method = options.method || this.defaultOptions.method
    const async = options.async || this.defaultOptions.async
    let data = this.defaultOptions.data
    const user = options.user || this.defaultOptions.user
    const password = options.password || this.defaultOptions.password
    const mimeType = options.mimeType || this.defaultOptions.mimeType
    const header = options.requestHeader || this.defaultOptions.requestHeader

    if(method !== 'POST' && method !== 'GET')
      method = 'POST'

    if(options.data){
      if(method === 'POST'){
        data = options.data
      }else{
        let separator = '?'
        options.data.forEach((key, value) => {
          requestURL += separator + key + '=' + value
          separator = '&'
        })
      }
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      if(mimeType){
        xhr.overrideMimeType(mimeType)
      }

      if(header){
        /*
        header.forEach((value, key) => {
          xhr.setRequestHeader(key, value)
        })
        */
        for(const key in header){
          if({}.hasOwnProperty.call(header, key)){ 
            xhr.setRequestHeader(key, header[key])
          }
        }
      }

      if(user) {
        xhr.open(method, url, async, user, password)
      }else{
        xhr.open(method, url, async)
      }

      xhr.onload = () => {
        if(xhr.readyState === 4 && xhr.status === 200){
          resolve(xhr.response)
        }else{
          reject(new Error(xhr.statusText))
        }
      }
      xhr.onerror = () => {
        reject(new Error(xhr.statusText))
      }
      xhr.send(data)
    })
  }
}

export default new AjaxRequest()


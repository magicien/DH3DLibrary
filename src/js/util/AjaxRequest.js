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
      isJSONP: false,
      requestHeader: {}
    }

    this.jsonpScripts = []
    this.jsonpCallbackPrefix = "jsonpCallback_"
  }

  get(url, options = {}) {
    options.method = 'GET'
    return this.request(url, options)
  }

  post(url, options = {}) {
    options.method = 'POST'
    return this.request(url, options)
  }

  jsonp(url, callbackParam = 'callback', options = {}) {
    let requestURL = url
    const script = document.createElement('script')
    const callbackFuncName = this._getNewFuncName(this.jsonpCallbackPrefix)

    if(!options.data){
      options.data = {}
    }
    options.data[callbackParam] = callbackFuncName

    const queryArray = []
    options.data.forEach((key, value) => {
      queryArray.push(encodeURI(key) + '=' + encodeURI(value))
    })
    requestURL += '?' + queryArray.join('&')

    const promise = new Promise((resolve, reject) => {
      window[callbackFuncName] = resolve
      script.addEventListener('error', reject)
    }).catch((error) => {
      delete window[callbackFuncName]
      document.head.removeChild(script)
      return Promise.reject(error)
    }).then((result) => {
      delete window[callbackFuncName]
      document.head.removeChild(script)
      return Promise.resolve(result)
    })

    script.src = requestURL
    document.head.appendChild(script)

    return promise
  }

  _getNewFuncName(prefix = '') {
    // ESLint prefers for(;;) more than while(true)
    for(;;){
      const funcName = prefix + Math.random().toString(16).slice(2)
      if(window.funcName === undefined){
        return funcName
      }
    }
  }

  request(url, options = {}) {
    let requestURL = url
    let method = (options.method === undefined ? this.defaultOptions.method : options.method)
    const async = (options.async === undefined ? this.defaultOptions.async : options.async)
    let data = this.defaultOptions.data
    const user = (options.user === undefined ? this.defaultOptions.user : options.user)
    const password = (options.password === undefined ? this.defaultOptions.password : options.password)
    const mimeType = (options.mimeType === undefined ? this.defaultOptions.mimeType : options.mimeType)
    const header = (options.requestHeader === undefined ? this.defaultOptions.requestHeader : options.requestHeader)
    const isJSONP = (options.isJSONP === undefined ? this.defaultOptions.isJSONP : options.isJSONP)

    if(method !== 'POST' && method !== 'GET'){
      method = 'POST'
    }

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
        for(const key in header){
          // Reflect is not yet implemented...
          //if(Reflect.apply({}.hasOwnProperty, header, [key])){
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


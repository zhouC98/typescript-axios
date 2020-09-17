import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/util'


// export default function xhr(config:AxiosRequestConfig):void {
//   const { data = null, url, method = 'get',headers } = config
//
//   const  request = new XMLHttpRequest()
//
//   request.open(method.toUpperCase(), url, true)
//   Object.keys(headers).forEach(name=>{
//     if(data === null && name.toLowerCase() === 'content-type'){
//       delete headers[name]
//     } else {
//       request.setRequestHeader(name, headers[name])
//     }
//   })
//
//
//   request.send(data)
// }

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    const request = new XMLHttpRequest()

    if (responseType) request.responseType = responseType
    // 接口响应时间
    if (timeout) request.timeout = timeout
    // 使用request.abort() 取消接口
    if (cancelToken) {
      cancelToken.promise.then(reason => {
        request.abort()
        reject(reason)
      }).catch(
        /* istanbul ignore next */
        () => {
          // do nothing
        })
    }
    if (withCredentials) request.withCredentials = true
    request.open(method.toUpperCase(), url!, true)

    if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
      const xsrfValue = cookie.read(xsrfCookieName)
      if (xsrfValue) headers[xsrfHeaderName!] = xsrfValue
    }

    if (onDownloadProgress) request.onprogress = onDownloadProgress

    if (onUploadProgress) request.upload.onprogress = onUploadProgress

    if (auth) headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)

    if (isFormData(data)) delete headers['Content-Type']


    // 处理非 200 状态码
    function handleResponse(response: AxiosResponse): void {
      if(!validateStatus || validateStatus(response.status)){
        resolve(response)
      } else {
        reject(createError(
          `Request failed with status code ${response.status}`,
          config,
          null,
          request,
          response
        ))
      }
    }

    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) return
      if (request.status === 0) return

      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType && responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }
    // 错误处理
    request.onerror = function handleError() {
      reject(createError(
        'Network Error',
        config,
        null,
        request
      ))
    }
    // 超时错误处理
    request.ontimeout = function handleTimeout() {
      reject(createError(
        `Timeout of ${config.timeout} ms exceeded`,
        config,
        'ECONNABORTED',
        request
      ))
    }

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)

  })
}

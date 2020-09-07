import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'


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

export default function xhr(config:AxiosRequestConfig):AxiosPromise {
  return new Promise((resolve,reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config

    const request = new XMLHttpRequest()

    if(responseType) request.responseType = responseType
    // 接口响应时间
    if(timeout) request.timeout = timeout

    request.open(method.toUpperCase(),url,true)
    // 处理非 200 状态码
    function handleResponse(response:AxiosResponse){
      if(response.status >= 200 && response.status < 300){
        resolve(response)
      } else {
        reject(new Error(`Request failed with status code ${response.status}`))
      }
    }

    request.onreadystatechange = function handleLoad() {
      if(request.readyState !== 4) return
      if(request.status === 0) return

      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType && responseType !== 'text' ? request.response : request.responseText
      const response:AxiosResponse = {
        data:responseData,
        status:request.status,
        statusText:request.statusText,
        headers:responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }
    // 错误处理
    request.onerror = function handleError(){
      reject(new Error('Network Error'))
    }
    // 超时错误处理
    request.ontimeout = function handleTimeout(){
      reject(new Error(`Timeout of ${timeout} ms exceeded`))
    }

    Object.keys(headers).forEach(name=>{
      if(data === null && name.toLowerCase() === 'content-type'){
        delete headers[name]
      }else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)

  })
}

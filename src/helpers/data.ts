import { isPlainArray, isPlainObject } from './util'

// 处理请求参数为json
export function transformRequest(data: any): any {
  if (isPlainObject(data)||isPlainArray(data)) return JSON.stringify(data)
  return data
}
// 处理请求返回数据 返回JSON字符串
export function transformResponse(data:any):any {
  if(typeof data === 'string'){
    try {
      data = JSON.parse(data)
    } catch (e) {
      console.log(e)
    }
  }
  return data
}

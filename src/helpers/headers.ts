import { isPlainArray, isPlainObject } from './util'

function normalizeHeaderName(headers:any,normalizeName:string):void {
  if(!headers) return
  Object.keys(headers).forEach(name=>{
    if(name!==normalizeName && name.toUpperCase() === normalizeName.toUpperCase()){
      headers[normalizeName] = headers[name]
      delete  headers[name]
    }
  })
}
// 设置请求头 默认json
export function processHeaders(headers:any,data:any):any {
  normalizeHeaderName(headers,'Content-Type')
  if(isPlainObject(data)||isPlainArray(data)){
    if(headers && !headers['Content-Type']){
      headers['Content-Type'] = 'application/json; charset=utf-8'
    }
  }
  return headers
}
// 返回headers为字符串 处理为对象
export function parseHeaders(headers: string):any {
  let parsed = Object.create(null)
  if(!headers) return parsed

  headers.split('\r\n').forEach(line=>{

    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()

    if(!key) return
    if(val) val = val.trim()

    parsed[key] = val
  })

  return parsed
}

import { isDate, isPlainObject } from './util'

function encode(val :string): string {
  // 将一个，两个，三个或四个表示字符的UTF-8编码的转义序列替换某些字符的每个实例来编码 URI
  // 对于字符 @、:、$、,、、[、]，我们是允许出现在 url 中的，不希望被 encode
  // 最终请求的 url 是 /base/get?foo=@:$+，注意，我们会把空格 转换成 +
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any) {
  if(!params) return url

  const parts: string[] = []

  Object.keys(params).forEach(key => {
    let val = params[key]
    // 处理参数值为null || undefined的情况
    if(val === null || typeof val === 'undefined') return

    let values: string[]

    if(Array.isArray(val)){
      values = val
      key += '[]'
    }else {
      values = [val]
    }

    values.forEach(val=>{
      // 处理值为时间，对象的情况
      if(isDate(val)){
        val = val.toISOString()
      }else if (isPlainObject(val)){
        val = JSON.stringify(val)
      }
      // 把参数跟值拼接好
      parts.push(`${encode(key)}=${encode((val))}`)
    })
  })

  let serializedParams = parts.join('&')

  if(serializedParams) {
    // 处理url后面带hash值的情况
    const markIndex = url.indexOf('#')
    if(markIndex !== -1) url = url.slice(0, markIndex)
    // 处理url后拼接好了参数的情况
    url += (url.indexOf('?') === -1 ? '?' : '&') +serializedParams
  }

  return url
}


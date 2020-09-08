const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// export function isObject(val: any): val is Object {
//   return val!==null && typeof val === 'object'
// }

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function isPlainArray(val: any): val is Array<any> {
  return toString.call(val) === '[object Array]'
}
// 混合对象实现
// extend 方法的实现用到了交叉类型，并且用到了类型断言。extend 的最终目的是把 from 里的属性都扩展到 to 中，包括原型上的属性
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    (to as T & U)[key] = from[key] as any
  }

  return to as T & U
}
// 深拷贝
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  objs.forEach(obj => {
    if(obj){
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if(isPlainObject(val)){
          if(isPlainObject(result[key])){
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge({}, val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })

  return result
}

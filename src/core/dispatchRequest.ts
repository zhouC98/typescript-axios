
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then(res => {

    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {

  config.url = transformUrl(config)
  // config.headers = transformHeaders(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  // 这里 config.method 类型断言，可以保证运行时有值
  config.headers = flattenHeaders(config.headers, config.method!)
}
// 处理url
function transformUrl(config: AxiosRequestConfig): string {
  const { url , params } = config
  return buildURL(url!, params)
}
// 处理接口返回值
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config:AxiosRequestConfig):void {
  if(config.cancelToken) config.cancelToken.throwIfRequested()
}

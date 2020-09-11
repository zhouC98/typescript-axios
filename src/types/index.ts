export type Method = 'get' | 'GET'
  | 'delete' | 'Delete'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'

export interface AxiosTransformer {
  (data: any, headers?: any): any
}

// axios 请求接口
export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken
  withCredentials?: boolean
  xsrfCookieName?: string
  xsrfHeaderName?: string
  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void
  auth?: AxiosBasicCredentials
  validateStatus?: (status: number) => boolean
  paramsSerializer?: (params: any) => string
  baseURL?: string

  [propName: string]: any
}

export interface AxiosBasicCredentials {
  username: string
  password: string
}

// CancelToken 是实例类型的接口定义
export interface CancelToken {
  promise: Promise<string>
  reason?: Cancel

  throwIfRequested(): void
}

// Canceler 是取消方法的接口定义
export interface Canceler {
  (message?: string): void
}

// CancelExecutor 是 CancelToken 类构造函数参数的接口定义
export interface CancelExecutor {
  (cancel: Canceler): void
}

// CancelTokenSource 作为 CancelToken 类静态方法 source 函数的返回值类型，
export interface CancelTokenSource {
  cancel: Canceler
  token: CancelToken
}

// CancelTokenStatic 则作为 CancelToken 类的类类型。
export interface CancelTokenStatic {
  new(executor: CancelExecutor): CancelToken

  source(): CancelTokenSource
}

// Cancel 是实例类型的接口定义
export interface Cancel {
  message?: string
}

// CancelStatic 是类类型的接口定义
export interface CancelStatic {
  new(message?: string): Cancel
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance

  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean

  all<T>(promise: Array<T | Promise<T>>): Promise<T[]>

  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R

  Axios: AxiosClassStatic
}

// axios 响应接口
export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

// axios promise 泛型
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {

}

// axios 错误接口
export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse
  isAxiosError: boolean
}

// axios接口
export interface Axios {
  defaults: AxiosRequestConfig

  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>,
    response: AxiosInterceptorManager<AxiosResponse>
  }

  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  getUri(config?:AxiosRequestConfig): string
}

// export interface AxiosInstance extends Axios {
//   (config: AxiosRequestConfig): AxiosPromise
// }

// axios 函数重载
export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosStatic extends AxiosInstance {

  (config?: AxiosRequestConfig): AxiosInstance
}

export interface ResolvedFn<T = any> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface AxiosInterceptorManager<T> {
  // 返回值的 number 是这个 interceptor 的 ID 用于 eject 的时候删除此 interceptor
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

  eject(id: number): void
}

export interface AxiosClassStatic {
  new(config: AxiosRequestConfig): Axios
}



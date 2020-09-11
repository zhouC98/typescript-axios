import { Canceler, CancelExecutor, CancelTokenSource } from '../types'
import Cancel from './Cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

/**
 * ##异步分离的设计方案
 * 利用 Promise 实现异步分离，也就是在 cancelToken 中保存一个 pending 状态的 Promise 对象，然后当我们执行 cancel 方法的时候，
 * 能够访问到这个 Promise 对象，把它从 pending 状态变成 resolved 状态，这样我们就可以在 then 函数中去实现取消请求的逻辑，类似如下的代码：
 * if (cancelToken) {
 *  cancelToken.promise
 *   .then(reason => {
 *     request.abort()
 *     reject(reason)
 *   })
 * }
 */

/**
 * 在 CancelToken 构造函数内部，实例化一个 pending 状态的 Promise 对象，然后用一个 resolvePromise 变量指向 resolve 函数。
 * 接着执行 executor 函数，传入一个 cancel 函数，在 cancel 函数内部，会调用 resolvePromise 把 Promise 对象从 pending 状态变为 resolved 状态。
 */

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })

    executor(message => {
      if (this.reason) return
      this.reason = new Cancel(message)
      resolvePromise(this.reason)
    })
  }

  static source(): { cancel: Canceler; token: CancelToken } {
    let cancel!: Canceler

    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }

  throwIfRequested(): void{
    if(this.reason) throw this.reason
  }
}

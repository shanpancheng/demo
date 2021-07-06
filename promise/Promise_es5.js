/**
 * 自定义promise函数模块, IIFE
 */
(function (params) {

  const PENDING = 'pending';
  const RESOLVED = 'resolved';
  const REJECTED = 'rejected';

  /**
   * Promise 构造函数
   * @param {*} executor 执行器函数
   */
  function Promise(executor) {
    const context = this;
    this.status = PENDING; // 保存状态
    this.data = undefined; // 存储结果数据的属性
    this.callbacks = []; // 每个元素的结构：{ onResolved() {}, onRejected() {} }

    function resolve(value) {
      if(context.status !== PENDING) {
        // 状态只能修改一次
        return;
      }
      // 将状态改为resolved
      context.status = RESOLVED;
      // 保存value数据
      context.data = value;

      // 如果有待执行的callback函数，立即异步执行回调函数onResolved
      if(context.callbacks.length) {
        setTimeout(() => { // 放入队列中执行所有成功的回调
          context.callbacks.forEach(callbacksObj => {
            callbacksObj.onResolved(value);
          });
        });
      }
    }

    function reject(reason) {
      if(context.status !== PENDING) {
        return;
      }
      // 将状态改为rejected
      context.status = REJECTED;
      // 保存value数据
      context.data = reason;

      // 如果有待执行的callback函数，立即异步执行回调函数onRejected
      if(context.callbacks.length) {
        setTimeout(() => { // 放入队列中执行所有失败的回调
          context.callbacks.forEach(callbacksObj => {
            callbacksObj.onRejected(reason);
          });
        });
      }
    }

    try {
      // 立即同步执行executor执行器函数
      executor(resolve, reject);
    } catch (error) {
      // 如果执行器抛出异常，将状态修改为rejected
      reject(error);
    }
    
  }

  /**
   * Promise原型对象的then, 指定成功和失败的回调函数，返回新的promise对象 回调函数异步执行
   * @param {*} onResolved 
   * @param {*} onRejected 
   */
  Promise.prototype.then = function(onResolved, onRejected) {
    const self = this;

    // 向后传递成功的value
    onResolved = typeof onResolved === 'function' ? onResolved : value => value;
    // 指定默认的异常回调，实现异常穿透, 向后传递失败的reason
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason};
    // 返回一个新的Promise对象
    return new Promise((resolve, reject) => {

      /**
       * 调用指定的回调函数，根据执行结果，改变return的promise状态
       * @param {*} callback 
       */
      function handle(callback) {
        /**
         * 1、如果抛出异常，return的promise就会失败，reason就是error
         * 2、如果回调函数返回的不是Promise，return 的Promise就会成功，value就是返回的值
         * 3、如果回调函数返回的是Promise，return 的Promise结果就是promise的结果
         */
        try {
          const result = callback(self.data);
          if(result instanceof Promise) {
            // 3、如果回调函数返回的是Promise，return
            // result.then(
            //   value => resolve(value),
            //   reason => reject(reason),
            // );
            result.then(resolve, reject)

          } else {
            // 2、如果回调函数返回的不是Promise，return
            resolve(result)
          }
        } catch (error) {
          // 1、如果抛出异常，return的promise就会失败，reason就是error
          reject(error);
        }
      }

      if(self.status === PENDING) {
        // 假设当前状态还是pending 将回调函数保存起来
        self.callbacks.push({
          onResolved() {
            handle(onResolved);
          },
          onRejected() {
            handle(onRejected);
          },
        });
      } else if(self.status === RESOLVED) {
        setTimeout(() => {
          handle(onResolved);
        });
      } else {
        // rejected
        setTimeout(() => {
          handle(onRejected);
        });
      }
    })
    
  }

  /**
   * Promise原型对象的catch, 指定失败的回调函数，返回新的promise对象
   * @param {*} onRejected 
   */
  Promise.prototype.catch = function(onRejected){
    return this.then(undefined, onRejected);
  }

  /**
   * Promise函数对象的resolve, 返回一个指定结果的成功的promise
   * @param {*} value 
   */
  Promise.resolve = function(value) {
    /**
     * 返回成功/失败的promise
     * 1、如果value是一般值，则返回成功的promise
     * 2、如果value是成功的promise，value是这个promise的value
     * 3、如果value是失败的promise，reason是这个promise的reason
     */
    return new Promise((resolve, reject) => {
      if(value instanceof Promise) {
        value.then(resolve, reject);
      } else {
        resolve(value);
      }
    });

  }

  /**
   * Promise函数对象的reject, 返回一个指定reason的失败的promise
   * @param {*} value 
   */
  Promise.reject = function(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    })
  }

  /**
   * Promise函数对象的all，返回一个promise, 只有当所有的promise都成功才成功，有失败则失败
   * @param {*} value 
   */
  Promise.all = function(promises) {
    const values = new Array(promises.length);
    let resolvedCount = 0;
    return new Promise((resolve, reject) => {
      promises.forEach((p, index) => {
        Promise.resolve(p).then(
          value => {
            resolvedCount++
            values[index] = value;
            if(resolvedCount === promises.length) {
              resolve(values);
            }
          },
          reason => {
            reject(reason);
          }
        );
      });
    });
  }

  /**
   * Promise函数对象的race，返回一个promise, 其结果由第一个完成的promise决定
   * @param {*} value 
   */
  Promise.race = function(promises) {
    return new Promise((resolve, reject) => {
      promises.forEach(p => {
        Promise.resolve(p).then(
          resolve,
          reject,
        );
      })
    })
  }

  window.Promise = Promise;
})(window);
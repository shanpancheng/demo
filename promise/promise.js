/**
 * 1、状态 pedding fullfilled rejected
 * 2、状态固化
 * 3、return 普通值会封装成resolve()
 */
class MyPromise {
  constructor(executor) {
    this.status = 'pending';
    this.value = '';
    this.onFulfillers = []; // 成功的回调
    this.onRejecters = []; // 失败的回调
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error)
    }
  }
  resolve(value) {
    if(this.status === 'pending') {
      this.value = value;
      this.status = 'resolved';
      this.onFulfillers.forEach(fn => fn(value));
    }
  }
  reject(reason) {
    if(this.status === 'pending') {
      this.value = reason;
      this.status = 'rejected';
      this.onRejecters.forEach(fn => fn(reason));
    }
  }
  then(onFulfilled, onRejected) {
    let _this = this;
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
    let promise2 = new MyPromise((resolve, reject) => {
      if(this.status === 'pending') {
        _this.onFulfillers.push(() => {
          setTimeout(()=>{
            try {
              let x = onFulfilled(_this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
        _this.onRejecters.push(() => {
          setTimeout(()=>{
            try {
              let x = onRejected(_this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
      }
      if(this.status === 'resolved') {
        setTimeout(()=>{
          try {
            let x = onFulfilled(_this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        })
      }
      if(this.status === 'rejected') {
        setTimeout(()=>{
          try {
            let x = onRejected(_this.reason);
            resolvePromise(promise2, x ,resolve, reject);
          } catch (error) {
            reject(error);
          }
        })
      }
    });
    return promise2;
   
  }
}

/**
 * 
 * @param {*} promise2 新的Promise对象
 * @param {*} x 上一个then的返回值
 * @param {*} resolve promise2的resolve
 * @param {*} reject promise2的reject
 */
function resolvePromise(promise2, x, resolve, reject) {
  if(promise2 === x) {
    reject(new TypeError('Chaining cycle'));
  }
  if(x && typeof x === 'object' || typeof x === 'function') {
     let used;
    try {
      let then = x.then
      if(typeof then === 'function'){
        then.call(x, (y)=>{
          if (used) return;
          used = true
          resolvePromise(promise2, y, resolve, reject)
        }, (r) =>{
          if (used) return;
          used = true
          reject(r)
        })
      } else {
        if (used) return;
        used = true
        resolve(x)
      }
    } catch(e){
      if (used) return;
      used = true
      reject(e)
    }
  } else {
    resolve(x);
  }
}


console.log('start');
var p = new MyPromise(function(resolve, reject) {
  setTimeout(() => resolve(5), 1000);
  // resolve(5);
}).then((val) => {
  console.log(val)
  resolve(val)
}).then(val => {
  console.log('res', value);
})
console.log('end');

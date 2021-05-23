import { def } from './utils';

export const arrayMethods = Object.create(Array.prototype);

const needChangeMethods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'sort',
  'reverse',
  'splice',
]

needChangeMethods.forEach(methodName => {
  const original = Array.prototype[methodName];
  def(arrayMethods, methodName, function() {
    // 取出数组的__ob__属性, 数组的__ob__属性在遍历外层对象时已经加上, this指向.前面的数组
    const ob = this.__ob__;
    const result = original.apply(this, arguments);
    let inserted = [];
    let args = [...arguments]
    // 有三种方法 push unshift splice 能够插入新项，现在要把插入的新项也要变成observe (可观察的)
    switch(methodName) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        // splice(插入位置， 数量， 插入的项)
        inserted = args.slice(2);
        break;
      default:
        break;
    }
    if(inserted.length) {
      ob.observeArray(inserted);
      ob.dep.notify();
    }
    console.log('啦啦啦');
    return result;
  }, false);
})
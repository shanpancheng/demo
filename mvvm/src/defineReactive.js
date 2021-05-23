import observe from './observe';
import Dep from './Dep';

export default function defineReactive(data, key, val) {

  const dep = new Dep();
  if(arguments.length === 2) {
    val = data[key];
  }

  let childOb = observe(data[key]);

  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log(`获取${key}值`, val);
      return val;
    },
    set(nVal) {
      if(nVal === val) {
        return;
      }
      console.log(`设置${key}值`, nVal);
      val = nVal;
      childOb = observe(data[key]);
      dep.notify();
    }
  })
}
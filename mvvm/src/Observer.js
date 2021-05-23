import { def } from './utils';
import defineReactive from './defineReactive';
import { arrayMethods } from './array';
import observe from './observe';
import Dep from './Dep';

// 将对象中的每个层级的属性都转换为响应式的
export default class Observer {
  constructor(value) {
    console.log('我是Observer');
    this.dep = new Dep()
    def(value, '__ob__', this, false);
    if(Array.isArray(value)) {
      // 将数组value 的原型 指向 arrayMethods
      Object.setPrototypeOf(value, arrayMethods);
      // 让数组变得observer
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  // 循环遍历对象，添加响应式
  walk(value) {
    for(var k in value) {
      defineReactive(value, k);
    }
  }
  observeArray(arr) {
    for(var i = 0, l = arr.length; i < l; i++) {
      observe(arr[i]);
    }
  } 
}
import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h,
} from "snabbdom";
// 创建出patch函数
const patch = init(([classModule, propsModule, styleModule, eventListenersModule]));

// 创建虚拟节点
let myVnode1 = h('a', {
  props: { 
    href: "http://www.baidu.com",
    target: '_blank'
  }
}, '百度');

let myVnode2 = h('div', {
  class: { 'box': true }
}, '我是一个盒子');

let myVnode3 = h('ul', {}, [
  h('li', { key: 'A' }, 'A'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'C' }, 'C'),
  h('li', { key: 'D' }, 'D'),
]);
let myVnode4 = h('ul', {}, [
  h('li', { key: 'A' }, 'A'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'D' }, 'D'),
  h('li', { key: 'E' }, 'E'),
  h('li', { key: 'C' }, 'C'),
]);

// 让虚拟节点上树
const container = document.getElementById('container');
patch(container, myVnode3);

const btn = document.getElementById('btn');
btn.onclick = function() {
  patch(myVnode3, myVnode4);
}


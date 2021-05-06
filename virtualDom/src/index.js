// https://blog.csdn.net/wanghuan1020/article/details/112506075
import h from './mysnabbdom/h';
import patch from './mysnabbdom/patch'

// const myVnode = h('div', {}, [
//   h('p', {}, '哈哈'),
//   h('p', {}, '呵呵'),
//   h('p', {}, [
//     h('span', {}, 'A'),
//     h('span', {}, 'B'),
//     h('span', {}, 'C'),
//   ]),
//   h('h1', {}, h('span', {}, '标题'))
// ]);
// console.log(myVnode);
const container = document.getElementById('container');

const myVnode = h('p', {}, [
  h('h1', { key: 'A'}, 'A'),
  h('h1', { key: 'B'}, 'B'),
  h('h1', { key: 'C'}, 'C'),
  h('h1', { key: 'D'}, 'D'),
  h('h1', { key: 'E'}, 'E'),
]);
// const myVnode = h('p', {}, '你好');
patch(container, myVnode);
console.log(myVnode);

const btn = document.getElementById('btn');

btn.onclick = function() {
  const myVnode2 = h('p', {}, [
    h('h1', { key: 'A'}, 'A'),
    h('h1', { key: 'B'}, 'B'),
    h('h1', { key: 'C'}, 'C'),
    
    h('h1', { key: 'D'}, 'D'),
    h('h1', { key: 'E'}, 'E'),
    h('h1', { key: 'F'}, 'F'),
  ]);
  // const myVnode2 = h('h1', {}, '你好a');
  patch(myVnode, myVnode2);
}

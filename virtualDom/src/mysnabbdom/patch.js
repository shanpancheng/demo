import vnode from './vnode';
import createElement from './createElement';
import patchVnode from './patchVnode';

export default function patch(oldVnode, newVnode) {
  console.log('----patch----', {oldVnode, newVnode});
  // 判断传入的第一个参数，是dom节点还是虚拟节点
  if(oldVnode.sel === '' || oldVnode.sel === undefined) {
    // 是Dom节点，包装为虚拟节点
    console.log(1233);
    oldVnode = vnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode);
  }
  // 判断oldVnode 和 newVnode是不是同一个节点
  if(oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel) {
    // 是同一个节点, 精细化比较
    patchVnode(oldVnode, newVnode);
  } else {
    // 不是同一个节点，暴力插入新的，删除旧的
    console.log('不是同一个节点', {oldVnode, newVnode})
    let newVnodeElm = createElement(newVnode);
    console.log(oldVnode.elm);
    // 插入到老节点之前
    newVnodeElm && oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm);
    // 删除老节点
    oldVnode.elm.parentNode.removeChild(oldVnode.elm);
  }
}
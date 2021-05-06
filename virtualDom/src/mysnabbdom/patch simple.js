import vnode from './vnode';
import createElement from './createElement';

export default function(oldVnode, newVnode) {
  // 判断传入的第一个参数，是dom节点还是虚拟节点
  if(oldVnode.sel === '' || oldVnode.sel === undefined) {
    // 是Dom节点，包装为虚拟节点
    oldVnode = vnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode);
  }
  // 判断oldVnode 和 newVnode是不是同一个节点
  if(oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel) {
    // 是同一个节点, 精细化比较
    console.log('是同一个节点');
    // 1、判断新旧vnode是否是同一个对象
    if(oldVnode === newVnode) {
      return;
    }
    // 2、判断新vnode有没有text属性
    if(newVnode.text && (!newVnode.children || !newVnode.children.length)) {
      // 新vnode有text属性
      console.log('新vnode有text属性');
      // 2.1 、比较新vnode和老vnode的text是否相同
      if(newVnode.text !== oldVnode.text) {
        // text 不相同，将新的text写入老的innerText
        oldVnode.elm.innerText = newVnode.text;
      } 

    } else {
      // 3、新vnode没有text属性
      console.log('新vnode没有text属性');
      // 3.1 、判断老的有没有children
      if(oldVnode.children && oldVnode.children.length) {
        // 老的有children， 最复杂情况
      } else {
        // 老的没有children, 新的有children
        // 清空老节点内容
        oldVnode.elm.innerHTML = '';
        // 遍历新的子节点，创建dom 追加到老节点中
        for(let ch of newVnode.children) {
          let newVnodeElm = createElement(ch);
          oldVnode.elm.appendChild(newVnodeElm);
        }
      }
    }
  } else {
    // 不是同一个节点，暴力插入新的，删除旧的
    console.log(newVnode);
    let newVnodeElm = createElement(newVnode);
    // 插入到老节点之前
    newVnodeElm && oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm);
    // 删除老街店
    oldVnode.elm.parentNode.removeChild(oldVnode.elm);
  }
}
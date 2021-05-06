import createElement from './createElement';
import updateChildren from './updateChildren';

// 对比同一个虚拟节点
export default function patchVnode(oldVnode, newVnode) {
  console.log('是同一个节点', {oldVnode, newVnode});
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
      // 老的有children， 最复杂情况, 新老都有children
      updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
      
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
}
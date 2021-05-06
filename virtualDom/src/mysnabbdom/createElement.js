// 真正创建节点。将vnode创建为DOM，但是是孤儿节点，不进行插入
export default function createElement (vnode) {
  // 创建一个DOM节点，这个节点现在还是孤儿节点
  const domNode = document.createElement(vnode.sel);
  // 有子节点还是文字？
  if(vnode.text && (vnode.children === undefined || vnode.children.length === 0)) {
    // 节点内部是文本
    domNode.innerText = vnode.text;
  } else if(Array.isArray(vnode.children) && vnode.children.length) {
    // 内部是子节点，递归创建子节点
    for(let i = 0; i < vnode.children.length; i++) {
      // 得到当前children
      const ch = vnode.children[i];
      // 创建出他的dom， 并且elm 指向创建出的DOM
      let chDom = createElement(ch);
      domNode.appendChild(chDom);
    }
  }
  // 补充elm属性
  vnode.elm = domNode

  // 返回domNode, domNode是一个纯DOM对象
  return domNode;
}
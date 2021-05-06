import patchVnode from './patchVnode';
import createElement from './createElement'

export default function updateChildren(parentElm, oldCh, newCh) {
  console.log('----updateChildren----', {oldCh, newCh});

  // 旧前
  let oldStartIdx = 0;
  // 新前
  let newStartIdx = 0;
  // 旧后
  let oldEndIdx = oldCh.length - 1;
  // 新后
  let newEndIdx = newCh.length - 1;

  // 旧前节点
  let oldStartVnode = oldCh[0];
  // 旧后节点
  let oldEndVnode = oldCh[oldEndIdx];
  // 新前节点
  let newStartVnode = newCh[0];
  // 新后节点
  let newEndVnode = newCh[newEndIdx];

  let keyMap = null;

  while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 首先不是判断1234命中，而是要略过已经加undefined标记的东西
    if (oldStartVnode === null || oldCh[oldStartIdx] === undefined) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (oldEndVnode === null || oldCh[oldEndIdx] === undefined) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (newStartVnode === null || newCh[newStartIdx] === undefined) {
      newStartVnode = newCh[++newStartIdx];
    } else if (newEndVnode === null || newCh[newEndIdx] === undefined) {
      newEndVnode = newCh[--newEndIdx];
    } else if(checkSameVnode(oldStartVnode, newStartVnode)) {
      // ① 新前与旧前
      console.log(' 1 新前与旧前 命中');
      patchVnode(oldStartVnode, newStartVnode);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if(checkSameVnode(oldEndVnode, newEndVnode)) {
      // ② 新后与旧后
      console.log(' 2 新后与旧后 命中');
      patchVnode(oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if(checkSameVnode(oldStartVnode, newEndVnode)) {
      // ③ 新后与旧前
      console.log(' 3 新后与旧前 命中');
      patchVnode(oldStartVnode, newEndVnode);
      // 当③新后与旧前命中的时候，此时要移动节点。移动旧前指向的这个节点到老节点的旧后的后面
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling);
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if(checkSameVnode(oldEndVnode, newStartVnode)) {
      // ④ 新前与旧后
      console.log(' 4 新前与旧后 命中');
      patchVnode(oldEndVnode, newStartVnode);
      // 当④新前与旧后命中的时候，此时要移动节点。移动到新前指向的这个老节点的旧前的前面
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      console.log('************都没有命中************');
      // 都没有命中
      // 寻找key 的 map
      if(!keyMap) {
        keyMap = {};
        for(let i = oldStartIdx; i <= oldEndIdx; i++) {
          const key = oldCh[i].key
          if(key != undefined) {
            keyMap[key] = i;
          }
        }
      }
      // 寻找当前这项（newStartIdx）在keyMap中的映射的位置序号
      const idxInOld = keyMap[newStartVnode.key];
      console.log('idxInOld: ', idxInOld);
      if(idxInOld == undefined) {
        // 判断 如果idxInOld是undefined表示他是全新的项

         parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm);
      } else {
        // 如果不是undefined，不是全新的项，表示要移动

        const elmToMove= oldCh[idxInOld];
        patchVnode(elmToMove, newStartVnode);
        // 把这项设置为undefined 表示我已经处理完这项了
        oldCh[idxInOld] = undefined;
        // 移动
        parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm);
      }
      // 指针下移，只移动新的头
      newStartVnode = newCh[++newStartIdx];
    }
  }
  console.log({newStartIdx, newEndIdx, oldStartIdx, oldEndIdx});
  // 继续看看剩余的节点是删除还是新增
  if(newStartIdx <= newEndIdx) {
    // 有新增的
    console.log('****新节点还有剩余的****');
    // const before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
    // console.log('before', newCh);
    for(let i = newStartIdx; i <= newEndIdx; i++) {
      parentElm.insertBefore(createElement(newCh[i]), oldCh[oldStartIdx] ? oldCh[oldStartIdx].elm : null);
    }
  } else if(oldStartIdx <= oldEndIdx) {
    console.log("****老节点还有剩余的****");
    for(let i = oldStartIdx; i <= oldEndIdx; i++) {
      oldCh[i] && parentElm.removeChild(oldCh[i].elm);
    }
  }
}


// 判断是否是同一个节点
function checkSameVnode(a, b) {
  return a.sel === b.sel && a.key === b.key;
}
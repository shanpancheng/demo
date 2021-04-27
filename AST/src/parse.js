import parseAttrs from './parseAttrs'

export default function(template) {
  let index = 0;
  let rest = template;
  // 标签开始标记
  let startRefExp = /^\<([a-z]+[1-6]?)(\s[^\<]+)?\>/;
  // 标签结束标记
  let endRefExp = /^\<\/([a-z]+[1-6]?)\>/;
  // 结束标签前的文字
  let wordRefExp = /^([^\<]+)\<\/[a-z]+[1-6]?\>/;
  let stack1 = [], stack2 = [{children: []}];

  while(index < template.length - 1) {
    rest = template.substring(index);
    if(startRefExp.test(rest)) {
      const tag = rest.match(startRefExp)[1];
      const attrStr = rest.match(startRefExp)[2] || '';
      // console.log('匹配到开始标记: ', tag);
      stack1.push(tag);
      stack2.push({type: 1, tag: tag, children: [], attrs: parseAttrs(attrStr)});
      // index += tag.length + 2;
      index += tag.length + 2 + attrStr.length;
    } else if(endRefExp.test(rest)) {
      const tag = rest.match(endRefExp)[1];
      // console.log('匹配到结束标记: ', tag);
      const pop_tag = stack1.pop();
      const pop_arr = stack2.pop();
      if(tag === pop_tag) {
        stack2[stack2.length - 1] = stack2[stack2.length - 1] || {};
        stack2[stack2.length - 1].children = stack2[stack2.length - 1].children || [];
        stack2[stack2.length - 1].children.push(pop_arr);
      } else {
        throw Error(tag + '标签未封闭');
      }
      index += tag.length + 3;
    } else if(wordRefExp.test(rest)) {
      const text = rest.match(wordRefExp)[1];
      if(!/^\s+$/.test(text)) {
        // console.log('匹配到文字：', text);
        stack2[stack2.length - 1].children.push({type: 3, text: text});
      }
      index += text.length;
    } else {
      index++;
    }
    // console.log(index, stack1, JSON.stringify(stack2))
  }
  // console.log(stack2)

  return stack2[0].children[0]
}
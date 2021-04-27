import parse from './parse';
// 转换为抽象语法树
const templateStr = `<div>
  <h3 class='h3 h4 h5' id='myh3' data-name='标题3'>文本</h3>
  <ul>
    <li>A</li>
    <li>B</li>
    <li>C</li>
  </ul>
  <div>哈哈</div>
</div>`

const ast = parse(templateStr);
console.log(ast);
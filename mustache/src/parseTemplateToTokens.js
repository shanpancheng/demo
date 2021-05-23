import Scanner from './Scanner'

export default function parseTemplateToTokens(templateStr) {
  let tokens = [];
  // 实例化一个扫描器，构造时候提供一个参数，这个参数就是模板字符串
  // 也就是说这个扫描器就是针对这个模板字符串工作的
  var scanner = new Scanner(templateStr);
  let words;
  while(!scanner.eos()) {
    words = scanner.scanUntil('{{');
    // 开始标记之前的文字
    if(words) {
      tokens.push(['text', words]);
    }
    scanner.scan('{{');
    words = scanner.scanUntil('}}');
    // {{}}  之间的文字
    if(words) {
      if(words[0] === '#') {
        tokens.push(['#', words.substr(1)])
      } else if(words[0] === '/') {
        tokens.push(['/', words.substr(1)])
      } else {
        tokens.push(['name', words])
      }
    }
    scanner.scan('}}');
  }


  return tokens;
}
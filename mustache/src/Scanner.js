export default class Scanner {
  constructor(templateStr) {
    this.pos = 0;
    // pos 后的字符串，包含pos位置的字符
    this.tail = templateStr;
    this.templateStr = templateStr;
  }

  // 路过指定的内容
  scan(tag) {
    if(this.tail.indexOf(tag) === 0 ) {
      this.pos += tag.length;
      this.tail = this.templateStr.substring(this.pos);
    }
    
  }


  // 让指针进行扫描，直到遇见直到内容结束，并且能够返回结束之前路过的文字
  scanUntil(stopTag) {
    // 记录下执行本方法前的pos
    let bkPos = this.pos;
    // 当尾巴的开头不是stopTag时，说明还没有扫描到stopTag
    while(!this.eos() && this.tail.indexOf(stopTag) != 0) {
      this.pos++;
      this.tail = this.templateStr.substring(this.pos);
    }
    return this.templateStr.substring(bkPos, this.pos);
  }

  // end of str
  eos() {
    return this.pos >= this.templateStr.length;
  }
}
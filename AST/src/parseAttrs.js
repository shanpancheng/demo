export default function(attrsStr) {
  let isYinhao = false;
  let point = 0;
  let result = [];
  for(let i = 0; i < attrsStr.length; i++) {
    const char = attrsStr[i];
    if(char === "'") {
      isYinhao = !isYinhao;
    } else if(char === ' ' &!isYinhao) {
      isYinhao = false;
      if(!/^\s*$/.test(attrsStr.substring(point, i))) {
        console.log(attrsStr.substring(point, i).trim());
        result.push(attrsStr.substring(point, i).trim());
        point = i;
      }
      
    }
  }
  if(!/^\s*$/.test(attrsStr.substring(point))) {
    result.push(attrsStr.substring(point).trim());
  }
  
  
  result = result.map(item => {
    const match = item.match(/^(.+)='(.+)'$/);
    return {
      name: match[1],
      value: match[2],
    }
  })

  return result;
}
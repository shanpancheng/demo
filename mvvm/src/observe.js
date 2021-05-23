import Observer from './Observer'

export default function observe(val) {
  if(typeof val !== 'object') return;
  // observe -> Observer -> defineReactive -> observe
  let ob;

  if(typeof val.__ob__ !== 'undefined') {
    ob = val.__ob__;
  } else {
    ob = new Observer(val);
  }

  return ob;
}
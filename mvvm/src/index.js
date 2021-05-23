import observe from './observe';

var obj = {
  a: {
    m: {
      n: 1
    }
  },
  b: 2,
  c: [1,2,3,{a:1}]
};

observe(obj);

// obj.c.splice(3, 1, [{a:2},2]);
obj.c.push(33)



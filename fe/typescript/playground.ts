const indexed = {
  b: 1
};
const arr = [1];

const c: {d: number} = {d: 1}
c.d = indexed.c;
console.log(c);
c.d = arr[2];
console.log(c);

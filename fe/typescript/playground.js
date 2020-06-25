var idxed = {
    b: 1
};
var arr = [1];
var c = { d: 1 };
c.d = idxed.c;
console.log(c);
c.d = arr[2];
console.log(c);

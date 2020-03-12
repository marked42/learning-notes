# Async

1. https://www.zhihu.com/question/303073602

Promise

1. https://zhuanlan.zhihu.com/p/51270903

```js
Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});
```

`resolve`函数返回一个，`then`函数返回一个`pending`状态的`Promise`

```js
// 1. resolve返回fulfilled状态的Promise p1
const p1 = Promise.resolve()
// 2. then返回pending状态的Promise p2，并将回调函数注册为微任务，这个微任务执行完成后，p2变成fulfilled状态
const p2 = p1.then(() => console.log('promise1'))
// 3. 同理
const p3 = p2.then(() => console.log('promise1'))
```

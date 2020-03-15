# Async

1. https://www.zhihu.com/question/303073602
1. https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous
1. Eloquent Javascript

Promise

1. https://zhuanlan.zhihu.com/p/51270903
1. 实现 https://zhuanlan.zhihu.com/p/34421918
1. async https://blog.ometer.com/2011/07/24/callbacks-synchronous-and-asynchronous/

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

## Promise

1. https://stackoverflow.com/questions/53894038/whats-the-difference-between-resolvethenable-and-resolvenon-thenable-object#

```js
let resolvePromise = new Promise(resolve => {
  let resolvedPromise = Promise.resolve()
  resolve(resolvedPromise)
})
resolvePromise.then(() => {
  console.log('resolvePromise resolved')
})
let resolvedPromiseThen = Promise.resolve().then(res => {
  console.log('promise1')
})
resolvedPromiseThen
  .then(() => {
    console.log('promise2')
  })
  .then(() => {
    console.log('promise3')
  })

```

```js
resolve(resolvedPromise)
//等同于：
Promise.resolve().then(() => resolvedPromise.then(resolve));
```

1. [Promise A+](https://www.ituring.com.cn/article/66566)
1. https://developers.google.cn/web/fundamentals/primers/promises

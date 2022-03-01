# 异步

1.  call back
1.  Promise
1.  generator function 协程的概念 函数暂停与恢复执行、 co 框架 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
1.  async/await https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
1.  top level async await
1.  setTimeout/setInterval 如何实现的
1.  [web worker](https://www.html5rocks.com/en/tutorials/workers/basics/) 是 HTML 规范的内容
    agent pattern/ [actor pattern](https://en.wikipedia.org/wiki/Actor_model)

1.  [异步编程那些事（深入）](https://zhuanlan.zhihu.com/p/28315360)
1.  [Understanding Async Await](https://css-tricks.com/understanding-async-await/)
1.  [异步复杂度要到什么程度才需要用到 Rxjs？](https://www.zhihu.com/question/303073602/answer/542179409)

1.  promise 十道题
    https://zhuanlan.zhihu.com/p/30797777
    https://www.zhihu.com/question/62305365/answer/199219185
    https://www.zhihu.com/question/62305365/answer/198580686

Promise

1.  [探讨：当 Async/Await 的遇到了 EventLoop](https://zhuanlan.zhihu.com/p/86993504)

1.  [Creating a JavaScript promise from scratch](https://humanwhocodes.com/blog/2020/09/creating-javascript-promise-from-scratch-constructor/)
1.  [Implementing promises from scratch](https://www.mauriciopoppe.com/notes/computer-science/computation/promises/)
1.  [史上最易读懂的 Promise/A+ 完全实现](https://zhuanlan.zhihu.com/p/21834559)
1.  [100 行代码实现 Promises/A+ 规范](https://zhuanlan.zhihu.com/p/83965949)
1.  [Promise: 给我一个承诺，我还你一个承诺](https://zhuanlan.zhihu.com/p/20209175)

Event Loop

1. [Event Loop 必知必会（六道题）](https://zhuanlan.zhihu.com/p/34182184)
1. [JavaScript Event Loop 机制详解与 Vue.js 中实践应用](https://zhuanlan.zhihu.com/p/29116364)
1. [详解 JavaScript 中的 Event Loop（事件循环）机制](https://zhuanlan.zhihu.com/p/33058983)
1. [Event Loop 的规范和实现](https://zhuanlan.zhihu.com/p/33087629)
1. [Node.js 源码解析：深入 Libuv 理解事件循环](https://zhuanlan.zhihu.com/p/35039878)
1. [理解 Node.js 事件驱动架构](https://zhuanlan.zhihu.com/p/27417770)

异步模型

1. [async/await 异步模型是否优于 stackful coroutine 模型？](https://www.zhihu.com/question/65647171/answer/233495694)

## 事件循环

Reactor 模式

Hollywood Principle Don't call us, we will call you.

1. 核心是一个事件循环(Event Queue)，任务来源（IO、用户交互）等产生事件 Event，每个任务有对应的事件和回调函数（handler），一个事件可以对应一个或者多个 handler。
1. 产生的事件添加到事件队列中（event queue），这些异步任务的集合通过多路复用机制（Event Demultiplexer 操作系统提供）可以**同步**的等待直到任何任务完成后触发对应事件，这个过程在另外一个线程？。
1. 事件触发后控制权转移回主线程，依次处理所有被触发的事件，执行事件对应的回调函数，直到事件队列被清空。这个过程中回调函数可能产生新的任务并向事件队列中添加对应事件。
1. 事件队列清空后进入空闲状态（idle），结束一次事件循环的处理。

不同的操作系统提供各自不同的多路复用机制，linux 提供`epoll`，macos 使用`kqueue`，windows 使用 IO Completion Port API (IOCP)，同一个操作系统上不同类型的资源 I/O 行为也可能不一致，例如 macos 不支持非阻塞式的文件操作，所以必须使用另外一个线程来模拟，libuv 提供了同一个的抽象，屏蔽痛不同操作系统的细节。

1. https://zhuanlan.zhihu.com/p/93612337
1. pattern oriented Software Architecture
1. https://github.com/ppizarro/coursera/tree/master/POSA/Books/Pattern-Oriented%20Software%20Architecture
1. http://www.laputan.org/pub/sag/reactor.pdf
1. [A introduction to libuv](http://nikhilm.github.io/uvbook/)

## 异步模式

### 场景

1. 异步顺序执行 callback/promise/event emitter
   ```js
   // 利用递归函数的办法控制异步任务顺序执行callback
   function iterate(index) {
     if (index === tasks.length) {
       return finish()
     }
     var task = tasks[index]
     task(function () {
       iterate(index + 1)
     })
   }
   function finish() {
     //iteration completed
   }
   iterate(0)
   ```
1. 并行执行
   ```js
   var tasks = []
   var completed = 0
   tasks.forEach(function (task) {
     task(function () {
       if (++completed === tasks.length) {
         finish()
       }
     })
   })
   function finish() {
     //all the tasks completed
   }
   ```
1. 带有数量限制的并行

   ```js
   // 同时使用EventEmitter和callback
   class ParallelTasks {
     constructor() {
       super()
     }

     // 每个任务开始，成功，失败可以触发像相应事件
   }
   ```

代表一个异步过程的几种形式

1. callback
1. promise
1. generator co
1. 相关的库 async, tapable

### callback

1. callback 是最后一个参数
1. callback 函数的第一个参数代表 error，如果没有错误发生，error 是 null。

同步方式使用`throw`提升（propagating）错误到外层函数，异步的方式在回调函数中调用外层函数的回调函数`callback(err)`，直接抛出错误会导致错误提升到最外层，成为 UncaughtException。

```js
var fs = require('fs')
function readJSON(filename, callback) {
  fs.readFile(filename, 'utf8', function (err, data) {
    var parsed
    if (err)
      //propagate the error and exit the current function
      return callback(err)
    try {
      //parse the file contents
      parsed = JSON.parse(data)
    } catch (err) {
      //catch parsing errors
      return callback(err)
    }
    //no errors, propagate just the data
    callback(null, parsed)
  })
}
```

可以使用

```js
process.on('uncaughtException', function (err) {
  console.error(
    'This will catch at last the ' + 'JSON parsing exception: ' + err.message
  )
  //without this, the application would continue
  process.exit(1)
})
```

### promise

### EventEmitter

### 不要混合使用同步与异步

例如一个带有缓存的读取文件实现，有缓存时同步返回，无缓存时 callback 形式异步返回。使用者无法确定到底是同步还是异步，应该统一包装成异步的形式。

参考 https://blog.izs.me/2013/08/designing-apis-for-asynchrony/

```js
var fs = require('fs')
var cache = {}
function inconsistentRead(filename, callback) {
  if (cache[filename]) {
    //invoked synchronously
    callback(cache[filename])
  } else {
    //asynchronous function
    fs.readFile(filename, 'utf8', function (err, data) {
      cache[filename] = data
      callback(data)
    })
  }
}
```

统一成异步的形式

```js
var fs = require('fs')
var cache = {}
function consistentReadAsync(filename, callback) {
  if (cache[filename]) {
    process.nextTick(function () {
      callback(cache[filename])
    })
  } else {
    //asynchronous function
    fs.readFile(filename, 'utf8', function (err, data) {
      cache[filename] = data
      callback(data)
    })
  }
}
```

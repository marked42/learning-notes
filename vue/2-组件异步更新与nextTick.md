# 组件异步更新与nexTick

在[Reactivity原理](./1-Reactivity原理.md)中介绍了Vue组件是异步更新的。Vue内部使用的Watcher可分为三类：

1. 用户使用`Vue.$watch`函数创建的Watcher
1. Watch选项创建的Watcher(内部也是使用`Vue.$watch`)创建
1. Vue组件的视图更新Watcher

其中只有在第一种情况先使用`Vue.$watch`才能通过选项`{ sync: true }`显式地指定Watcher是同步模式，其余两种情况都是使用默认值`false`因此对应的Watcher都是异步模式。

异步Watcher在更新时调用函数`queueWatcher`把自己添加到更新队列中。

```js
// src/core/observer/watcher.js
update () {
  if (this.lazy) {
    this.dirty = true
  } else if (this.sync) {
    this.run()
  } else {
    // 添加到异步更新队列
    queueWatcher(this)
  }
}
```

## queueWatcher

查看`queueWatcher`实现。

```js
// src/core/observer/scheduler.js
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue()
        return
      }
      nextTick(flushSchedulerQueue)
    }
  }
}
```

进行的操作包括

1. 不重复地添加watcher到队列中
1. 如果`flushing = false`表示还在当前时间循环中，直接添加watcher到队列中即可；如果`flushing = true`表示已经处于遍历队列执行回调的阶段，这中情况是watcher回调函数再次造成数据变化形成的，而watcher执行是按照id顺序从小到大来的，这时候需要把watcher按顺序插入到队列的合适位置。
1. 用`waiting`标志位限制只将清空队列函数`flushSchedulerQueue`注册到事件循环中1次，`waiting`默认为`false`，添加后设置为`true`，然后在下次`flushSchedulerQueue`执行结束后才重新设置为`false`。

`flushSchedulerQueue`的功能就是遍历watcher队列中所有元素，执行每个watcher的`run()`函数。需要注意的是在遍历队列前需要对队列按照`watcher.id`进行升序排列，这样的目的是：

1. 父组件的watcher创建先与子组件，因此父组件的watcher的id小于子组件的watcher的id，保证了父组件的组件更新要早于子组件。
1. 同一个组件的渲染函数watcher的id要大于其余所有watcher，保证了其他watcher都执行完后，组件数据处于最新状态，最后执行渲染函数watcher。
1. 如果父组件更新导致某些子组件不再渲染，子组件经历destroy阶段，其watcher会被标记为`active = false`的状态，这些`watcher`的回调函数在执行时会被跳过。

另外在开发模式下，还会检查`watcher`是否形成了循环依赖，即两个watcher是否会造成对方依赖的响应式数据发生变化，从而互相触发形成死循环。Vue使用了一个对象`circular`以`watcher.id`为key记录每个watcher的执行次数，如果执行次数超过了`MAX_UPDATE_COUNT = 100`会提示形成死循环。

最后调用`resetSchedulerQueue`恢复队列状态，并触发响应组件的`activated`和`updated`生命周期函数。

## nextTick

Vue使用`nextTick`将`flushSchedulerQueue`注册到下一个事件循环中，同时这个函数被暴露为`Vue.$nextTick`供用户使用。

`nextTick`函数本身比较简单，只是将会调函数放入回调函数队列中，关键在于调用了`timerFunc`函数将清空队列函数`flushCallbacks`注册到事件循环中。

函数`flushCallbacks`只是遍历`callbacks`数组，调用没有回调函数而已。需要注意的是清空`callbacks`队列时，首先暂存了队列的副本，这样在回调函数中新触发入列的会被放到下个事件循环中执行。

```js
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```

下面看一下`timerFunc`是如何实现将函数`flushCallbacks`注册到事件循环中的，参考[文档](../javascript/事件循环（EventLoop）.md)。 Vue按顺序依次使用Promise、MutationObserver、`setImmediate`和`setTimeout`将回调函数添加到事件循环。

1. `Promise.then(callback)` - 属于microtask
1. MutationObserver 属于microtask
1. `setImmediate`属于macrotask
1. `setTimeout(cb, 0)`属于macrotask

其中MutationObserver的实现如下

```js
// Use MutationObserver where native Promise is not available,
// e.g. PhantomJS, iOS7, Android 4.4
// (#6466 MutationObserver is unreliable in IE11)
let counter = 1
const observer = new MutationObserver(flushCallbacks)
const textNode = document.createTextNode(String(counter))
observer.observe(textNode, {
  characterData: true
})
timerFunc = () => {
  counter = (counter + 1) % 2
  textNode.data = String(counter)
}
```

创建一个`TextNode`元素，用`MutationObserver`来检测该元素文本内容的变化， `timerFunc`每次调用都会用改变元素文本内容从而触发`flushCallbacks`函数。

# [事件循环（Event Loop）](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)

## 任务与微任务

浏览器中每个线程拥有单独的事件循环，由DOM变动、用户操作、网络请求、HTML解析等情况产生的事件(event)会添加对应的任务（task）或者微任务（microtask）到任务或者微任务队列中，任务或者微任务会被按照一定顺序依次取出并执行。

任务队列一般存在多个，将不同类型的任务放到不同的队列中，同一个任务队列中的任务之间按照先进先出(FIFO)的顺序执行，但是不同队列的任务之间没有确定的执行顺序。这样设计的原因是根据不同类型任务的优先级，浏览器可以选择先执行优先级高的任务队列，如用户交互事件等。微任务队列每个事件循环只有一个。

每执行完一个任务后，浏览器可以选择在这个时机根据需求重新渲染界面，以保证合适的刷新频率。由于渲染是穿插在任务之间，一个任务在执行的过程中可能会响应用户交互事件、网络事件等造成界面需要更新，这些更新相关操作可以添加为微任务。这样在任务结束后，这些微任务能准备好新的数据，浏览器在下一个任务之前即可进行重新渲染。否则这些更新操作只能在下一个任务中执行，并在下个任务结束后重新渲染。

在每个任务执行完成后，存在一个[脚本清除（clean up）](https://html.spec.whatwg.org/multipage/webappapis.html#clean-up-after-running-script)的阶段，清除任务脚本相关且不需要继续存在的资源。这时如果js调用栈为空，需要[进行微任务检查(perform microtask check point)](https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint)。

[处理模型](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)

1. 任务
1. 检查微任务
1. 重新渲染


执行该事件循环的微任务队列中所有微任务直到队列清空，这个过程中可能会加载运行脚本，在此进行脚本清除，并进行微任务检查。但是微任务检查过程会有一个初始值为`false`的布尔类型标志位，在初次进入时设置为`true`从而防止微任务检查过程重入(reentrancy)。

### 任务

1. 定时器 `setTimeout`/`setInterval`/`setImmediate`
1. MessageChannel
1. I/O
1. UI渲染
1. requestAnimationFrame

### 微任务

1. MutationObserver
1. Promise
1. addEventListener添加的事件回调函数
1. Object.observe
1. process.nextTick

## [实例](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

### 例子1

```js
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');
```

运行结果是

1. 脚本顺序执行，本身就是一个任务
    ```
    script start
    script end
    ```
1. 脚本执行完后进入清除阶段，检查微任务执行点，执行Promise添加的两个微任务
    ```
    promise1
    promise2
    ```
1. 执行`setTimeout`添加的任务
    ```
    setTimeout
    ```


## 例子2

内外两个`div`元素

```html
<div class="outer">
  <div class="inner"></div>
</div>

<script>
// Let's get hold of those elements
var outer = document.querySelector('.outer');
var inner = document.querySelector('.inner');

// Let's listen for attribute changes on the
// outer element
new MutationObserver(function() {
  console.log('mutate');
}).observe(outer, {
  attributes: true
});

// Here's a click listener…
function onClick() {
  console.log('click');

  setTimeout(function() {
    console.log('timeout');
  }, 0);

  Promise.resolve().then(function() {
    console.log('promise');
  });

  outer.setAttribute('data-random', Math.random());
}

// …which we'll attach to both elements
inner.addEventListener('click', onClick);
outer.addEventListener('click', onClick);
</script>
```

用户**手动点击**inner元素触发`click`事件的输出:

1. click 点击inner元素触发回调,事件回调函数本身就是微任务，输出
    ```
    click
    ```
1. 回调函数执行完后，进入微任务检查点，顺序执行添加的微任务 `Promise` 和 `MutationObserver`。
    ```
    promise
    mutate
    ```
1. `click`回调函数微任务继续执行，事件冒泡到`outer`元素，再次触发回调输出
    ```
    click
    promise
    mutate
    ```
1. 回调函数执行完毕，顺序执行两个定时器函数的任务回调函数。
    ```
    timeout
    timeout
    ```

### 例子3

上面的例子中，用户手动点击`inner`元素改为添加一行`inner.click()`触发点击事件，输出如下。

```
click
click
promise
mutate
promise
timeout
timeout
```

1. 脚本`inner.click()`触发点击事件，导致点击事件回调执行完之后，调用栈上的`click()`函数还没执行完，这时不进行微任务检查，点击事件继续冒泡执行第二次回调，连续输出两次`click`。
2. 第二次回调完成后，进行微任务检查，顺序执行之前添加的微任务，但是`MutationObserver`微任务不能重复添加，所以只输出了一次`mutate`。
3. 顺序执行添加的定时器任务，连续输出两次`timeout`。

## Node libuv (TODO:)

1. https://zhuanlan.zhihu.com/p/33058983
1. https://zhuanlan.zhihu.com/p/35039878
1. https://zhuanlan.zhihu.com/p/50497450
1. https://zhuanlan.zhihu.com/p/54951550
1. https://zhuanlan.zhihu.com/p/33090541

## 参考

1. [知乎问题](https://www.zhihu.com/question/55364497/answer/144215284)
1. https://zhuanlan.zhihu.com/p/35958023
1. https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop

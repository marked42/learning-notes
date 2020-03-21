# requestAnimationFrame

## 简介

使用`setTimeout`定时器函数生成的动画无法保证与浏览器渲染时机一致，很可能在浏览器刚刚完成渲染后，造成页面改变，需要多次渲染。 `requestAnimationFrame` 保证注册的回调函数在浏览器真正渲染之前执行，从而在下次渲染时即可得到最新的画面。

出于性能考虑，`requestAnimationFrame`注册的回调函数在文档tab不可见以及`<iframe>`被隐藏等状态下不会执行。

[Animation Frames标准](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#animation-frames)规定了相关接口，`window`对象做了实现。

```ts
type FrameRequestCallback = (DOMHighResTimeStamp time) => void

interface AnimationFrameProvider {
  unsigned long requestAnimationFrame(FrameRequestCallback cb);
  void cancelAnimationFrame(unsigned long handle);
}
```

`requestAnimationFrame`调用接受一个`callback`参数将其注册到当前目标的回调函数Map中，返回一个数字作为回调的键值存储在Map中。这个数字从1开始顺序递增，使用`cancelAnimationFrame`可以取消该回调。

`requestAnimationFrame`的回调会在浏览器事件循环的渲染阶段依次执行，由于回调函数只被执行一次，所以需要回调函数递归调用`requestAnimationFrame`才能形成连续的动画效果。

回调函数接受一个代表当前时间戳的参数，用来计算在该步应当出现的动画效果。

```js
var start = null;
var element = document.getElementById('SomeElementYouWantToAnimate');

function step(timestamp) {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  element.style.transform = 'translateX(' + Math.min(progress / 10, 200) + 'px)';
  if (progress < 2000) {
    window.requestAnimationFrame(step);
  }
}

window.requestAnimationFrame(step);
```

上面例子中`step`函数被递归调用，从而在2秒的时间内每一帧之前执行回调并注册下次回调，形成动画效果。

## `requestAnimationFrame`与事件循环

有人认为`requestAnimationFrame`注册的回调就是任务(Task)，理由是这些回调和任务一样会在微任务之后执行，这种说法不对。[浏览器事件循环模型](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)简化如下:

1. 从任务队列中取出最早的一个任务执行
1. 任务执行完成后，如果JS调用栈为空，进行微任务调用检查([perform a microtask checkpoint](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#run-the-animation-frame-callbacks))，按照先进先出的顺序执行微任务队列中所有微任务，直到队列为空。
1. 进行更新渲染过程，如果没有必要重新渲染，此步骤可以跳过。这个步骤中包括执行Animation Frame回调（[run the animation frame callbacks](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#run-the-animation-frame-callbacks)）。

由此可见`requestAnimationFrame`回调明显不是任务，只是在事件循环中被安排在微任务之后执行，这个阶段还有其他很多回调，可参考事件循环规范。

需要注意的是在任何回调（包括`requestAnimationFrame`回调）完成后，同样需要进行[微任务检查](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#run-the-animation-frame-callbacks)，从而见缝插针的尽早执行微任务。

下面例子可说明回调的顺序

```js
function testRequestAnimationFrame() {
  setTimeout(() => {
    console.log('task1')
  }, 0)

  Promise.resolve().then(() => {
    console.log('microtask1')
  })

  window.requestAnimationFrame(() => {
    setTimeout(() => {
      console.log('task2')
    }, 0)

    Promise.resolve().then(() => {
      console.log('microtask2')
    })

    console.log('requestAnimationFrame callback')
  })
}

testRequestAnimationFrame()
```

执行函数`testAnimationFrame()`，首先注册task1和microtask1，之后顺序输出如下:

1. microtask1 - `testRequestAnimationFrame`函数执行完后，当前任务结束，接着进行微任务检查，执行microtask1
1. requestAnimationFrame callback - 更新渲染阶段执行`requestAnimationFrame`回调，并注册task2和microtask2
1. microtask2 - `requestAnimationFrame`回调完成后进行微任务检查从而执行刚注册的微任务microtask2
1. task1 - 完成更新渲染阶段后，顺序执行之前注册的任务task1
1. task2 - 顺序执行任务task2

## 嵌套`requestAnimationFrame`为什么不会阻塞渲染

嵌套使用微任务回调，由于微任务队列用于无法清空，因此会形成死循环，此时浏览器无法对用户输入进行相应。`Promise`和`process.nextTick`回调都属于微任务，因此都可以嵌套调用形成死循环。

```js
function blockWithPromise() {
  Promise.resolve().then(() => {
    console.log('blocked')
    blockWithPromise()
  })
}

// in node
function blockWithNextTick() {
  process.nextTick(() => {
    console.log('blocked')
    blockWithNextTick()
  })
}
```

最开始使用`requestAnimationFrame`时也会有这个疑问，回调中嵌套使用`requestAnimationFrame`会注册新的回调函数到当前的Map中。同时浏览器事件循环处于执行所有回调的阶段，按理说新的回调函数应该在后续被执行，从而再次注册新的回调导致死循环，将浏览器阻塞在重绘之前，事实显然并非如此。

根据浏览器[事件循环模型](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)的规范文档，在事件循环的重新渲染阶段的一个子步骤中会执行Animation Frame回调（[run the animation frame callbacks](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#run-the-animation-frame-callbacks)）。步骤如下：

1. 令`callbacks`等于目标的回调Map对象。
1. 令`callbackHandles`等于获取`callbacks`的所有key的结果。
1. 对于`callbackHandles`中每个key，如果Map对象中有对应callback值，移除并执行该callback。

从上述过程中知道，每次处理`requestAnimationFrame`回调时，关键在于会首先查询当前所有注册的回调，相当于做了个缓存，然后对其进行遍历调用。因此，尽管嵌套使用的`requestAnimationFrame`回调会注册新的回调，但是这些回调不会立即被执行，而是在处理完之前注册的所有回调并完成重绘之后，才会在下一此重绘之前被执行。

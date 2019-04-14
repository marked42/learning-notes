# Popover组件设计

Popover包括参考元素(reference)和弹出的内容元素(content)两部分，参考元素存在界面正常DOM结构中，而弹出元素的DOM位置则不做限制，例如可以作为body元素的子元素存在。

## 触发方式

### 点击(click)触发

1. 点击参考元素时切换显示隐藏。
1. 点击内容元素时不改变显示隐藏状态。
1. 点击除了参考元素和内容元素及其后代元素的其他DOM元素，则隐藏内容元素。

取消点击事件bubble对于内容元素显隐的影响

1. 点击参考元素，无论是否取消bubble都会触发回调函数，切换显隐状态。
1. 点击参考元素子元素，交由用户代码来决定是否取消点击事件的bubble，如果不取消，点击事件传递到参考元素同样触发回调函数，切换显隐状态；如果取消点击事件bubble，则点击事件不会传递到参考元素，显隐状态不变。
1. 点击内容元素，内容元素只有在显示的时候才会触发点击事件，这时候期望保持显示状态不变，因此不需要绑定回调，同时其子元素的点击事件也不需要监听。

由于点击除了参考元素和内容元素之外的元素需要隐藏Popover，需要监听document点击事件，但是需要注意的是参考元素子元素的点击事件可能被用户取消bubble，所以无法在冒泡阶段(bubbling phase)传递给document元素，需要在捕获（capture phase）阶段监听该事件。

### 滑动(hover)触发

1. 需要同时在内容元素和content元素上监听mouseenter, mouseleave事件，来改变显隐状态。

问题
1. mouseenter/mouseleave 和 mouseover/mouseout 的选择 ？
1. 鼠标在内容元素和参考元素之间滑动的时候，由于先滑出一个元素，在滑入一个元素，整体的效果是内容元素保持显示状态，但是中间触发了两个事件，如何处理？
引入一个延迟timer，mouseleave 200ms后才关闭，如果这期间划入了Popover，则清除这个关闭的timer，

### 焦点(focus)触发

reference元素和content元素不一定能够获得焦点，所以需要设置`tabindex`属性为0来使得这两个元素可以聚焦，否则无法触发焦点相关事件。

预期的焦点事件触发content元素显隐行为如下：

1. reference元素得到焦点时显示content元素，失去焦点时隐藏content元素。
1. 由于content元素在DOM结构上不一定是reference元素的后代元素，而是可能直接作为body元素子元素存在，所以content元素的焦点事件也要绑定与reference元素相同的回调事件，从而在`content`元素失去焦点时能够正确隐藏自身。

另外焦点事件有两组`focus`/`blur`和`focusin`/`focusout`，应该使用`focusin`/`focusout`，因为这两个事件支持冒泡。否则如果`reference`和`content`元素的后代元素获得了焦点的话，`focus`/`blur`只在后代元素上触发不支持冒泡。

另外`focusout`/`focusin`事件在焦点从`content`元素转移到`reference`元素时存在`focusin`不能被触发的问题。

#### 情况1 `addEventListener`绑定回调

代码如下:

```html
<template>
  <div>
    <div
      id="reference"
      @focusin="handleFocusin"
      @focusout="handleFocusout"
      tabindex="0"
    >reference</div>

    <div
      id="content"
      v-if="contentVisible"
      @focusin="handleFocusin"
      @focusout="handleFocusout"
      tabindex="0"
    >content</div>
  </div>
</template>

<script>
export default {
  name: 'Popover',

  data() {
    return {
      contentVisible: false,
    }
  },

  methods: {
    handleFocusin() {
      this.contentVisible = true
    },

    handleFocusout() {
      this.contentVisible = false
    },
  },

  mounted() {
    const reference = document.querySelect('#reference')
    reference.addEventListener('focusin', this.handleFocusIn)
    reference.addEventListener('focusout', this.handleFocusOut)

    const content = document.querySelect('#content')
    content.addEventListener('focusin', this.handleFocusIn)
    content.addEventListener('focusout', this.handleFocusOut)
  },
}
</script>
```

使用`addEventListener`在元素上绑定了焦点事件的回调， 如果reference元素当前获得焦点，此时用户点击content元素，导致焦点从reference转移到content，触发事件顺序如下。

1. `content`元素触发`mousedown`事件
1. `reference`元素触发`focusout`事件
1. `handleFocusout`被调用，`contentVisible`的值从`true`变成`false`，Popover组件的更新Watcher被通知依赖发生了变化，因此组件更新Watcher被作为微任务添加到事件循环中。
1. `handleFocusout`任务执行完成后，检查并执行微任务，更新组件造成DOM发生变化，界面重绘。
1.  这时本来预期焦点转移到`content`元素上，并触发`handleFocusin`事件重新将`contentVisible`设置成`true`保证焦点转移过程中，`content`元素不会隐藏。但是由于浏览器已经重绘，`content`被隐藏了，`focusin`事件不会再触发。

如果要保证焦点转移过程中，`content`元素不被重绘隐藏，就要使得重绘发生在`focusin`事件之后。这样下次重绘前

1. `handleFocusout`首先触发，`contentVisible`的值从`true`被设置为`false`。
1. `handleFocusin`再触，`contentVisible`值又被设置为`true`，从而保证下次重绘时`content`元素保持显示状态。

#### 情况2 v-on绑定回调事件

使用v-on指令绑定回调事件可以解决上面例子中的问题。 实例代码如下:

```html
<template>
  <div>
    <div
      @focusin="handleFocusin"
      @focusout="handleFocusout"
      tabindex="0"
    >reference</div>

    <div
      v-if="contentVisible"
      @focusin="handleFocusin"
      @focusout="handleFocusout"
      tabindex="0"
    >content</div>
  </div>
</template>

<script>
export default {
  name: 'Popover',

  data() {
    return {
      contentVisible: false,
    }
  },

  methods: {
    handleFocusin() {
      this.contentVisible = true
    },

    handleFocusout() {
      this.contentVisible = false
    },
  },
}
</script>
```

原因是v-on指令绑定的事件回调函数，在执行时改变组件数据触发的回调函数被添加为任务而不是微任务。源码如下：

```js
// 1. add 函数是v-on指令使用的绑定DOM事件的函数， 默认使用`withMacroTask`函数包装handler，
// https://github.com/vuejs/vue/blob/v2.5.17/src/platforms/web/runtime/modules/events.js#L48
function add (
  event: string,
  handler: Function,
  once: boolean,
  capture: boolean,
  passive: boolean
) {
  handler = withMacroTask(handler)
  if (once) handler = createOnceHandler(handler, event, capture)
  target.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture, passive }
      : capture
  )
}

// 2. 这样在handler被调用前开启useMacroTask标志
// https://github.com/vuejs/vue/blob/v2.5.17/src/core/util/next-tick.js#L81
export function withMacroTask (fn: Function): Function {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true
    const res = fn.apply(null, arguments)
    useMacroTask = false
    return res
  })
}

// 3. handler调用时触发的组件更新Watcher被添加为任务而不是微任务。当前的`focusout`回调函数作为
// 任务继续执行，并触发`focusin`事件。在`focusin`回调执行后才会在下一个任务执行组件更新Watcher，
// 从而使的焦点转移过程中`content`元素不被隐藏。
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

#### 情况3 transition

使用`transition`组件嵌套`content`元素添加动画效果，也可以得到推迟组件渲染，保持焦点转移过程中`content`元素不隐藏的效果。

原因在于`transition`组件中使用`v-show`的元素或者组件值从`true`变为`false`时，DOM操作不是立即在当前帧生效的，而是被推迟安排在下一帧渲染之前执行，这样给了`focusin`事件在当前帧触发的机会。

```js
// 1. v-show指令的update函数，绑定leave的动画回调操作 el.style.display = 'none'
// https://github.com/vuejs/vue/blob/v2.5.17/src/platforms/web/runtime/directives/show.js#L40
update (el: any, { value, oldValue }: VNodeDirective, vnode: VNodeWithData) {
  /* istanbul ignore if */
  if (!value === !oldValue) return
  vnode = locateNode(vnode)
  const transition = vnode.data && vnode.data.transition
  if (transition) {
    vnode.data.show = true
    if (value) {
      enter(vnode, () => {
        el.style.display = el.__vOriginalDisplay
      })
    } else {
      leave(vnode, () => {
        el.style.display = 'none'
      })
    }
  } else {
    el.style.display = value ? el.__vOriginalDisplay : 'none'
  }
}

// 2. nextFrame函数将回调cb安排在下一帧
// https://github.com/vuejs/vue/blob/v2.5.17/src/platforms/web/runtime/modules/transition.js#L151
nextFrame(() => {
  removeTransitionClass(el, startClass)
  if (!cb.cancelled) {
    addTransitionClass(el, toClass)
    if (!userWantsControl) {
      if (isValidDuration(explicitEnterDuration)) {
        setTimeout(cb, explicitEnterDuration)
      } else {
        whenTransitionEnds(el, type, cb)
      }
    }
  }
})

// 3. nextFrame函数使用requestAnimationFrame或者setTimeout实现
// https://github.com/vuejs/vue/blob/v2.5.17/src/platforms/web/runtime/transition-util.js#L67
const raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ fn => fn()

export function nextFrame (fn: Function) {
  raf(() => {
    raf(fn)
  })
}
```

### 手动(manual)触发

根据需要控制组件代表显隐状态的数据来显示或者隐藏组件，不需要绑定任何回调。

1. 切换触发方式时，能够移除之前的触发方式绑定的事件回调，并绑定新的回调。
1. 组件销毁时，清除绑定的回调。

### 触发方式总结

滑动触发的`mouseleave`/`mouseenter`事件和焦点触发的`focusout`/`focusin`事件在焦点转移过程中都存在如何保证`content`元素不被隐藏的问题。关键在推迟组件更新DOM渲染，从而保持`content`元素显示，给`mouseenter`和`focusin`事件触发的机会。

可以使用的方法总结如下：

1. 使用`setTimeout`延迟设置改变`contentVisible`变量的值
1. v-on绑定回调，安排组件更新Watcher回调为任务而不是微任务
1. 使用nextFrame安排DOM更新操作在下一帧

## 指示箭头与位置偏移

arrowVisible

## DOM结构

appendToBody

## 延迟显示

## 可访问性

## 指令

## 事件

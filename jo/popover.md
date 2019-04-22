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

需要同时在reference元素和content元素上监听mouseenter, mouseleave事件，来改变显隐状态。mouseenter/mouseleave支持冒泡，mouseover/mouseout不支持冒泡。

鼠标在内容元素和参考元素之间滑动的时候，由于先滑出一个元素，再滑入一个元素，整体的效果是内容元素保持显示状态，但是中间触发了两个事件，如何处理？

引入一个延迟timer，mouseleave 200ms后才关闭，如果这期间滑入了Popover触发了mouseenter，则清除这个关闭的timer。

### 焦点(focus)触发

预期的焦点事件触发content元素显隐行为如下：

1. reference元素或者其后代元素得到焦点时显示content元素，失去焦点时隐藏content元素。
1. 由于content元素在DOM结构上不一定是reference元素的后代元素，而是可能直接作为body元素子元素存在，所以content元素的焦点事件也要绑定与reference元素相同的回调事件，从而在`content`元素失去焦点时能够正确隐藏自身。

另外焦点事件有两组`focus`/`blur`（不支持冒泡）和`focusin`/`focusout`（不支持冒泡），应该使用`focusin`/`focusout`，这样后代元素得到市区焦点时也能够触发`reference`和`content`的回调函数。

reference元素和content元素不一定有能够聚焦的后代元素，所以需要设置`tabindex`属性为0来使得这两个元素自身可以聚焦，否则在这种情况下无法触发焦点相关事件。

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

#### 另辟蹊径

上面所说的三种情况的问题根源在于想要将`content`元素和`reference`元素及其后代元素看做一个整体来处理焦点事件，焦点在这个整体内转移的话并不改变`content`显隐。

在焦点存在这个整体中的前提下，`contentVisible`的值是`true`。此时如果焦点在这个整体的内部转移，同样会顺序触发`foucsout`/`focusin`事件，将`contentVisible`设成`false`再设成`true`。显然这中间的两个回调函数等于做了无用功，而且上面花费了大工夫来推迟DOM渲染来保证`content`元素一直显示，如果能够检测出焦点在内部转移的情况，那么这两次回调本身也可以避免。

这样还有一个额外的优点，如果要在`content`元素显示或者隐藏的时候发出`hide`/`show`事件，连续两次相互抵消的回调函数会发出多余的两个事件。那么用户使用这个组件的时候就会比较尴尬，明明焦点转移整体效果上并没有改变可见性，但是却顺序收到了`hide`/`show`两个事件。

所幸的是`FocusEvent`事件提供了一个叫做`relatedTarget`的属性，这个属性代表焦点事件中涉及的另外一个元素，如果不存在另外一个元素则该值为`null`。利用这个属性我们就可以在焦点转移事件回调中检测出这种情况。

```js
function focusTransferredInternally(focusEvent, reference, content) {
  const internalElements = [reference, content]

  return internalElements.every(el => el) &&
    internalElements.some(el => el.contains(focusEvent.relatedTarget))
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

## 指示箭头

content元素一般会设计一个边框箭头，标明元素之前的指向关系。这个箭头的位置由Popper.js库进行定位，创建箭头元素div的时候，添加类名`jo-popover__arrow`并且在Popper的构造函数选项中指定`arrowElement`选项，内部使用指定的类型在`content`元素下查找有该类名的元素作为箭头元素。

```js
{
  modifiers: {
    arrow: {
      arrowElement: 'jo-popper__arrow',
    },
  },
}
```

在`content`元素上有属性`x-placement`表示实际的对齐方式，由Popper.js负责更新，利用这个属性值选择性设置不同对齐方式的箭头位置，以`x-placement=top`为例：

```stylus
jo-popper__arrow
  display block
  position absolute
  width 0
  height 0
  border $popper-arrow-size solid transparent
  filter drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03))
  &::after
    content " "
    display block
    position absolute
    width 0
    height 0
    border $popper-arrow-size solid transparent

jo-popover__content[x-placement^="top"]
  margin-bottom $popper-gap
  .jo-popper__arrow
    border-top-color $popper-border-color
    bottom ($popper-arrow-size * -1)
    border-bottom-width 0
    &::after
      border-top-color $popper-background-color
      bottom 1px
      left (-1 * $popper-arrow-size)
      border-bottom-width 0
```

利用绝对定位将箭头元素定位到底部，并且利用width和height均为0的元素的border画出三角形，利用伪元素画出相同尺寸的三角形，颜色和content元素背景色相同，并且定位错开1px，从而形成具有1px边框效果的箭头。

content元素只用`box-shadow`形成边框阴影效果，箭头本身是边框组成的，围绕箭头的阴影效果处需要使用`filter: drop-shadow()`形成，`box-shadow`是针对盒子模型的，此处不适用。

## DOM结构

Popover本身就是正常DOM结构中某一个元素上通过一定方式触发弹出元素，更自然的希望弹出元素在DOM结构上脱离reference元素，这样reference元素处的DOM结构不论有没有Popover都是一样的。属性`appendToBody`默认为`true`表示将弹出元素`content`默认放在body元素下。

## 延迟显示

支持延迟显示功能一方面可以控制多个Popover在弹出的时间顺序，另一方面是为了解决`mouseleave`/`mouseenter`连续触发问题的要求。使用`hoverOpenDelay`属性接受数字，表示延迟显示的毫秒数。

## 可访问性

content元素设置属性`role=tooltip`和`aria-hidden`，`aria-describedby`等属性。

## 事件

使用属性`value`表示Popover的显示与否，在可见性发生改变时会发出事件`update:value`。可以使用`v-model`或者`.sync`修饰符双向绑定到该值。

```vue
<jo-popover v-model="visible"></jo-popover>
<jo-popover :value.sync="visible"></jo-popover>
```

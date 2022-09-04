# Reactivity 原理

## 响应式数据

Vue 使用的数据驱动视图渲染模式中，通过对数据读写进行劫持实现依赖收集与变化检测，将普通的数据包装成响应式的数据，从而实现数据发生变化时通知相应的订阅方(Watcher)进行更新，其中包括一般的副作用函数（网络请求，数据更新等）和视图更新函数。

响应式数据分为两类：

1. 不从任何其他数据计算得来的单个数据，这些数据之间相互独立没有关联关系。
1. 从单个或者多个其他数据计算得来的复合数据，Vue 称作计算属性(Computed Property)。计算属性一方面本依赖于其他的响应式数据，是一个 Watcher，另一方面也是一个可变数据，被其他 Watcher 当做依赖。

响应式数据在变化时可以通知 Watcher 进行更新，相对于 Watcher 来说所有会造成其更新的响应式数据都是它的依赖，依赖的概念描述了响应式数据相对于 Watcher 发挥的"通知订阅者更新"的作用。在实现时有两种方式：

1. 单独的一个类`Dep`代表依赖的概念，响应式数据与`Dep`类实例一一对应。读取响应式数据时，将当前进行读取的 Watcher 记录在对应`Dep`实例的 Watcher 列表中，响应式数据变化更新时，通知对应`Dep`类实例的 Watcher 列表进行更新。
1. 依赖概念作为一个接口实现，响应式数据都实现这个接口，功能同上。

Vue 使用了第一种方式实现依赖，示意如下：

```js
class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    if (this.includes(sub)) {
      return
    }

    this.subs.push(sub)
  }

  includes(sub) {
    return this.subs.includes(sub)
  }

  removeSub(sub) {
    if (!this.includes(sub)) {
      return
    }

    this.subs = this.subs.filter((s) => s !== sub)
  }

  // 代表正在进行依赖收集的Watcher
  static target
}
```

假设`getter`函数是一个普通函数，其中使用到若干个响应式数据，希望回调函数`callback`在`getter`函数用到的响应式数据变化时自动被调用。

`getter`函数调用时如果用到了响应式数据，就会进行依赖收集。Vue 使用了劫持属性`get`函数的方法进行依赖收集，`getter`函数调用时，任何被读取的响应式数据的`get`函数都会被执行，在这个时机可以将回调函数`callback`注册到响应式数据的依赖实例回调列表中。后续如果响应式数据发生任何变化，即可在被劫持的`set`函数中，通知订阅列表中所有回调函数进行更新。

响应式的基本原理就是在数据**使用时收集依赖**，在数据**变化时触发更新**。

### 依赖收集与更新触发

#### 如何触发依赖收集

由于依赖收集的过程只能在响应式数据属性被劫持的`get`函数中发生的，所以只有能  在`getter`函数**内部**、**同步地**触发数据属性值的`[[GET]]`操作才能触发劫持的`get`函数，从而进行依赖收集。

假设`data`是一个响应式数据对象，下面是关于依赖收集的几个正确和错误的代码示例。

```js
// 1. yes
function getter() {
  console.log(data.a)
}

// 2. yes
function getter() {
  const logger = () => {
    console.log(data.a)
  }

  logger()
}

// 3. no - 在getter函数之外使用data.a触发了[[GET]]操作，但是在函数内部使用prop变量，触发的是window.prop的[[GET]]操作而不是data.a
window.prop = data.a
function getter() {
  console.log(window.prop)
}

// 4. no - 并没有执行到data.a
function getter() {
  if (false) {
    console.log(data.a)
  }
}

// 5. no - 异步回调，不是同步发生
function getter() {
  setTimeout(() => {
    console.log(data.a)
  }, 1000)
}

// 6. no - 不会触发[[GET]]操作，而是触发[[DELETE]]操作
function getter() {
  delete data.a
}

// 7. no - 不会触发[[GET]]操作，而是触发[[SET]]操作
function getter() {
  data.a = 1
}
```

#### 如何进行收集依赖

在`get`函数中将调用者`getter`函数添加到响应式数据对应的`Dep`实例的订阅列表中，之后在数据变化时，通知数据订阅列表中的所有订阅者进行更新操作即可。

但是响应式数据的变化除了属性值可能发生变化，还有新增、删除属性等情况。Vue 的响应式数据只包括**普通对象(Plain Object)**和**数组(Array)**类型，**基础类型**和**非普通对象**数据不是响应式的。

这两种响应式数据发生变化的情况如下：

1. 对象属性值变化 `data.prop = newValue`
1. 对象新增属性 `data.newProp = value`
1. 对象删除属性 `delete data.prop`
1. 数组元素变化 `data.array.[push/pop/shift/unshift/splice]`
1. 数组单个元素变化 `data.array[index] = newValue`
1. 数组长度变化 `data.array.length = newLength`

假设响应式数据`data`变量是 Plain Object 类型。

```js
const data = {
  obj: {
    value: 1,
  },
  num: 2,
}
```

自定义`data.a`的`get`函数对变量值整体发生变化的情况很容易进行依赖收集。

```js
function defineReactive(target, key, value) {
  const dep = new Dep()

  Object.defineProperty(target, key, {
    get() {
      // 添加当前的Watcher即可
      dep.addSub(Dep.target)
    },
    set(newValue) {
      // 遍历dep的订阅者通知更新即可
    },
  })
}
```

为了收集和正确触发 Plain Object 新增、删除属性的情况，Vue 在对象本身的属性`__ob__`绑定了一个`Observer`类实例，`Observer`类内部包含有一个`Dep`实例，所以依赖收集的效果是一样的。代码如下：

```js
function defineReactive(target, key, value) {
  const dep = new Dep()

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        // data.a值变化依赖收集
        dep.depend()
        if (childOb) {
          // data.a值新增、删除属性依赖收集
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set() {
      dep.notify()
    },
  })
}
```

注意`childOb`得到的就是`data.a.__ob__`，也会在`get`函数中进行依赖收集。

更改属性值的时候触发`set`函数即可通知属性变化，但是新增、删除属性的时候无法触发更新，原因如下。

1. 新增属性 - 新增加的属性尚未被改造其`set`函数，只是一个普通的属性，不会触发自定义的`set`函数。
1. 删除属性 - 触发的是`[[DELETE]]`操作而不是`[[SET]]`

因此 Vue 提供了两个函数`Vue.set`/`Vue.del`来添加、删除属性，从而正确触发更新。

但是为甚么要分开两个`dep`实例分别收集属性值变化和属性值新增、删除呢？只用其中一个能否实现所有变化的收集呢？

1. 第一个收集属性变化的`Dep`实例是`defineReactive`函数中的闭包变量，在`Vue.set`/`Vue.del`无法访问到，所以只用这个`Dep`实例是不行的。
1. 只用`data.a.__ob__`也不行，因为`data.a`的值可能是基本类型，这个时候没法添加`__ob__`属性。

即使`data.a`不是基本类型，也无法使用`data.a.__ob__`来对`data.a`的属性值变化进行依赖收集。因为属性变化收集的是`data.a`这个引用本身的变化行为，而`data.a.__ob__`收集的是`data.a`引用的值的属性的新增和删除。

#### 数组变化

数组的变化不仅包括单个元素的变化，还包括数组原型提供的插入删除元素的方法。

1. 数组元素变化 `data.array.[push/pop/shift/unshift/splice]`
1. 数组单个元素变化 `data.array[index] = newValue`
1. 数组长度变化 `data.array.length = newLength`

对于这些方法 Vue 提供了功能相同但是能正确触发依赖更新的版本，并根据数组对象是否有原型`__proto__`进行处理。

1. 有原型的话直接修改数组的原型上的相应方法，所有数组变量就都可以访问原型上的函数。
1. 没有原型的话，每个数组数据的方法被相应版本分别覆盖。

#### 递归实现

Vue 实例在初始化的时候会递归的把`data`对象改造为响应式数据。起点是`observe`函数。

```js
// observe data
observe(data, true /* asRootData */)
```

流程如下：

1. 为`data`对象本身添加`data.__ob__`
1. 调用`defineReactive`将`data`对象的每个属性改造为响应式。
1. 如果属性值同样是 Plain Object，递归调用`observe`进行改造。
1. 如果属性值是数组，使用`dependArray`对于每个数组元素调用调用`observe`进行改造。

其中`data.__ob__`是`Observer`类的实例。

另外依赖收集时，目标对象实际上用栈结构保存，当前的目标 Watcher 由静态变量`Dep.target`表示。原因在于一个`getter`函数在被调用收集依赖的过程中，可能调用其他的`getter`函数，一旦调用新的`getter`函数，当前的目标 Watcher 也应该切换成该函数对应的`Watcher`，并在其执行完毕后恢复之前的一个`Watcher`作为目标。

#### `Vue.set`新增属性

```js
set(target, key, value)
```

1. `target`已经有属性`key`，不论是否 reactive，直接设置。
1. `target`是数组，`key`是合法下标值，直接设置。
1. `Vue`实例和 reactive 的 data 对象不设置，直接返回。Vue 推荐把所有需要的属性在定义时直接写完整。
1. `target`本身不是 reactive 的话，直接设置即可
1. `target`本身是 reactive，且没有`key`，添加新的 reactive 属性，并通知相关`Watcher`

#### `Vue.del`对象删除属性

#### 无法检测的情况

1. 对象新增属性

   ```js
   // incorrect
   obj.newProp = value

   // correct
   Vue.set(obj, 'newProp', value)
   ```

1. 对象删除属性

   ```js
   // incorrect
   delete obj.prop

   // correct
   Vue.del(obj, 'prop')
   ```

1. 索引直接修改**数组**的某个元素，因为 Vue 并没有对将数组下表的`[[GET]]/[[SET]]`做劫持，这点区别于`Object`。

   ```js
   // incorrect
   array[index] = newValue

   // correct
   Vue.set(array, index, newValue)
   ```

1. 直接改变数组长度，原因同上。

   ```js
   // incorrect
   array.length = array.length + 1

   // correct
   array.splice(array.length, undefined)
   array.push(undefined)
   ```

## Watcher

Watcher 类包装了依赖收集收集函数`getter`和回调函数`cb`，在创建时会调用一次`getter`函数收集依赖，将 Watcher 添加到依赖的订阅列表中。依赖的响应式数据变化时，通知订阅列表中所有`Watcher`进行更新操作，即调用内部包装的回调函数。

Watcher 可分为两类：

1. 副作用 Watcher - 这种 Watcher 负责调用回调函数进行网络请求，更新数据等操作，不关心回调函数的返回值而关心函数执行产生的副作用。
1. 计算属性 Watcher - 计算属性是从若干个基本的响应式数据计算得到的复合值，计算属性 Watcher 代表了这个复合值，负责在响应式数据发生变化时，调用回调函数更新复合值。

### 副作用 Watcher

Vue 中的副作用 Watcher 一般是用来更新数据或者更新视图，按照是否立刻执行回调函数进行更新操作可以分成同步模式和异步模式。

Vue 的`watch`选项创建的回调函数和视图渲染函数都属于异步模式，考虑一个响应式数据短时间内发生多次变化的情况，如果视图更新函数是同步的，那么每次数据变换都会造成视图重新渲染；异步的视图更新函数可以等待多个副作用回调函数执行完，数据更新到最新状态后，然后调用一次视图更新函数即可，避免了不必要的重新渲染。

Vue 中的副作用 Watcher 都是异步模式`sync = false`，在依赖变化通知回调函数更新时，只是将回调函数放到一个回调函数数组里，然后在下次事件循环的时候异步触发，这也是 Vue 进行**异步 DOM 更新**的基本原理。参考[组件异步更新与 nextTick](./2-组件异步更新与nextTick.md)。

### 计算属性 Watcher

计算属性 Watcher 默认使用 lazy 模式，在数据变化被通知更新时，只是将 Watcher 标记为`dirty = true`表示计算属性值已经变化，需要重新计算。后续在计算属性值被再次用到时，才调用`evaluate`函数计算最新值，并标记`dirty = false`。

计算属性 Watcher 一方面依赖于其他的响应式数据，在数据变化时进行更新；另一方面也代表一个响应式数据，可以被其他 Watcher 依赖。

假设`SE`是副作用 Watcher，依赖计算属性 Watcher `C`，`C`又依赖响应式数据`R`。在如何处理`SE`与`R`的关系时有两种做法。

1. 我的附庸的附庸**不是**我的附庸 - `SE`只关心直接依赖`C`，而不关心`C`的依赖，依赖之间是一个树形结构。这样的好处是`R`发生变化时，`C`可能并不发生变化。比如实数域根据正负到 1, 0, -1 三个数的映射，因为`R`到`C`是多对一的关系，`R`变化了，`C`并不一定变化。或者存在多个`R`发生变化，但是作用相互抵消，最终`C`值不变的情况。这些情况下，`R`发生变化，但是`C`不变，所以`SE`此时不用更新。
1. 我的附庸的附庸**是**我的附庸 - `SE`依赖于`C`时，即`SE`的`getter`函数用到`C`，不把`C`添加做依赖，而是在`C`进行依赖收集后，把`C`的依赖`R`直接添加为`SE`的依赖。这样形成的是多个独立的依赖关系，每个 Watcher 都直接依赖于非计算属性的响应式数据。

显然第一种概念上更自然，性能上也相对较好。Vue 最开始使用的是第二种做法，在 2.5.11 版本中修改成了第一种做法，但是在后续的版本中不知道为什么这个修改被 revert 掉了，回归了第二种做法。

```js
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      // 计算属性更新
      if (watcher.dirty) {
        watcher.evaluate()
      }

      // 添加依赖关系
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}

// 1. 第一种做法
/**
  * Depend on this watcher. Only for computed property watchers.
  */
depend () {
  if (this.dep && Dep.target) {
    // 计算属性Watcher内有一个dep实例代表了本身可以做为依赖
    // 当前目标Watcher只收集这个依赖即可
    this.dep.depend()
  }
}

// 2. 第二种做法
/**
  * Depend on all deps collected by this watcher.
  */
depend () {
  let i = this.deps.length

  // 将计算属性Watcher的所有依赖dep收集为当前目标Watcher的依赖
  while (i--) {
    this.deps[i].depend()
  }
}

```

在第一种做法的情况下，可以把计算属性 Watcher 没有订阅者当做开启`lazy`模式的条件。如果没有任何订阅者，`lazy`模式只要标记 Watcher 为`dirty`即可，不需要立即更新计算属性值来触发数据变换通知订阅 Watcher 进行更新，因为此时没有任何订阅者关心这个数据的变化。

### 依赖变化

Watcher 的`getter`函数执行时进行依赖收集，如果`getter`函数中存在不同的分支流程，那么每次执行时收集到的依赖可能不同，这存在一个依赖更新的问题。依赖发生变化时需要把当前 Watcher 的依赖列表做更新，并且把该 Watcher 从旧的`Dep`实例订阅列表中删除，在新的`Dep`实例的订阅列表中添加。

Vue 的 Watcher 类的依赖收集函数`get`中在进行依赖收集后调用`cleanupDeps`函数为了进行依赖更新。

### Watch 选项

Vue 中的`watch`选项支持直接设置路径来生成`Watcher`实例，其实是把这个点分路径字符串进行解析后转换为了一个`getter`函数，返回结果是 Vue 实例的嵌套属性。代码如下：

```js
{
  watch: {
    'a.b.c': {
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {},
    },
    ['a.b']: handler(newValue, oldValue) {}
  }
}
```

其中支持配置值直接是一个回调函数`handler`或者是一个对象包含`deep`/`immediate`选项，`handler`字段的值是回调函数。默认情况下`deep`和`immediate`选项都是`false`。

`deep`选项是`true`时表示在该`Watcher`进行依赖收集时，需要对`getter`函数返回值，即这个嵌套属性`this.a.b.c`的值进行递归依赖收集，这样该`Watcher`不仅依赖于`this.a.b.c`，而且如果`this.a.b.c`的值是对象或者数组时还依赖于其下面每一层的值。

`Vue.$watch`函数是用来生成`Watcher`的内部和外部 API，`watch`选项的`Watcher`就是用这个函数生成。感觉上`deep`选项是专门为这种方式使用了，并不适用于其他的副作用 Watcher。

`immediate`选项比较简单，表示在组件创建阶段生成 Watcher 时立即调用一次回调函数，一般用来做一些初始化的工作，这个时机要早于`created`生命周期函数。

### 更新触发条件

对于非计算属性的响应式数据来说，只要数据发生了变化就应该通知相应的订阅者进行更新。但是对于计算属性来说，Vue 还设置了额外的触发条件。

```js
if (
  value !== this.value ||
  // Deep watchers and watchers on Object/Arrays should fire even
  // when the value is the same, because the value may
  // have mutated.
  isObject(value) ||
  this.deep
) {
  // trigger
}
```

1. 即使返回值不变，但如果返回值是对象或者数组的话，对象属性值或者数组的元素也可能发生了变化，此时也触发更新。
1. deep 选项为`true`，这是针对使用`Watch`选项创建的 Watcher。既然设置了`deep = true`，也就是说期待`this.a.b.c`值是对象或者数组，也可能存在对象或数组值不变，但是对象属性或者数组元素发生变化的情况，与第一种情况一样。

感觉上`this.deep`的判断条件是多余的，因为基础类型值和对象类型值变化的情况已经被前两个条件覆盖了。

1. `value !== this.value` - 基础类型值发生变化，或者`this.value`引用的对象发生了变化
1. `isObject(value)` - `this.value`引用的对象没变，但是对象内部的属性值发生了变化

## Proxy 实现响应式数据

ES6 提供了 Proxy API 来监听对象更多类型的变化。

```js
const p = new Proxy(data, prop, {
  get() {},
  set() {},
  has() {},
  deleteProperty() {},
})
```

TODO:

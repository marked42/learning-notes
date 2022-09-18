# Vue 响应式系统

Vue 2 / Vue3 响应式系统的区别

## 响应式代码是应该是什么样子

考虑一个简单的例子，下面是计算平均分数的一段代码，`average`函数从分数数组`score`中求得总和除以数组长度得到平均分数，然后输出。

```js
const scores = {
  tom: 0,
  jerry: 10,
  mickey: 100,
}

function reportAverageScore() {
  let sum = 0
  Object.value(scores).forEach((score) => {
    sum += scores[i]
  })

  console.log('average: ', sum / incomes.length)
}

// 输出平均分数
reportAverageScore()
```

假如新增一个分数导致`score`发生了变化，需要手动调用`reportAverageScore`重新输出分数。

```js
scores['niki'] = 50

reportAverageScore()
```

我们预期的响应式数据应该是什么用法

在数据读取的时机收集依赖，在数据写入中触发变动。

TODO: 需要一张图来表示这些概念的关系

数据
读
写
Effect

1. 哪些数据会发生变化，有哪些读操作，哪些写操作？
   1. 什么东西变动了？object.name TriggerOpType，如何记录这些变化
      1. 对象属性的 新增、删除、修改 trackOpType 主要用来做记录使用
      1. 数组、对象的遍历 数组的变动性操作，数组 length 修改
      1. 集合元素变化 变动性操作 clear
1. 变动是什么？抽象 数据变动 为依赖类 Dep，它有关联的副作用类 Effects

## 响应式对象

1. reactive 函数声明
   1. 对输入参数类型做限制
      1. 静态部分 函数重载 加上 类型约束
      1. 动态部分 运行时接受任何输入，检测类型对于非法参数`__DEV__`在开发模式下输出提示信息
   1. 每个对象对应改造为一个响应式的 Proxy 对象
      1. 对于同一个对象返回同一个 Proxy 对象
      1. 是
   1. 可观测对象类型
      1. COMMON Object/Array 数组 `arr.length = 1` 相当于更新对象属性，也会触发变化
      1. COLLECTION Map/Set/WeakSet/WeakMap
      1. INVALID SKIP || !IsExtensible
1. reactive raw 为何这样设计？
1. 对于对象特别大的场景，将整个对象递归的改造成响应式成本较高，希望能控制每个属性是否是响应式的。
1. 环境变量定义 **DEV** 区分开发环境和生产环境，开发环境提供更多的报错信息，生产环境通常默默失败

### 对象

Reactive 对象使用起来应该跟原来的对象行为一致，只多出来的响应式的特性。

行为一致

1. 拥有的属性相同，对应属性值也相同
1. in operator
1. Object.keys()
1. 不改变原型，`__proto__`

对于原对象的修改，应该反应到 Reactive 对象；对于 Reactive 对象的修改，应该应用到原始对象。

收集依赖
触发
几种类型的变化

1. 属性更新
1. 属性新增
1. 属性删除

依赖单个属性

```js
obj[prop]
obj.prop
prop in obj
```

依赖整体变化的情况

```js
// console.log('nums: ', Object.getOwnPropertySymbols(nums))
// console.log('nums: ', Object.getOwnPropertyNames(nums))
// console.log('nums: ', JSON.stringify(nums))
// 模板插值内部使用了JSON.stringify
// {{a}}
// toString 不是
// console.log('nums: ', nums.toString())
// for (let name in nums.tom) {
//   console.log('nums: ', name)
// }
// console.log('nums', Object.keys(nums.tom))
// console.log('nums', Object.entries(nums.tom))
```

### 数组

新增属性的问题，新增的属性之前没有被收集依赖，如何触发 effect？使用一个 key 表示集合整体，数组使用 length 属性

数组与对象的差异之处

1. 有 length 属性，length 属性和单个数组下标操作相关

数组属性

1. integer index
1. 已有
1. 新增
1. length 属性 set / delete
1. other

1. 其他用法

#### 数字下标

#### length

// for-in 使用了 Object.keys，没有使用 length 属性，也没有使用单个元素值
// for-of 的语法隐式遍历所有元素，隐式的使用了 length 属性和每一个元素

```js
// in 语法触发 has trap，收集单个属性 name
'name' in obj
```

```js
// 隐式的访问了 length 属性，所以不用手动收集 track(arr, TrackOpTypes.GET, 'length')
// 但是这几个函数可能不会访问所有元素，所以依赖收集会遗漏，这里保证收集所有元素
  ;(['includes', 'indexOf', 'lastIndexOf'] as const).forEach(key => {
    instrumentations[key] = function (this: unknown[], ...args: unknown[]) {
      const arr = toRaw(this) as any
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, TrackOpTypes.GET, i + '')
      }
      // we run the method using the original args first (which may be reactive)
      const res = arr[key](...args)
      if (res === -1 || res === false) {
        // if that didn't work, run it again using raw values.
        return arr[key](...args.map(toRaw))
      } else {
        return res
      }
    }
  })
```

```js
// 单个元素值发生变化时，for in 不会变化，所以只收集 length作为依赖即可
// for in 用法触发ownKeys trap，在这里收集即可
let key = ''
for (const name in array) {
  key += name
}

// 不触发变化
array[1] = '1'
// 触发变化
array[3] = '1'
// 触发变化
array['string'] = '1'
```

```js
// 这种方法也会触发收集每个下标
let values = ''
for (const name in array) {
  // array[name]
  values += array[name]
}
```

```js
// 这种用法隐式的访问 length 属性和每个下标元素
let values = ''
for (const value of array) {
  // array[name]
  values += value
}
```

数组的 length 不能被删除，只能 SET

#### 稀疏数组

empty-slot 数组

#### 其余属性

数组的其余属性处理跟普通对象相同，但是属性的新增、删除不会触发对象整体变化，因为这个变化已经使用了 length 代表

#### 普通数组方法

以 Array.prototype.at(0) 方法为例分析调用流程，proxy 对象会被保持，所以 正常触发下标 0 的依赖收集，这个函数不需要特殊处理

#### identity-sensitive 方法

#### 变动性方法

终止依赖收集，手动触发，避免循环

副作用函数中包含 push

push 方法访问了 length 属性，又触发数组 length 变化，如果允许 push 方法进行依赖收集，触发的 length 变化会造成 push 被递归调用

这里又两个点造成递归调用死循环

1. 允许 push 触发依赖收集
1. 允许了当前副作用函数执行时，再次触发自身

上面两个条件任意禁用一个即可避免递归死循环

Vue 的设计中 reverse 函数为甚么不是变动性方法，没有被禁用依赖收集？

但是用户代码中可能编写相同的逻辑，这种情况如何处理。

即使副作用函数不允许触发自身，还是可能通过间接方式递归调用自己

处理这个

```js
const { watchEffect, reactive } = Vue

const arr = reactive([])

watchEffect(() => {
  arr.push(1)
})

watchEffect(() => {
  arr.push(2)
})
```

### 集合

能否抽象出统一的机制表示上面的过程

## 副作用函数（effect）

函数运行时收集依赖，依赖变化时触发函数，或者 scheduler

scheduler 机制

1. 实现依赖收集和触发分离
1. 触发时机调度 sync/pre/post
1. 其他自定义 CustomRef

```ts
watch(source, callback)
```

1. Effect 问题，抽象了一个函数表示的副作用
   1. Effect 可能嵌套，触发函数时又注册其他 Effect，所以存在一个 parent->child 关系
      1. 可能存在死循环，Effect 的副作用函数触发时又注册副作用函数
   1. 变动之后触发了什么？Effect

## Ref

1. oldValue/rawValue 为什么

[Array ref unwrapping](https://github.com/vuejs/core/issues/737)

ObjectRef

1. 判断参数是 Ref 时，直接返回原始参数
1. Ref 接受对象参数时是否递归的改造数据为响应式 ref/shallowRef
1. 如何判断一个值是 Ref，使用标志位，private and readonly
1. shallowRef
   1. 不对对象递归改造为响应式，性能问题
   1. shallowRef 导致修改底层数据不会触发 effects，需要 triggerRef 手动触发
1. 如何给 ref 函数添加合适的类型声明

   1. 函数声明重载
   1. 类型 assert/is
   1. 递归类型

isRef

### customRef

1. 自定义 track 和 trigger 时机

shallowRef/triggerRef/shallowReadonly/shallowReactive

### toRef/proxyRef/toRefs

## ref unwrapping

[unwrapping](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#ref-unwrapping-in-templates)

## 计算数据

异步 computed

1. 副作用触发时 顺序问题 computed 然后 !computed

1. 计算属性的实现
1. computed 只读 getter/setter lazy 惰性计算 更新问题
1. cache
1. writable method
1. computed 使用 effect 实现，应该在先于其他 effect 更新，这样在其他 effect 中得到的 computed 是新的
1. deferredComputed 回调时机 如果同步访问标记为 dirty
1. 数据多次修改，computed 值发生变化才重新触发计算
1. computed 组合使用，顺序问题，目的是尽量减少计算

## 副作用作用域（EffectScope）

1. EffectScope 的问题

   1. https://vuejs.org/api/reactivity-advanced.html#effectscope
   1. https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md
   1. active 标记是否活跃
   1. 支持嵌套 effectScope，嵌套的销毁 类似作用域的机制
   1. Effect 是一种资源，支持手动控制产生与销毁的机制，detached 控制是否自动销毁

1. https://vuejs.org/api/reactivity-advanced.html#effectscope
1. https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md

## readonly

## shallow

external

## reactivity transform

[Reactivity Transform](https://vuejs.org/guide/extras/reactivity-transform.html)

## 闭包运用

运用闭包的封闭性，其他代码无法获取闭包变量

```js
const ref = Symbol()

let inIsRef = false

const obj = Object.defineProperty(obj, '__v_ref', {
  get() {
    return inIsRef ? mark : void 0
  },
})

function isRef(obj) {
  inIsRef = true
  const value = obj.__v_ref === ref
  inIsRef = false
  return value
}
```

## Other

数组的构造函数
Array
new Array()
new Array(length) 0 ~ 32 sparse-array
Object.keys(array) 不返回 empty slot 对应的 key
mapforEach respects [sparse array](https:developer.mozilla.orgen-USdocsWebJavaScriptGuideIndexed_collections#sparse_arrays)
findIndex 仍然访问 empty slot
for-of 语法 iteration protocol 和 spread 等新的语法
Array.from({ length: 31 }) 不是 sparse 的默认值是 undefined
anti-pattern .map 函数的返回值没有被使用的话，推荐用 .forEach TODO: eslint-rule

property-accessor a.b 如何触发 proxy 的 get handler 和 getter method 的
delete property / set property

## 参考

1. Vue Docs
1. [Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
1. [Reactivity In Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)

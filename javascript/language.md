# 深入理解 Javascript 语言

## 值与类型

基础值 Primitive Type/Object

1. string, `typeof 'hello' === 'string'`
1. number, `typeof 1.0 === 'number'`
1. boolean, `typeof true === 'boolean'`
1. null, `typeof null === 'object'`
1. undefined, `typeof undefined === 'undefined'`
1. symbol (ES6), `typeof Symbol() === 'symbol'`
1. object, `typeof {a: 1} === 'object'`

使用 Object.prototype.toString.call

Notice that, value `null` if of type `null`, but `typeof null` returns 'object',
this is an bug because of implementation （TODO: 以具体的引擎实现例子来解释）

对象 是 一组属性 (properties) 和 一个原型属性 （`__proto__` 已被标准化） 的组合。

运行时（run time）访问一个对象上属性 x 的过程称为动态派发 dynamic dispatch 和 基于类的面向对象语言中调用需函数效果相同

原型链，需要一个完整的原型链例子，包含原型链的根部，Function.prototype Object.prototype 等。

1. 值与对象 原型链 new Test() new 函数调用 obj.**proto** -> Test.prototype 隐藏属性使用，不建议使用**proto** 非标准，性能问题

### delete 操作符的含义

1.  [ECMA-262-5 in detail. Chapter 1. Properties and Property Descriptors.](http://dmitrysoshnikov.com/ecmascript/es5-chapter-1-properties-and-property-descriptors/)

### 类型转换

1. 什么时候发生类型转换
1. 转换具体过程如何 ToPrimitive
1. 显式的类型转换写法
1. [what is {} + {}](https://2ality.com/2012/01/object-plus-object.html)

```js
Number('1')
!1
;+new Date()
void 0
Boolean({}) // true

typeof a === undefined
```

1. 臭名昭著的 Javascript 真值表
1. 一个面试题 valueOf, toString [a == 1 && a == 2 && a == 3](https://stackoverflow.com/questions/48270127/can-a-1-a-2-a-3-ever-evaluate-to-true)

### 相等性判断

1. `==`
1. `===` https://tc39.es/ecma262/#sec-strict-equality-comparison
1. `Object.is` https://tc39.es/ecma262/#sec-samevalue

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness

## 运行环境与作用域

1. 作用域链
1. Execution Context global、function、module，eval，new Function
1. 全局作用域，使用变量可以访问全局对象上的属性，或者 global/window/globalThis 访问全局对象本身。
1. VariableObject 是 ES5 之前的说法，全局作用域对象，ActionObject 代表函数作用域对象，ES6 中被 LexicalEnvironment 概念代替。
1. 函数作用域内特殊变量 arguments arguments 变量是拷贝还是引用，函数调用前准备 Lexical Environment，形参和 arguments 变量。 有哪些要处理 变量声明 var / let / const /FunctionDeclaration/ arguments / this / super / ClassDeclaration
1. 函数表达式可以匿名，不添加对应变量，但是有名称的函数表达式内可以使用名称形成递归调用。类表达式
1. 名称是否允许重复，那个具有更高优先级？ var / function 允许 / let / const
1. 函数调用分成两步 准备调用环境，执行函数代码。
1. var a = 1 声明了变量 a; 和 a = 1 只是隐式的在全局对象上增加了属性 a，没有声明变量。区别的例子。

```js
alert(a) // undefined
alert(b) // "b" is not defined

b = 10
var a = 20
```

EnvironmentRecord 类型

1. ObjectEnvironmentRecord global/with/ function expression
1. DeclarativeEnvironmentRecord
1. FunctionEnvironmentRecord
1. ModuleEnvironmentRecord

两个过程的细节

1. Identifier Resolution
1. 属性访问

### 变量与作用域

读写未声明的变量会隐式的在全局作用域创建该变量，使用严格模式禁用这种情况。

1. var 声明的变量是 VariableEnvironment
1. let/const 声明的变量是 LexicalEnvironment

```js
// var 声明的变量不能删除
var a = 1
delete a

// 隐式声明的变量可以被删除
x = 1
delete x

// eval中的var可以删除
eval('var b = 2')
delete b

new Function('var a = 1')
```

变量与作用域的问题

1. 变量编译时生成还是运行时生成
1. 变量是否可以读取、修改、删除
1. 可见性问题

连续复制形式，给变量值增加一个执行新变量的属性

```js
var a = { n: 1 },
  ref = a
a.x = a = { n: 2 }
console.log(a.x) // --> undefined
console.log(ref.x) // {n:2}
```

```js
;(function out() {
  var a = 'out'

  function test() {
    console.log(a)

    while (false) {
      var a = 'in'
    }
  }
  test()
})()
```

静态作用域 函数作为参数 downwards funarg problem

```js
let x = 10

function foo() {
  console.log(x)
}

function bar(funArg) {
  let x = 20
  funArg() // 10, not 20!
}

// Pass `foo` as an argument to `bar`.
bar(foo)
```

upwards funarg problem

```js
function foo() {
  let x = 10

  // Closure, capturing environment of `foo`.
  function bar() {
    return x
  }

  // Upward funarg.
  return bar
}

let x = 20

// Call to `foo` returns `bar` closure.
let bar = foo()

bar() // 10, not 20!
```

nonlocal variable
自由变量（free variable）指被嵌套函数捕获并且嵌套函数返回的情况下生命周期需要延长的变量，函数执行环境销毁时自由变量需要继续存在。

简单的实现可以保存执行环境中的所有变量，准确的的实现是指捕获自由变量。

#### 语句的块级作用域

```js
// 一些简单的、显而易见的块级作用域包括：

// 例1
try {
  // 作用域1
}
catch (e) { // 表达式e位于作用域2
  // 作用域2
}
finally {
  // 作用域3
}

// 例2
//（注：没有使用大括号）
with (x) /* 作用域1 */; // <- 这里存在一个块级作用域

for (let a = 1; ;) {}

for (let x = 102; x < 105; x++)
  let x = 200;
```

也就是说，如果循环体（单个语句）允许支持新的变量声明，那么为了避免它影响到循环变量，就必须为它再提供另一个块级作用域。很有趣的是，在这里，JavaScript 是不允许声明新的变量的。上述的示例会抛出一个异常，提示你“单语句不支持词法声明”：

SyntaxError: Lexical declaration cannot appear in a single-statement context

for 循环的代价
在 JavaScript 的具体执行过程中，作用域是被作为环境的上下文来创建的。如果将 for 语句的块级作用域称为 forEnv，并将上述为循环体增加的作用域称为 loopEnv，那么 loopEnv 它的外部环境就指向 forEnv。

于是在 loopEnv 看来，变量 i 其实是登记在父级作用域 forEnv 中，并且 loopEnv 只能使用它作为名字“i”的一个引用。更准确地说，在 loopEnv 中访问变量 i，在本质上就是通过环境链回溯来查找标识符（Resolve identifier, or Get Identifier Reference）。

上面的矛盾“貌似”被解决了，但是想想程序员可以在每次迭代中做的事情，这个解决方案的结果就显得并不那么乐观了。例如：

for (let i in x)
setTimeout(()=>console.log(i), 1000);
这个例子创建了一些定时器。当定时器被触发时，函数会通过它的闭包（这些闭包处于 loopEnv 的子级环境中）来回溯，并试图再次找到那个标识符 i。然而，当定时器触发时，整个 for 迭代有可能都已经结束了。这种情况下，要么上面的 forEnv 已经没有了、被销毁了，要么它即使存在，那个 i 的值也已经变成了最后一次迭代的终值。

所以，要想使上面的代码符合预期，这个 loopEnv 就必须是“随每次迭代变化的”。也就是说，需要为每次迭代都创建一个新的作用域副本，这称为迭代环境（iterationEnv)。因此，每次迭代在实际上都并不是运行在 loopEnv 中，而是运行在该次迭代自有的 iterationEnv 中。

也就是说，在语法上这里只需要两个“块级作用域”，而实际运行时却需要为其中的第二个块级作用域创建无数个副本。

这就是 for 语句中使用“let/const”这种块级作用域声明所需要付出的代价。

### Realm

Spec 8.2 Code Realm

Realm: A code realm is an object which encapsulates a separate global environment.

a direct realm equivalent in browser environment is the iframe element, which exactly provides a custom global environment. In Node.js it is close to the sandbox of the vm module.

### 作用域

### This

1.  [This 带来的困惑](https://zhuanlan.zhihu.com/p/27536677)

## 函数

## 类

为什么引入类语法？为了解决多个对象都要使用同一个对象作为原型的情况，没有类的情况下需要手动模拟，配置原型链。
类是个语法糖，具体都做了哪些处理？使用 构造函数加上原型实现。 TODO: 需要细节

## 异步

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

### jobs

1.  spec 8.4 jobs & jobs queues

Jobs are enqueued on the job queues, and in current spec version there are two job queues: ScriptJobs, and PromiseJobs.

And initial job on the ScriptJobs queue is the main entry point to our program — initial script which is loaded and evaluated: a realm is created, a global context is created and is associated with this realm, it’s pushed onto the stack, and the global code is executed.

Notice, the ScriptJobs queue manages both, scripts and modules.

event loop https://gist.github.com/DmitrySoshnikov/26e54990e7df8c3ae7e6e149c87883e4

## 模块机制

### Export

```
// 这里的语法是 export default FunctionDeclaration，不是匿名函数表达式
export default function {}

// 对象属性绑定类似
var obj = {
  "default": function() {}
};
console.log(obj.default.name); // "default"

// 导出的名称在lexicalEnvironment中，而不是variableEnvironment
export var a = 1;
```

对应规范 15.2.3.2，这里存在副作用，如果 HoistableDeclaration 没有"default"则添加

ExportDeclaration : export default HoistableDeclaration

1. Let declarationNames be the BoundNames of HoistableDeclaration.
2. If declarationNames does not include the element "_default_", append "_default_" to
   declarationNames.
3. Return declarationNames.

## 严格模式

## 内置对象

数组

Avoid using sparse array.

```javascript
let a = new Array(1, 2, 3)
a // [1, 2, 3]

let b = new Array(3) // single parameter 3, no slots
b.length // 3

let c = Array.apply(null, { length: 3 }) // 3 slots with value as undefined

let c = [undefined, undefined, undefined]
```

### Number 精度问题

1.  浮点数 https://zhuanlan.zhihu.com/p/30703042
1.  [浮点精度](https://zhuanlan.zhihu.com/p/28162086)
1.  [为什么(2.55).toFixed(1)等于 2.5？](https://zhuanlan.zhihu.com/p/31202697)
1.  [浮点数精度之谜](https://zhuanlan.zhihu.com/p/28162086)

### Proxy & Reflect

1.  [Proxy & Reflect](https://zhuanlan.zhihu.com/p/60126477)
1.  [抱歉，学会 Proxy 真的可以为所欲为](https://zhuanlan.zhihu.com/p/35080324)

### RegExp

1. [JavaScript 正则表达式匹配汉字](https://zhuanlan.zhihu.com/p/33335629)

## Performance

1.  [JS 性能](https://www.zhihu.com/question/402807137/answer/1322391162)
1.  [Maybe you don't need Rust and WASM to speed up your JS](https://mrale.ph/blog/2018/02/03/maybe-you-dont-need-rust-to-speed-up-your-js.html)

## VM

1.  [microtask 队列与 async/await 源码分析](https://zhuanlan.zhihu.com/p/134647506)
1.  [Promise V8 源码分析(一)](https://zhuanlan.zhihu.com/p/264944183)

## 参考资料

_文章_

1. [JavaScript. The Core: 2nd Edition](http://dmitrysoshnikov.com/ecmascript/javascript-the-core-2nd-edition/)
1. Understanding ECMAScript [Part 1](https://v8.dev/blog/understanding-ecmascript-part-1) [Part 2](https://v8.dev/blog/understanding-ecmascript-part-2) [Part 3](https://v8.dev/blog/understanding-ecmascript-part-3) [Part 4](https://v8.dev/blog/understanding-ecmascript-part-4)
1. [ECMAScript 规范阅读导引] [Part 1](https://fed.taobao.org/blog/taofed/do71ct/mlgtox) [Part 2](https://zhuanlan.zhihu.com/p/118140237)
1. [How to Read the ECMAScript Specification](https://timothygu.me/es-howto/)
1. [ES6 规范](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/)

_教程与书籍_

1. You Don't Know JS
1. Understanding Javascript 6
1. Secrets of the Effective Javascript
1. Effective Javascript
1. Javascript The Good Parts
1. Eloquent Javascript
1. Javascript Twenty Years https://cn.history.js.org/
1. Javascript Design Patterns
1. Functional Javascript
1. https://zh.javascript.info/
1. Javascript 核心原理解析 周爱民

_其他_

1. [The Quiz](http://dmitrysoshnikov.com/ecmascript/the-quiz/)
1. [JavaScript 是如何工作的：JavaScript 的内存模型](https://zhuanlan.zhihu.com/p/62449359)
1. http://crockford.com/javascript/
1. https://www.iteye.com/category/22618
1. 实现类似 Javascript 语言脚本 [Essentials of Interpretation](http://dmitrysoshnikov.com/courses/essentials-of-interpretation/)

1. [深入 javascript](https://juejin.im/post/59278e312f301e006c2e1510)
1. [关于 JavaScript Object.keys() 排序问题的探索](https://mp.weixin.qq.com/s/foXbAj3ODqFKYGUP5K8MkQ)
1. [especially](https://www.npmjs.com/package/especially)

People

1.  [mraleph](https://mrale.ph/)
1.  [颜海镜](https://www.zhihu.com/column/yanhaijing)

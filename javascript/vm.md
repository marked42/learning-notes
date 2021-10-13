# VM

## 执行模型

1. 堆和栈
1. 基于栈的基础漆
1. 基于堆的寄存器

## 主流的实现

parsers & engines

1. v8
1. babel/[babylon](https://github.com/babel/babylon)
1. typescript
1. esprima
1. acorn/[acorn-jsx](https://github.com/acornjs/acorn-jsx)
1. eslint
1. prettier
1. https://github.com/v8/v8/blob/6.4.286/src/parsing/scanner.cc
1. https://github.com/mozilla/narcissus/
1. https://github.com/doodlewind/minimal-js-runtime
1. https://ming1016.github.io/2018/04/21/deeply-analyse-javascriptcore/
1. https://ming1016.github.io/2021/02/21/deeply-analyse-quickjs/
1. https://blog.fundebug.com/2019/06/18/arrow-function-this/

### V8

https://github.com/v8/v8/blob/master/src/interpreter/bytecodes.h

### 安装

下载与编译 V8 depot_tools

### 对象属性访问设计

对象属性设计

ECMAScript 规定数字属性按照索引值大小升序排列，字符串属性根据创建时顺序排列。

排序属性 elements, 常规属性 properties

快属性、线性数据结构
慢属性、非线性数据结构

#### 隐藏类

1. 为每个新建创建一个隐藏类记录对象布局,具有相同形状的对象可以共用同一个隐藏类，对象的第一个属性指针指向其隐藏类（称为 map）。
1. 对象形状改变（删除、添加属性、属性类型变化）后更新隐藏类

```js
// 顺序不同隐藏类不同
let point1 = { x: 100, y: 200 }
let point2 = { y: 100, x: 200 }

// 一次初始化完整对象属性
// 尽量不使用delete删除对象属性
```

1. [Hidden Class](http://richardartoul.github.io/jekyll/update/2015/04/26/hidden-classes.html)
1. [Franziska Hinkelmann- JavaScript engines - how do they even? - JSConf EU](https://www.bilibili.com/video/BV1oJ411J7kD)
1. [Franziska Hinkelmann- A Trip to the Zoo- SpiderMonkey, SquirrelFish, Nashorn, V8](https://www.bilibili.com/video/BV1oJ411J7z8)

### 内联缓存

## 特性实现参考

1. [Javascript Hidden Classes and Inline Caching in V8](http://richardartoul.github.io/jekyll/update/2015/04/26/hidden-classes.html)
1. [Javascript Mozilla](https://hacks.mozilla.org/category/javascript/)
1. [SpiderMonkey](https://hacks.mozilla.org/2020/06/compiler-compiler-working-on-a-javascript-engine/)
1. [A New Regexp Engine in SpiderMonkey](https://hacks.mozilla.org/2020/06/a-new-regexp-engine-in-spidermonkey/)

## AST 设计

[Esprima](https://docs.esprima.org/en/latest/syntax-tree-format.html) 使用 [ESTree specification](https://github.com/estree/estree)

考虑四个点

1. Backward compatible
1. Contextless
1. Unique
1. Extensible

[Babel](https://babeljs.io/docs/en/babel-parser#output)使用 [Babel AST format](https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md)，基于 ESTree Spec 做了一些修改

## AST Interpreter

1. https://github.com/axetroy/vm.js
1. https://github.com/bramblex/jsjs

## JSX 语法

[JSX AST](https://github.com/facebook/jsx)

## 运行环境

全局环境、Exotic Object 宿主环境

## 事件循环

v8 采用事件循环机制在主线程执行 JS 代码

宏任务、微任务、和栈溢出

1. 微任务队列，微任务检查点 check point
1. 宏任务队列，一个宏任务执行完成后进入微任务检查点

## 垃圾回收

garbage collection

1. mark sweep
1. parallel
1. tri-color mark
1. incremental
1. concurrent

## Lazy Parsing

闭包机制与懒解析策略，预解析器

## 闭包

1.  https://mrale.ph/blog/2012/09/23/grokking-v8-closures-for-fun.html
1.  https://blog.mozilla.org/luke/2012/10/02/optimizing-javascript-variable-access/
1.  the implementation of lua 5.0

## v8

- [ ] [深入 V8 引擎-第 01 课：上手开始看 V8 Ignition 解释器的字节码（Bytecodes）](https://www.bilibili.com/video/BV1FJ411E7Sf)
- [ ] [v8 引擎是如何知道 js 数据类型的？](https://www.zhihu.com/question/62732293/answer/201723301)
- [ ] [如何在 V8 源码里找到某个 JS 方法是如何实现的？](https://www.zhihu.com/question/59792274/answer/168987086)
- [ ] [从 Chrome 源码看 JS Array 的实现](https://zhuanlan.zhihu.com/p/26388217)
- [ ] [lazy parsing](https://zhuanlan.zhihu.com/p/63326335)
- [ ] [理解 V8 的字节码「译」](https://zhuanlan.zhihu.com/p/28590489)
- [ ] [JS 在引擎级别的执行过程@周爱民](https://www.bilibili.com/video/BV1Wy4y1b7PG)
- [ ] 新手上路学习 JavaScript 引擎实现——路线图 https://zhuanlan.zhihu.com/p/20505562
- [ ] [新手应该如何读 Google V8 引擎源代码？](https://www.zhihu.com/question/39014659)
- [ ] [JavaScript engine fundamentals: Shapes and Inline Caches](https://mathiasbynens.be/notes/shapes-ics)
- [ ] [JavaScript engine fundamentals: optimizing prototypes](https://mathiasbynens.be/notes/prototypes)
- [ ] [解读 V8 GC Log（二）: 堆内外内存的划分与 GC 算法](https://developer.aliyun.com/article/592880)

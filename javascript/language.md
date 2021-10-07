# 深入理解 Javascript 语言

以 ES6 规范文本为依据，对 Javascript 语言的特性进行剖析。

1. [JavaScript. The Core: 2nd Edition](http://dmitrysoshnikov.com/ecmascript/javascript-the-core-2nd-edition/)

## 词法与语法

1. Javascript 脚本运行模型

## 值与对象

### delete 操作符的含义

1.  [ECMA-262-5 in detail. Chapter 1. Properties and Property Descriptors.](http://dmitrysoshnikov.com/ecmascript/es5-chapter-1-properties-and-property-descriptors/)

## 运行环境与作用域

1. 值与对象 原型链 new Test() new 函数调用 obj.**proto** -> Test.prototype 隐藏属性使用，不建议使用**proto** 非标准，性能问题
1. 作用域链
1. Execution Context 全局、函数、模块，eval，new Function

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

1.  [ECMA-262-5 in detail. Chapter 3.1. Lexical environments: Common Theory](http://dmitrysoshnikov.com/ecmascript/es5-chapter-3-1-lexical-environments-common-theory/#rules-of-function-creation-and-application)
1.  [ECMA-262-5 in detail. Chapter 3.2. Lexical environments: ECMAScript implementation.](http://dmitrysoshnikov.com/ecmascript/es5-chapter-3-2-lexical-environments-ecmascript-implementation/#identifier-resolution)
1.  Chapter 8 Executable Code and Execution Context
1.  Chapter 18 Global Object
1.  Chapter 19 Fundamental Objects

## 函数

函数\ 闭包

1.  [ECMA-262-3 in detail. Chapter 3. This](http://dmitrysoshnikov.com/ecmascript/chapter-3-this/)
1.  [ECMA-262-3 in detail. Chapter 4. Scope chain](http://dmitrysoshnikov.com/ecmascript/chapter-4-scope-chain/)

1.  [ECMA-262-3 in detail. Chapter 5. Functions.](http://dmitrysoshnikov.com/ecmascript/chapter-5-functions/)
1.  [ECMA-262-3 in detail. Chapter 6. Closures.](http://dmitrysoshnikov.com/ecmascript/chapter-6-closures/)
1.  [ECMA-262-3 in detail. Chapter 7.1. OOP: The general theory](http://dmitrysoshnikov.com/ecmascript/chapter-7-1-oop-general-theory/)
1.  [ECMA-262-3 in detail. Chapter 7.2. OOP: ECMAScript implementation.](http://dmitrysoshnikov.com/ecmascript/chapter-7-2-oop-ecmascript-implementation/)

1.  [ECMA-262-3 in detail. Chapter 8. Evaluation strategy](http://dmitrysoshnikov.com/ecmascript/chapter-8-evaluation-strategy/)

1.  [Note 6. ES6: Default values of parameters](http://dmitrysoshnikov.com/ecmascript/es6-notes-default-values-of-parameters/)

## 类

1. [OO Relationships](https://medium.com/@DmitrySoshnikov/oo-relationships-5020163ab162)

## 异步

    1.  call back
    1.  Promise
    1.  generator function 协程的概念 函数暂停与恢复执行、 co 框架
    1.  async/await

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

1. [ECMA-262-5 in detail. Chapter 2. Strict Mode.](http://dmitrysoshnikov.com/ecmascript/es5-chapter-2-strict-mode/)

## 内置对象

1.  [JavaScript Array “Extras” in Detail](https://dev.opera.com/articles/javascript-array-extras-in-detail/)

## 参考资料

_文章_

1. Understanding ECMAScript [Part 1](https://v8.dev/blog/understanding-ecmascript-part-1) [Part 2](https://v8.dev/blog/understanding-ecmascript-part-2) [Part 3](https://v8.dev/blog/understanding-ecmascript-part-3) [Part 4](https://v8.dev/blog/understanding-ecmascript-part-4)
1. [ECMAScript 规范阅读导引] [Part 1](https://fed.taobao.org/blog/taofed/do71ct/mlgtox) [Part 1](https://zhuanlan.zhihu.com/p/117308655) [Part 2](https://zhuanlan.zhihu.com/p/118140237)
1. [How to Read the ECMAScript Specification](https://timothygu.me/es-howto/)
1. [ES6 规范](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/)

_教程与书籍_

1. Understanding Javascript 6
1. ES 6 For Humans
1. ES 6 标准入门 第二版
1. Javascript Ninja
1. Secrets of the Effective Javascript
1. You Don't Know JS
1. Effective Javascript
1. Javascript The Good Parts
1. Eloquent Javascript
1. Javascript Twenty Years
1. Javascript 核心原理解析 周爱民
1. Javascript Design Patterns
1. Functional Javascript
1. https://zh.javascript.info/

_其他_

1. [The Quiz](http://dmitrysoshnikov.com/ecmascript/the-quiz/)
1. [JavaScript 是如何工作的：JavaScript 的内存模型](https://zhuanlan.zhihu.com/p/62449359)
1. http://crockford.com/javascript/
1. https://www.iteye.com/category/22618
1. 实现类似 Javascript 语言脚本 [Essentials of Interpretation](http://dmitrysoshnikov.com/courses/essentials-of-interpretation/)

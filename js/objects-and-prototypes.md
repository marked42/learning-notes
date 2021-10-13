# 对象与原型

## 原型链

原型链的完整关系图

```js
Object.getPrototypeOf
Function.prototype
Object.prototype

function Person() {}

const person = new Person()

Person.prototype

a.__proto__
```

对象属性沿着原型链查找的过程

## 对象属性

属性的配置 Property Descriptors

1. enumerable/writable/configurable/getter/setter

1. in operator
1. for of
1. instance of
1. 对象属性访问 字符串、数字、symbol

configurable 从 false 设置为 true 后不能再重新设置为 false
configurable 为 true 时，writable 可以任意设置，
为 false 时 writable 可以从 true 到 false，
限制 delete operator

1. preventExtension
1. seal
1. freeze
1. [[Get]] / [[Put]] / [[Prototype]]

## 使用原型链模拟类

```js
function Person() {}
Person.prototype.dance = function () {}

function Ninja() {}
Ninja.prototype = new Person()

Object.defineProperty(Ninja.prototype, 'constructor', {
  enumerable: false,
  value: Ninja,
  writable: true,
})
```

TODO: 查看 Typescript 生成的辅助函数 inherits ?

## 类型转换

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

隐式类型转换

1. 基础值的自动装箱/拆箱
1. ToPrimitive
1. valueOf
1. toString

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

## delete 操作符的含义

1.  [ECMA-262-5 in detail. Chapter 1. Properties and Property Descriptors.](http://dmitrysoshnikov.com/ecmascript/es5-chapter-1-properties-and-property-descriptors/)

## 相等性判断

1. `==`
1. `===` https://tc39.es/ecma262/#sec-strict-equality-comparison
1. `Object.is` https://tc39.es/ecma262/#sec-samevalue

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness

从严格性来讲

SameValueZero

Abstract Equal < StrictEqual < SameValue

SameValue 和 StrictEqual 关于 NaN 和 signed zero 处理不同。

## delete

1. 严格模式下的静态语义 delete a 报错
1. 删除值的时候返回 true，无任何副作用
1. 只能删除 PropertyReference，而且 configurable 为 false 时报错 super.name 不能删除 ReferenceError
1. strict reference
1. EnvironmentRecord 中调用 DeleteBinding 方法

## 全局环境

VarNames 隐式创建的全局属性变量可以删除，var/let/const 不能删除。

绑定的相关问题

绑定的状态 不存在 -> 声明 —> 初始化 -> 只读

1. 声明 重复声明问题
1. 初始化
1. 读取 读取未初始化的绑定
1. 写入 写入未初始化的绑定、写入只读的绑定
1. 删除

例子分析

```js
// 发生了什么
var x = (y = 100)

// 分析
// 意味着给旧的变量添加一个指向新变量的属性。
var a = { n: 1 }
a.x = a = { n: 2 }
alert(a.x) // --> undefined

// with的隐式泄露到全局对象
with ((obj = {})) {
  y = 100
}
```

函数名称的确定，匿名函数绑定到标识符时，name 属性初始化为标识符名称，且后续保持不变。

```js
export default function test() {}
export default function () {}

const fun1 = function test() {}
const fun2 = function () {}
const fun3 = () => {}

const obj = {
  left1: function test() {},
  left2: function () {},
  left3: () => {},
}
```

块级作用域，大多数语句没有块级作用域，块级作用域的四个情况

1. try try/catch/finally
1. with statement with (x) {}
1. block statement {}
1. for of statement

```js
// i全局一个 forEnv
for (let i = 0; i; ;) {
  // loopEnv
  // 每个循环一个
  let j = 0;
}

// 每个循环一个
for (let i of values) {
  let j = 0;
}
```

switch statement 没有全局作用域，所以在其中声明变量会提示报错。

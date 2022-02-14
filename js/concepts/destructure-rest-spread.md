# 解构与展开（Destructuring & Spread）

1. 解决什么问题？

## 使用位置

[解构赋值（Destructuring Assignment）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)和解构绑定（Destructuring Binding）

1. 结构赋值使用的位置 VariableDeclarator / AssignmentExpression
1. 函数声明参数位置 不需要用户记忆参数的顺序
1. for of 循环中

解构赋值，不是变量声明语句时，变量必须存在

```js
// Syntax error
{ blowUp } = { blowUp: 10 };

// valid 没有分号？
{ blowUp } = { blowUp: 10 }

// 解构赋值形式的语法陷阱，直接使用花括号对会被识别为块语句，可以使用括号对包裹，强制为表达式
let prop;
assert.throws(
  () => eval("{prop} = { prop: 'hello' };"),
  {
    name: 'SyntaxError',
    message: "Unexpected token '='",
  });
```

## 解构对象

1. 解构对象，属性重命名
1. 解构对象的简写形式
1. 结构对象的属性会在原型链上寻找，和普通的属性访问相同 obj.a

```ts
const note = {
  id: 1,
  title: 'My first note',
  date: '01/01/1970',
  author: {
    firstName: 'Sherlock',
    lastName: 'Holmes',
  },
}

const {
  id,
  title,
  date,
  author: { firstName, lastName },
} = note

// Access object and nested values
const {
  author,
  author: { firstName, lastName },
} = note

const { length } = 'string'

// 数组也可以使用对象解构，数组也是对象
const { 0: x, 2: y } = ['a', 'b', 'c']

// 计算属性结构
let key = 'z'
let { [key]: foo } = { z: 'bar' }

console.log(foo) // "bar"
```

## 解构数组

1. 展开元素和 iteration protocol
1. 解构赋值支持嵌套形式
1. 解构数组，数组可以跳过元素
1. 不存在的元素值为 undefined，可以给解构赋值的默认值
1. 结构数组的的属性会不会在原型链上寻找？

```js
const date = ['1970', '12', '01']

const [year, month, day] = date

// 跳过元素
const [year, , day] = date

// Create a nested array
const nestedArray = [1, 2, [3, 4], 5]

// 嵌套数组
const [one, two, [three, four], five] = nestedArray

let x = 'a'
let y = 'b'
```

swap

```js
;[x, y] = [y, x]
```

### 解构应用

解构语法可以使用在数组参数和变量声明

1. 函数多个返回值 return [a, b] 使用对象更好，因为有名称含义
1. 返回对象的函数配合解构
1. 交换 [a, b] = [b, a]
1. 获取函数的数组返回值中的部分元素，获取函数的数组返回之中其余元素，结构语法配合返回数组或者对象的函数使用。

```js
// Using forEach
Object.entries(note).forEach(([key, value]) => {
  console.log(`${key}: ${value}`)
})

// Using a for loop
for (let [key, value] of Object.entries(note)) {
  console.log(`${key}: ${value}`)
}

function returnMultiple() {
  return [x, y]
}
const [x, y] = returnMultiple()
```

正则表达式匹配返回数组的例子

```js
function parseProtocol(url) {
  const parsedURL = /^(\w+)\:\/\/([^\/]+)\/(.*)$/.exec(url)
  if (!parsedURL) {
    return false
  }
  console.log(parsedURL)
  // ["https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  // "https", "developer.mozilla.org", "en-US/docs/Web/JavaScript"]

  const [, protocol, fullhost, fullpath] = parsedURL
  return protocol
}
```

## 嵌套解构

混合使用数组解构和对象解构

对象的嵌套形式

```js
const note = {
  title: 'My first note',
  author: {
    firstName: 'Sherlock',
    lastName: 'Holmes',
  },
  tags: ['personal', 'writing', 'investigations'],
}

const {
  title,
  date = new Date(),
  author: { firstName },
  tags: [personalTag, writingTag],
} = note

console.log(date)
```

数组的嵌套形式

```js
let a = 1
let b = 3

;[a, b] = [b, a]
console.log(a) // 3
console.log(b) // 1

const arr = [1, 2, 3]
;[arr[2], arr[1]] = [arr[1], arr[2]]
console.log(arr) // [1,3,2]
```

1. 数组对象混合使用

## 其余元素（Rest Element）

对象中的写法，只能有一个，位置无所谓
数组中的写法，只能有一个，必须在最后

```js
var { a, ...rest } = {}

var [a, ...rest] = []
```

## 模式没有任何匹配时如何处理

1. 不存在的元素值为 undefined，可以给解构赋值的默认值

```js
// b === undefined
var { a, b } = { a: 1 }

// b === undefined
var [a, b] = [1]
```

## 默认值

使用等号指定解构变量的默认值

```js
// b === 2
var { a, b = 2 } = { a: 1 }

const { prop: p = 123 } = {} // (A)

// b === 2
var [a, b = 2] = [1]
```

## 什么元素可以被解构？

1. 结构赋值的对象 null/undefined 会报错，array/object/iterable 和其他 primitive 是 ok 的。原因在于使用 object assignment pattern 时要求目标值可以转换为对象 [RequireObjectCoercible](https://262.ecma-international.org/6.0/#sec-requireobjectcoercible)。
1. 使用 array assignment pattern 时要求目标对象实现 iteration protocol [GetIterator](https://262.ecma-international.org/6.0/#sec-getiterator) non iterable 对象报错

## 扩展元素 SpreadElement

可以使用的位置

1. 对象表达式中
1. 数组表达式中
1. 函数调用声明与调用位置

```js
// 右侧 TODO: b需要实现什么协议？
var { a } = { a, ...b }

// 左侧
var [a, ...b] = []

// 右侧
var [a] = [a, ...b]

// 函数调用位置
multiply(...a)
multiply.apply(null, [1, 2, 3])

function multiple(a, b, c, ...d) {}
```

展开任何实现了 iterable 协议的对象

```js
// 展开数组
[...set, ...array]

// 展开字符串
const string = 'hello'

const stringArray = [...string]

// 展开对象
{...obj}
```

函数变长参数可以配合使用，替换 apply 方法

```js
// Create a function to multiply three items
function multiply(a, b, c) {
  return a * b * c
}

const numbers = [1, 2, 3]

multiply(...numbers)
```

解构操作符是如何规定的，下面的表达式不会报错

```js
{...undefined}
{...null}
{...0}
```

## 创建新对象而不是修改现有对象

使用扩展操作符方便的创建不可变数据（Immutable Data），而不是修改当前数据。

```js
var obj = { a: 1 }

var newObj = { ...obj, b: 2 }
```

## 函数参数处理

函数参数的传递与数组解构处理类似

```js
function f1(«pattern1», «pattern2») {
  // ···
}

function f2(...args) {
  const [«pattern1», «pattern2»] = args;
  // ···
}
```

## 规范层面的语意与机制

解构赋值 Destructuring Assignment
解构模式 Destructuring Pattern

IsDestructuring

DestructuringAssignmentEvaluation
DestructuringAssignmentTarget
AssignmentRestElement
IteratorDestructuringAssignmentEvaluation
KeyedDestructuringAssignmentEvaluation

Destructuring Binding Patterns

1. 解构语句的静态错误、动态错误、和运行时机制

## 参考

1. [Understanding Destructuring, Rest Parameters, and Spread Syntax in JavaScript](https://www.digitalocean.com/community/tutorials/understanding-destructuring-rest-parameters-and-spread-syntax-in-javascript)
1. [Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
1. [Destructuring Assignment Spec](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-destructuring-assignment)
1. [Destructuring and parameter handling in ECMAScript 6](https://2ality.com/2015/01/es6-destructuring.html)
1. [JavaScript for impatient programmers Chapter 37 Destructuring](https://exploringjs.com/impatient-js/ch_destructuring.html)
1. [JavaScript for impatient programmers Chapter 25.6 Parameter Handling](https://exploringjs.com/impatient-js/ch_callables.html#parameter-handling)
1. [ES6 In Depth: Destructuring](https://hacks.mozilla.org/2015/05/es6-in-depth-destructuring/)
1. [prefer-destructuring]https://eslint.org/docs/rules/prefer-destructuring
1. [Iteration Protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable_examples)

1. [ES2018: Rest/Spread Properties](https://2ality.com/2016/10/rest-spread-properties.html#spreading-objects-versus-objectassign)
1. [Object Rest/Spread Properties for ECMAScript](https://github.com/tc39/proposal-object-rest-spread)
1. [Stage 3 Draft / June 15, 2017 Object Rest/Spread Properties](https://tc39.es/proposal-object-rest-spread/)
1. [@babel/plugin-proposal-object-rest-spread](https://babel.dev/docs/en/babel-plugin-proposal-object-rest-spread)

1. [Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
1. [Assigning versus defining properties](https://exploringjs.com/es6/ch_oop-besides-classes.html#sec_assigning-vs-defining-properties)

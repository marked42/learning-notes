# 解构与展开（Destructuring & Spread）

## 解构

### 为什么引入解构

ES6 之前从对象或者数组中提取多个字段的话只能使用多个赋值语句，写法存在重复。

```js
const person = {
  firstName: 'Jackie'
  lastName: 'Chen'
}
// 多次赋值写法
const firstName = person.firstName, lastName = person.lastName;
```

ES6 引入解构语法，使用和对象字面量一致的形式从目标值中一次提取多个变量。

```js
// 解构语法
const { firstName, lastName } = person
```

### 解构对象

解构对象值`person`，将对象属性`firstName`重新定义为指定名称`fn`的变量。

```js
const { firstName: fn, lastName: ln } = person
```

对象属性名称和指定变量名称相同时可以使用简写形式。

```js
const { firstName, lastName } = person
```

对象解构的写法和对象字面量形式相同，因此也可以使用数字、字符串和计算属性形式。

```js
// 用字符串
const { 'fizz-buzz': fizzBuzz } = { 'fizz-buzz': 1 }

// 数字
const { 2: fizzBuzz } = [undefined, 1]

// 计算属性
const key = 'fizz-buzz'
const { [key]: fizzBuzz } = { 'fizz-buzz': 1 }
```

数组和对象

1. 解构对象，属性重命名

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
```

1. 结构对象的属性会在原型链上寻找，和普通的属性访问相同 obj.a

### 解构数组

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

### 可以在哪里使用解构

解构语法分为[解构绑定模式（Destructuring Binding Patterns）](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-destructuring-binding-patterns)和[解构赋值（Destructuring Assignment）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)两大类，二者的写法基本一致，但语义有所不同。解构绑定模式会**声明新变量**，也就是创建标识符绑定（[Binding Identifier](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#prod-BindingIdentifier)）；解构赋值会对已有的变量进行**赋值**。

#### 解构绑定

解构绑定模式属于语句级别，可能出现的位置如下。

```js
// 变量声明语句 VariableDeclarator
const { firstName, lastName } = person

// for-of 语句也可以包含变量声明
for (const { firstName, lastName } of persons) {
}

// 函数定义参数部分，为函数声明局部变量，机制和变量声明语句类似
function print({ firstName, lastName }) {}
```

解构绑定模式定义了变量，所以也遵循变量声明的规则，存在重复声明的变量属于语法错误。

例如在一个解构绑定中声明多个同名变量。

```js
const person = {
  firstName: 'Jackie',
  lastName: 'Chen',
}

// Uncaught SyntaxError: Identifier 'firstName' has already been declared
const { firstName, firstName } = person
```

或者在解构绑定中声明已经存在的变量。

```js
const person = {
  firstName: 'Jackie',
  lastName: 'Chen',
}

let firstName

// Uncaught SyntaxError: Identifier 'firstName' has already been declared
const { firstName } = {}
```

另外解构绑定是从目标值中提取属性来声明变量，缺少目标值的话也属于语法错误。

```js
// Uncaught SyntaxError: Missing initializer in destructuring declaration
let { firstName, lastName };
```

#### 解构赋值

解构赋值是表达式，可以出现在任意赋值语句的左侧。

```js
let firstName,
  lastName

  // 赋值语句 AssignmentExpression
;({ firstName, lastName } = person)

// for-of 语句也可以使用赋值形式
for ({ firstName, lastName } of persons) {
}
```

注意这里解构赋值语句需要用括号对包裹起来，形成表达式语句，花括号对开头的语句会被识别为块语句而不是解构赋值表达式。

```js
// 解构赋值形式的语法陷阱，直接使用花括号对会被识别为块语句，可以使用括号对包裹，强制为表达式
let prop
assert.throws(() => eval("{prop} = { prop: 'hello' };"), {
  name: 'SyntaxError',
  message: "Unexpected token '='",
})
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

// for loop destructuring binding
for (let [key, value] of Object.entries(note)) {
  console.log(`${key}: ${value}`)
}

// for loop destructuring assignment
for ([a, b] of [
  [1, 2],
  [3, 4],
]) {
  console.log(a, b)
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

```js
function ownX({ ...properties }) {
  return properties.x
}
ownX(Object.create({ x: 1 })) // undefined
```

### 嵌套解构

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

### 其余元素/属性（Rest Element/Property）

对象中的写法，只能有一个，位置无所谓
数组中的写法，只能有一个，必须在最后

```js
var { a, ...rest } = {}

var [a, ...rest] = []
```

### 模式没有任何匹配时如何处理

1. 不存在的元素值为 undefined，可以给解构赋值的默认值

```js
// b === undefined
var { a, b } = { a: 1 }

// b === undefined
var [a, b] = [1]
```

### 默认值

使用等号指定解构变量的默认值

```js
// b === 2
var { a, b = 2 } = { a: 1 }

const { prop: p = 123 } = {} // (A)

// b === 2
var [a, b = 2] = [1]
```

### 什么元素可以被解构？

1. 结构赋值的对象 null/undefined 会报错，array/object/iterable 和其他 primitive 是 ok 的。原因在于使用 object assignment pattern 时要求目标值可以转换为对象 [RequireObjectCoercible](https://262.ecma-international.org/6.0/#sec-requireobjectcoercible)。
1. 使用 array assignment pattern 时要求目标对象实现 iteration protocol [GetIterator](https://262.ecma-international.org/6.0/#sec-getiterator) non iterable 对象报错

### 函数参数处理

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

### 规范解读

解构赋值 [Destructuring Assignment](https://262.ecma-international.org/6.0/#sec-destructuring-assignment)
解构模式 Destructuring Pattern

IsDestructuring

IsValidSimpleAssignmentTarget

DestructuringAssignmentTarget
AssignmentRestElement

三种求值策略

DestructuringAssignmentEvaluation
IteratorDestructuringAssignmentEvaluation
KeyedDestructuringAssignmentEvaluation

解构绑定模式
[Destructuring Binding Patterns](https://262.ecma-international.org/6.0/#sec-destructuring-binding-patterns)

1. 解构语句的静态错误、动态错误、和运行时机制

## 展开语法（Spread Syntax）

Spread Syntax 只能用在三个位置

1. ObjectLiteral 对象表达式中
1. ArrayLiteral 数组表达式中
1. FunctionCall 函数调用声明与调用位置

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
扩展语法忽略 null 和 undefined

```js
// ArgumentList 规定
a(...b)

// Parameter Lists FormalParameters
function a(...b) {}
```

```js
{...undefined}
{...null}
{...0}
```

### 创建新对象而不是修改现有对象

使用扩展操作符方便的创建不可变数据（Immutable Data），而不是修改当前数据。

```js
var obj = { a: 1 }

var newObj = { ...obj, b: 2 }
```

### 规范解读

## 问题与练习

Questions & Quiz

通过问题来检验学习结果

1.

## 参考

解构相关

1. [Understanding Destructuring, Rest Parameters, and Spread Syntax in JavaScript](https://www.digitalocean.com/community/tutorials/understanding-destructuring-rest-parameters-and-spread-syntax-in-javascript)
1. [Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
1. [Destructuring Assignment Spec](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-destructuring-assignment)
1. [Destructuring and parameter handling in ECMAScript 6](https://2ality.com/2015/01/es6-destructuring.html)
1. [JavaScript for impatient programmers Chapter 37 Destructuring](https://exploringjs.com/impatient-js/ch_destructuring.html)
1. [ES6 In Depth: Destructuring](https://hacks.mozilla.org/2015/05/es6-in-depth-destructuring/)
1. [JavaScript for impatient programmers Chapter 25.6 Parameter Handling](https://exploringjs.com/impatient-js/ch_callables.html#parameter-handling)
1. 《Understanding ECMAScript 6》Chapter 5 Destructuring for Easier Data Access
1. [prefer-destructuring]https://eslint.org/docs/rules/prefer-destructuring
1. [Iteration Protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable_examples)
1. [Rest Parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
1. [Object Rest/Spread Properties for ECMAScript Rest](https://github.com/tc39/proposal-object-rest-spread/blob/main/Rest.md)
1. [Parameter List](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-parameter-lists)
1. [Binding Initialization](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-runtime-semantics-bindinginitialization)

扩展语法

1. [Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
1. [Spread Syntax Proposal](https://github.com/tc39/proposal-object-rest-spread/blob/main/Spread.md)
1. [Array Initializer](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-array-initializer)
1. [Object Initializer](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-object-initializer)
1. [Argument List Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-runtime-semantics-argumentlistevaluation)
1. [Object Rest/Spread Properties for ECMAScript Spread](https://github.com/tc39/proposal-object-rest-spread/blob/main/Spread.md)
1. [ES2018: Rest/Spread Properties](https://2ality.com/2016/10/rest-spread-properties.html#spreading-objects-versus-objectassign)
1. [Object Rest/Spread Properties for ECMAScript](https://github.com/tc39/proposal-object-rest-spread)
1. [Stage 3 Draft / June 15, 2017 Object Rest/Spread Properties](https://tc39.es/proposal-object-rest-spread/)
1. [@babel/plugin-proposal-object-rest-spread](https://babel.dev/docs/en/babel-plugin-proposal-object-rest-spread)
1. [Assigning versus defining properties](https://exploringjs.com/es6/ch_oop-besides-classes.html#sec_assigning-vs-defining-properties)

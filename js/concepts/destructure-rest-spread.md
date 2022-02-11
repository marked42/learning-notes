# 解构与展开（Destructuring & Spread）

1. 解决什么问题？

解构赋值 Destructuring Assignment
解构模式 Destructuring Pattern

IsDestructuring

DestructuringAssignmentEvaluation
DestructuringAssignmentTarget
AssignmentRestElement
IteratorDestructuringAssignmentEvaluation
KeyedDestructuringAssignmentEvaluation

Destructuring Binding Patterns

## 解构对象

1. 解构对象，属性重命名
1. 解构数组，数组可以跳过元素
1. 解构赋值支持嵌套形式
1. 不存在的元素值为 undefined，可以给解构赋值的默认值
1. 结构赋值的对象 null/undefined 会报错，array/object/iterable 和其他 primitive 是 ok 的。原因在于使用 object assignment pattern 时要求目标值可以转换为对象 [RequireObjectCoercible](https://262.ecma-international.org/6.0/#sec-requireobjectcoercible)。

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
```

## 解构数组

1. 展开元素和 iteration protocol
1. 解构赋值支持嵌套形式
1. 不存在的元素值为 undefined，可以给解构赋值的默认值
1. 使用 array assignment pattern 时要求目标对象实现 iteration protocol [GetIterator](https://262.ecma-international.org/6.0/#sec-getiterator) non iterable 对象报错

```js
const date = ['1970', '12', '01']

const [year, month, day] = date

// 跳过元素
const [year, , day] = date

// Create a nested array
const nestedArray = [1, 2, [3, 4], 5]

// 嵌套数组
const [one, two, [three, four], five] = nestedArray
```

## 混合使用

1. 数组对象混合使用

混合使用数组解构和对象解构

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

## 使用位置

1. 结构赋值使用的位置 VariableDeclarator / AssignmentExpression
1. 解构语句的静态错误、动态错误、和运行时机制
1. 使用在函数声明参数位置 不需要用户记忆参数的顺序
1. 使用在 for 循环的位置
1. 函数多个返回值 return [a, b] 使用对象更好，因为有名称含义
1. 交换 [a, b] = [b, a]

解构赋值，不是变量声明语句时，变量必须存在

```js
// Syntax error
{ blowUp } = { blowUp: 10 };

// valid 没有分号？
{ blowUp } = { blowUp: 10 }
```

### 数组解构

解构语法可以使用在数组参数和变量声明

```js
// Using forEach
Object.entries(note).forEach(([key, value]) => {
  console.log(`${key}: ${value}`)
})

// Using a for loop
for (let [key, value] of Object.entries(note)) {
  console.log(`${key}: ${value}`)
}
```

## 扩展元素 SpreadElement

可以使用的位置

1. 使用扩展元素将剩余元素赋值到单个变量中
1. 对象解构 左值，右值
1. 数组解构 左值，右值
1. 函数调用声明与调用位置

```js
// 左侧
var { a, ...b } = {}

// 右侧
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

## 参考

1. [Understanding Destructuring, Rest Parameters, and Spread Syntax in JavaScript](https://www.digitalocean.com/community/tutorials/understanding-destructuring-rest-parameters-and-spread-syntax-in-javascript)
1. [Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
1. [Destructuring and parameter handling in ECMAScript 6](https://2ality.com/2015/01/es6-destructuring.html)
1. [JavaScript for impatient programmers Chapter 37 Destructuring](https://exploringjs.com/impatient-js/ch_destructuring.html)
1. [JavaScript for impatient programmers Chapter 25.6 Parameter Handling](https://exploringjs.com/impatient-js/ch_callables.html#parameter-handling)
1. [ES6 In Depth: Destructuring](https://hacks.mozilla.org/2015/05/es6-in-depth-destructuring/)
1. [prefer-destructuring]https://eslint.org/docs/rules/prefer-destructuring
1. [Iteration Protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable_examples)

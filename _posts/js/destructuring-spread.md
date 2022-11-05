---
title: 解构与展开
date: { { date } }
category:
  - 深入理解Javascript
tags:
  - 解构
  - 展开
  - ES6
  - ECMAScript
---

ES6 开始引入了解构和展开的语法特性，使用起来非常方便。但是这些特性的用法还是非常丰富的，可能多数人平常并不太会注意到，本文对其进行了完整的剖析，以作参考。

如果你对相关内容非常熟悉，不妨直接跳到[习题部分](#quiz)，测试一下自己的理解，或者你可以在阅读完本文之后使用习题作为回顾。

# 解构

## 为什么引入解构

ES6 之前从对象或者数组中提取多个字段的话只能使用多个赋值语句，写法存在重复。

```js
const person = {
  firstName: 'Jackie'
  lastName: 'Chen'
}
// 多次赋值写法
const firstName = person.firstName, lastName = person.lastName;
```

使用和对象字面量一致的形式从目标值中一次提取多个变量。

```js
// 解构语法
const { firstName, lastName } = person
```

## 对象解构

解构对象值`person`，用对象属性`firstName`的值定义指定名称`fn`的变量。

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

解构对象的目标值是`null/undefined`时会报错，因为对象解构要求目标值可以转换为对象[RequireObjectCoercible](https://262.ecma-international.org/6.0/#sec-requireobjectcoercible)，Javascript 中除了`null/undefined`其他值都可以转换为对象。

```js
const person = null
// 运行时报错 Uncaught TypeError: Cannot destructure property 'a' of 'null' as it is null.
const { firstName } = person
```

使用解构对象形式获取数组中指定下标的元素。

```js
const { 2: c } = ['a', 'b', 'c']
```

基础类型值也可以使用对象解构，获取字符串的长度。

```js
const { length } = 'string'
```

## 数组解构

使用数组字面值类似的写法可以解构数组中元素。

```js
const date = ['1970', '12', '01']

const [year, month, day] = date
```

使用单独的逗号可以**跳过**数组中的元素。

```js
const date = ['1970', '12', '01']

// 跳过元素 month
const [year, , day] = date

// 可以用在开头，跳过year
const [, month, day] = date
```

使用数组解构交换（swap）两个变量，不需要临时变量。

```js
let x = 1,
  y = 2
;[x, y] = [y, x]
```

或者交换已有数组中两个元素。

```js
const arr = [1, 2, 3]
;[arr[2], arr[1]] = [arr[1], arr[2]]
console.log(arr) // [1,3,2]
```

数组解构的目标值必须是[Iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable_examples)，实现了迭代器协议[GetIterator](https://262.ecma-international.org/6.0/#sec-getiterator)，否则会报错。

```js
// TypeError: {} is not iterable
const [year, month] = {}
```

## 嵌套解构

对象解构支持嵌套形式，可以在同一处解构不同层次的多个属性。

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
```

注意上边的解构中定义了五个变量，不包括`author`，嵌套的形式中对应属性名不属于解构变量。如果想同时解构声明`author`变量的话，使用下面的形式。

```js
const {
  // 定义变量 author
  author,
  // 定义变量 firstName/lastName
  author: { firstName, lastName },
} = note
```

数组解构也支持嵌套形式。

```js
const nestedArray = [1, 2, [3, 4], 5]

// 嵌套数组
const [one, two, [three, four], five] = nestedArray
```

对象解构和数组解构可以任意形式嵌套。

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
  author: { firstName },
  tags: [personalTag, writingTag],
} = note

console.log(date)
```

一个比较特殊的用法是数组解构的其余元素位置可以直接再次使用对象解构形式，这样的语法设计也能够立即，数组其余元素收集得到值是数组类型，数组也是对象，也可以使用对象解构形式。

```js
// a = [2, 3]
const [, ...a] = [1, 2, 3]

// length:  2
const [, ...{ length }] = [1, 2, 3]
```

反过来则不成立，对象解构的其余属性位置不能嵌套使用数组解构形式。

```js
// syntax error
let { ...[ ] } = { a: 1, b: 2 }
```

## 未匹配模式

对象和数组解构形式中不存在匹配的元素或者属性时，解构得到的变量值为`undefined`。

```js
// b === undefined
var { a, b } = { a: 1 }

// b === undefined
var [a, b] = [1]
```

## 默认值

使用等号指定解构变量的默认值，默认值在解构得到`undefined`时生效。

```js
// b === 2
var { a, b = 2 } = { a: 1 }

// 同时使用修改名称和默认值语法
const { prop: p = 123 } = {}

// b === 2
var [a, b = 2] = [1]
```

## 其余元素/属性（Rest Element/Property）

对象解构中可以使用`...rest`形式将未指定的属性统一收集到`rest`变量代表的对象中，称为对象的其余属性（Rest Property）。对象解构中只能有一个其余属性，位置必须是最后一个。

```js
var { a, ...rest } = { a: 1, b: 2, c: 3}

// SyntaxError: Rest element must be last element
var { ..rest, a } = { a: 1, b: 2, c: 3}

// SyntaxError: Rest element must be last element 指y
let { x, ...y, ...z } = obj;
```

数组解构中可以使用`...rest`形式将未指定的数组元素统一收集到`rest`变量代表的数组中，称为数组的其余元素（Rest Element）。数组解构中只能有一个其余元素（Rest Element），必须是最后一个。

```js
var [a, ...rest] = [1, 2, 3]

// SyntaxError: Rest element must be last element
var [...rest, a] = [1, 2, 3]
```

对于多层嵌套的解构形式，可以在每一层都使用一次。

```js
const obj = {
  foo: {
    a: 1,
    b: 2,
    c: 3,
  },
  bar: 4,
  baz: 5,
}
const {
  foo: { a, ...rest1 },
  ...rest2
} = obj
```

其余元素只能对**对象本身**的未被指定的**可枚举属性**进行收集，不包括不可枚举属性和原型对象的属性。

```js
const prototype = { a: 1 }
const obj = Object.create(prototype, {
  // 只收集 b
  b: {
    value: 2,
    enumerable: true,
  },
  c: {
    value: 3,
    enumerable: false,
  },
})

const { ...prop } = obj
// prop: { b: 2 }
console.log('prop: ', prop)
```

## 函数参数

函数参数的传递与数组解构处理类似，可以使用其余参数形式（[RestParameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)）。

```js
function f1(«pattern1», «pattern2») {
  // ···
}

// 等价于
function f2(...args) {
  const [«pattern1», «pattern2»] = args;
  // ···
}
```

### 命名参数

函数定义中参数可以使用对象解构形式，来实现命名参数（Named Parameter）的效果。命名参数的好处在于参数顺序不影响结果，含义更加清晰，结合参数默认值使用更加灵活。

```js
function drawChart({
  size = 'big',
  coords = { x: 0, y: 0 },
  radius = 25,
} = {}) {
  console.log(size, coords, radius)
  // do some chart drawing
}

drawChart()
drawChart({ size: 'small' })
```

### `forEach`

数组的`forEach`函数也是一个典型的使用场景。

```js
// Using forEach
Object.entries(note).forEach(([key, value]) => {
  console.log(`${key}: ${value}`)
})
```

### 多返回值

Javascript 函数只能返回一个值，但是可以返回数组或者对象包含多个值，配合解构语法可以方便的拿到单个数据。

```js
function mousePosition() {
  return [x, y]
}
const [x, y] = mousePosition()
```

### 正则匹配

正则表达式匹配返回类数组对象，配合数组解构使用。

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

### 其余元素

函数参数和数组解构语法形式一样可以组合使用其余元素和对象解构语法。

```js
function test(...{ length }) {
  console.log(length)
}
test(1, 2)
```

## for-of 循环

```js
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
```

## Catch 语句

try 语句的 Catch 分支中也可以定义变量或者使用解构形式。

```js
try {
  // ...
} catch ({ message }) {
  console.log(message)
}
```

## 解构绑定与赋值

解构语法分为[解构绑定模式（Destructuring Binding Patterns）](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-destructuring-binding-patterns)和[解构赋值（Destructuring Assignment）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)两大类，二者的写法基本一致，但语义有所不同。解构绑定模式会**声明新变量**，也就是创建标识符绑定（[Binding Identifier](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#prod-BindingIdentifier)）；解构赋值会对已有的变量进行**赋值**。

### 解构绑定

解构绑定模式用来定义变量，可能出现变量声明、for 循环语句、函数参数等处。

```js
// 变量声明语句 VariableDeclarator
const { firstName, lastName } = person

// for-of 语句也可以包含变量声明
for (const { firstName, lastName } of persons) {
}

// 函数定义参数部分，为函数声明局部变量，机制和变量声明语句类似
function print({ firstName, lastName }) {}
```

解构绑定模式定义了变量，所以也遵循变量声明的规则，重复声明变量属于语法错误。

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

### 解构赋值

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

这里使用了`eval`函数，因为这属于编译期语法错误，无法正常的直接运行，`eval`将编译期错误转换为运行时错误，配合测试代码正常运行。

解构绑定中要求名称不能出现重复，属于变量定义本身的语法要求。解构赋值不要求名称唯一，可以出现重复。

```js
let a = 1

;[a = 2, a = 3] = [a]
// 3
console.log(a)
```

但是赋值语义要求赋值表达式左侧的形式必须是左值表达式（LeftHandSideExpression），而且是合法的赋值目标。

```js
let a = { b: 1 };

[a, a.b] = [2, 3];

// a()是左值表达式，但不是合法赋值目标
[ a() ] = [4]
```

### 语法差异

解构绑定语法和解构赋值语法除了使用的位置不同，其本身都支持对象解构、数组解构、默认值、其余元素属性、嵌套支持等特性，二者的语法定义是非常类似的。

差别在于解构绑定的语义是定义变量，所以递归语法定义的出口是绑定标识符（Binding Identifier），因为变量的定义是用某个值来初始化某个名字。但是解构赋值的语义是把某个值赋值给某个左值（LeftHandSideExpression），标识符代表的变量只是左值的一种形式，还有成员表达式等很多表达式都是合法的左值。

```js
const a = { b: 1 }

// a.b是一个左值，所以可以使用在解构赋值形式中
;[a.b] = [2]

// 2
console.log('a: ', a)
```

左值形式使用在解构绑定形式中是错误的。

```js
// syntax error
const [a.b] = [2];
```

# 展开语法（Spread Syntax）

展开语法和解构中的其余元素都使用`...`的形式，二者都是特殊语法形式，不是表达式。其余元素是将多个属性或者值收集到一个值中，展开语法正好相反。

展开语法在同一个表达式中可以使用多次，而且不要求在最后一个，而且只能出现在三个固定的语法解构中。

## 对象初始化

用在对象初始化表达式（[Object Initializer](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-object-initializer)）中方便地拷贝对象、扩展对象、合并两个对象。

```js
// 声明式
let newObj = { a, ...b }

// 命令式 等价形式
let newObj = Object.assign(a, b)
```

### 与`Object.assign`的异同

目标对象被展开或者使用`Object.assign`创建新对象时，二者都使用[Get](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-get-o-p)操作来获取对象属性值，因此定义了 get 属性的对象得到的结果是 get 属性求值结果而不是 get 属性本身。

```js
const original = {
  get foo() {
    return 123
  },
}

// { foo: 123 }
const spread = { ...original }
// { foo: 123 }
const assign = Object.assign({}, original)
```

展开语法和`Object.assign`都值处理对象的可枚举属性。

```js
const proto = {
    inheritedEnumerable: 1,
};
const obj = Object.create(proto, {
    ownEnumerable: {
        value: 2,
        enumerable: true,
    },
    ownNonEnumerable: {
        value: 3,
        enumerable: false,
    },
});

// { ownEnumerable: 2 }
{...obj}
// { ownEnumerable: 2 }
Object.assign({}, obj)
```

展开语法和`Object.assign`语意上的差别在于展开语法使用[Define](https://262.ecma-international.org/6.0/#sec-ordinary-object-internal-methods-and-internal-slots-defineownproperty-p-desc)语义定义属性，`Object.assign`使用[Set](https://262.ecma-international.org/6.0/#sec-ordinary-object-internal-methods-and-internal-slots-set-p-v-receiver)语义设置属性，二者的区别可以参考[Spreading objects versus Object.assign()](<https://2ality.com/2016/10/rest-spread-properties.html#spreading-objects-versus-object.assign()>)。

### 属性顺序问题

对象初始化中可以出现多个展开，因此先后顺序有影响，后展开的属性会覆盖之前同名的属性。

```js
const obj = { foo: 1, bar: 2, baz: 3 }

// { foo: true, bar: 2, baz: 3 }
{...obj, foo: true}

// { foo: true, bar: 2, baz: 3 }
{foo: true, ...obj}
```

即使多个展开之间不存在同名属性情况，对象本身也记录了属性的顺序，字符串属性是按照**插入顺序**（Insertion Order）存储的，`for-in`属性遍历和`Object.keys`遵循相同的顺序。

## 数组初始化

用在数组初始化表达式（[Array Initializer](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-array-initializer)）中创建新的数组，比使用`concat/push/shift`等函数创建新数组更方便。

```js
let array = [a, ...b, c, ...d]

// 展开字符串
const string = 'hello'

const stringArray = [...string]
```

## 实参列表

用在函数调用表达式的参数列表（[Argument List Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-runtime-semantics-argumentlistevaluation)）中，可以替换`apply`函数的使用。

```js
const a = [1, 2, 3]

// 函数调用位置
multiply(...a)
function multiply(a, b, c) {
  return a * b * c
}

const numbers = [1, 2, 3]

multiply(...numbers)

// 等价形式
multiply.apply(null, numbers)
```

对于构造函数调用无法使用`apply`函数，只能使用展开语法。

```js
let dateFields = [1970, 0, 1] // 1 Jan 1970
let d = new Date(...dateFields)
```

## 浅拷贝

使用扩展语法进行对象拷贝是浅拷贝，和使用`Object.assign`的效果相同。如果存在多层嵌套的对象或者数组，嵌套的属性或者元素是多个拷贝共享的，这可能造成预期之外的问题。

```js
let a = [[1], [2], [3]]
let b = [...a]

b.shift().shift()
//  1

//  Oh no!  Now array 'a' is affected as well:
a
//  [[], [2], [3]]
```

## 可展开对象

对象扩展语法中 null 和 undefined 被忽略而不是报错。

```js
{...undefined}
{...null}
{...0}
```

数组中的展开元素要求被展开的值是 Iterable，否则会报错。

```js
let obj = { key1: 'value1' }
let array = [...obj] // TypeError: obj is not iterable
```

# 规范解读

## 解构绑定模式

解构绑定的语法分别定义在变量声明、函数参数、`for-in`语句、`catch`语句等可以使用的语法位置，参考变量定义语句处的语法定义（[Destructuring Binding Patterns](https://tc39.es/ecma262/#sec-destructuring-binding-patterns)）即可。

### 递归定义

绑定模式（BindingPattern）的分为对象绑定（ObjectBindingPattern）和数组绑定模式（ArrayBindingPattern）两种。

对象绑定模式中包括属性列表（BindingPropertyList）和其余属性（BindingRestProperty），属性列表由若干个单独的属性（BindingProperty）组成。单个属性有单名称绑定（SingleNameBinding）和键值对（PropertyName: BindingElement）的形式。其中绑定元素（BindingElement）和数组绑定语法使用的形式，这个定义使得对象绑定能够**嵌套**数组绑定形式。

数组绑定中包含绑定元素列表（BindingElementList）、可忽略元素（Elision）和其余元素（RestBindingElement）。

1. 绑定元素列表有若干个绑定元素组成，绑定元素包括单名称绑定（SingleNameBinding）和绑定模式（BidingPattern Initializer）形式，这里的**嵌套定义**使得数组绑定可以嵌套使用数组或者对象绑定形式。
1. 可忽略元素代表单个逗号，表示忽略数组中的某个元素。
1. 其余元素绑定有两种形式，绑定标识符（...BindingIdentifier）和绑定模式（...BindingPattern），这里的嵌套定义又使得其余元素可以嵌套的使用任意的绑定模式。

### 递归求值

绑定的求值过程和绑定模式的定义解构对应，都是递归形式，整个求值过程就是递归的找到对应的对象属性或者数组元素，进行求值，然后使用名称和值的对在当前的语法环境（EnvironmentRecord）中定义变量。

绑定初始化（[BindingInitialization](https://tc39.es/ecma262/#sec-runtime-semantics-bindinginitialization)）代表了绑定模式的整个初始化过程。首先会将绑定目标值转换为对象（RequireObjectCoercible），不能转换为对象的值会在运行时报错。属性绑定初始化（[PropertyBindingInitialization](https://tc39.es/ecma262/#sec-destructuring-binding-patterns-runtime-semantics-propertybindinginitialization)）对应绑定属性列表的初始化，然后进入到单个属性的初始化过程（[KeyedBindingInitialization](https://tc39.es/ecma262/#sec-runtime-semantics-keyedbindinginitialization)）。[RestBindingInitialization](https://tc39.es/ecma262/#sec-destructuring-binding-patterns-runtime-semantics-restbindinginitialization) 处理对象其余属性的绑定，首先创建一个全新的对象，然后使用（[CopyDataProperties](https://tc39.es/ecma262/#sec-copydataproperties)）操作将被解构对象的**可枚举属性**拷贝到新的对象上，被拷贝的对象属性排除了绑定模式的绑定名称（BoundNames）语义记录的名称列表。

对于数组模式来说绑定初始化会进入迭代器绑定初始化（[IteratorBindingInitialization](https://tc39.es/ecma262/#sec-runtime-semantics-iteratorbindinginitialization)）的过程。首先会从被解构的目标获取迭代器，所以不可迭代的对象运行时会报错。对于数组中的每个元素进行初始化的过程会造成迭代器向前一步，如果元素嵌套了其他绑定模式，会再次进入绑定初始化过程。数组中其余元素的绑定会创建一个新数组，然后将迭代器中的剩余元素逐个添加到新数组中。

## 解构赋值

解构赋值的语法定义和解构绑定类似，区别在于一个使用术语绑定（Binding），一个使用术语赋值（Assignment），这也是二者的运行时语义上的差别。

需要注意的是赋值的语义要求被赋值目标形式合法，可以参考这个问题 [Are function calls with arguments valid left-Hand-Side-Expressions according to ECMAScript](https://stackoverflow.com/questions/62710902/are-function-calls-with-arguments-valid-left-hand-side-expressions-according-to)。

简单的说就是只有左值才能作为合法的赋值目标，标准中规定了 LeftHandSideExpression 来表示能够出现在赋值语句左边的形式，但是其中有些形式运行时语义上也无法正确赋值，因此有赋值目标类型的概念（ [AssignmentTargetType](https://tc39.es/ecma262/#sec-static-semantics-assignmenttargettype)），将 LeftHandSideExpression 的所有可能类型进行划分，能够正确赋值的形式的赋值目标类型为简单（simple），不能正确赋值的形式的赋值目标类型为非法（invalid）。

## 展开语法

对象初始化（[Object Initializer](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-object-initializer)）中展开语法的属性定义求值过程在属性定义求值（[PropertyDefinitionEvaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-runtime-semantics-propertydefinitionevaluation)）中，同样使用[CopyDataProperties](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-copydataproperties)将被展开值的属性拷贝定义到目标对象上。

数组初始化语法中的展开元素（Spread Element）处理由[ArrayAccumulation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-runtime-semantics-arrayaccumulation)过程规定，被展开的元素也必须满足迭代器协议，通过迭代过程将下标和元素的键值对拷贝定义到新的数组中。

调用表达式参数列表（[Argument List Evaluation](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-runtime-semantics-argumentlistevaluation)）中的求值过程和数组初始化语法中类似。

# 问题与练习 <span id="quiz"></span>

1. 对象解构的目标值是`null`或者`undefined`时会发生什么？满足什么条件的值可以数组解构？
1. 对象解构中被解构对象的所有属性值都会被解构么？原型对象上的属性么会被解构么？
1. 解构语法中没有匹配的属性或者元素时如何处理？
1. 解构语法中什么情况下会使用指定的默认值？
1. 解构绑定和解构赋值的语法有哪些相同和差异的地方？
1. 解构绑定和解构赋值的运行时语义上相同么？
1. 解构语法支持对象、数组以及互相嵌套的形式，但是数组语法中使用其余元素时并不对称，为什么这样设计？
1. 展开语法`{...null}`和`{...undefined}`运行结果如何？
1. 展开语法`[...null]`和`[...undefined]`运行结果如何？
1. 展开语法会展开目标对象的所有属性么？
1. 使用解构和展开语法实现对象拷贝是深拷贝还是浅拷贝？
1. 展开语法不能拷贝哪些属性？
1. 展开语法和`Object.assign`进行属性拷贝时有哪些相同和差异的地方？

# 参考资料

## 解构（Destructuring）

下面几个资料介绍了解构语法的用法，其内容都包含在本文中，感兴趣可以进行阅读。

1. [Understanding Destructuring, Rest Parameters, and Spread Syntax in JavaScript](https://www.digitalocean.com/community/tutorials/understanding-destructuring-rest-parameters-and-spread-syntax-in-javascript)
1. [Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
1. [Destructuring and parameter handling in ECMAScript 6](https://2ality.com/2015/01/es6-destructuring.html)
1. [JavaScript for impatient programmers Chapter 37 Destructuring](https://exploringjs.com/impatient-js/ch_destructuring.html)
1. [JavaScript for impatient programmers Chapter 25.6 Parameter Handling](https://exploringjs.com/impatient-js/ch_callables.html#parameter-handling)
1. [ES6 In Depth: Destructuring](https://hacks.mozilla.org/2015/05/es6-in-depth-destructuring/)
1. 《Understanding ECMAScript 6》Chapter 5 Destructuring for Easier Data Access

[Object Rest Properties for ECMAScript](https://github.com/tc39/proposal-object-rest-spread/blob/main/Rest.md)是对象其余属性的语法提案，已经进入正式的 ECMAScript 2018 规范中。

ECMAScript 规范中关于解构绑定、解构赋值、展开语法等特性的规定参考以下章节。

1. [Binding Initialization](https://tc39.es/ecma262/#sec-runtime-semantics-bindinginitialization)
1. [Destructuring Binding Patterns](https://tc39.es/ecma262/#sec-destructuring-binding-patterns)
1. [Destructuring Assignment](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-destructuring-assignment)。
1. [Parameter List](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-parameter-lists)

[prefer-destructuring](https://eslint.org/docs/rules/prefer-destructuring)是 ESLint 中关于解构的规则。

## 展开（Spread）

展开语法的介绍可以首先参考 MDN 文档 [Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)和[ES2018: Rest/Spread Properties](https://2ality.com/2016/10/rest-spread-properties.html#spreading-objects-versus-objectassign)的介绍。

对象其余属性（Rest Property）和展开属性（Spread Property）的语法提案[Object Rest/Spread Properties for ECMAScript](https://github.com/tc39/proposal-object-rest-spread)，其中分别对[Rest](https://github.com/tc39/proposal-object-rest-spread/blob/main/Rest.md)和[Spread](https://github.com/tc39/proposal-object-rest-spread/blob/main/Spread.md)做说明，关于语法的各种使用情况的例子可以作为准确参考。

其余元素（Rest Element）和其余属性（Rest Property）分别对应数组解构和对象解构，可以参考解构部分的规范描述。

Babel 对于展开语法的转换实现在插件[@babel/plugin-proposal-object-rest-spread](https://babel.dev/docs/en/babel-plugin-proposal-object-rest-spread)中。

---
title: Javascript中什么是合法变量名？
date: 2022-02-24 21:19:04
category:
  - 深入理解Javascript
tags:
  - IdentifierName
  - 标识符名称
  - Identifier
  - 标识符
  - ReservedWord
  - 保留字
  - Keyword
  - 关键字
  - Unicode
  - Babel
  - ECMAScript
---

# Javascript vs C

下面这段代码在 Javascript 中是合法的变量赋值语句，但是在 C 语言中并不合法。

```js
$a = 1
```

原因在于 Javascript 和 C 语言对于合法的变量名称规定不同。本文以 ECMAScript 规范为依据，对这个问题进行探讨。文中使用了标识符名称（IdentifierName）、标识符（Identifier）、保留字（ReservedWord）、关键字（Keyword）等规范中的概念，提示大家在阅读的过程中注意这些概念之间的联系和区别，否则容易混淆。

# 名称

## 合法形式

Javascript 引擎对代码进行处理时，首先在编译阶段进行分词操作，将源码划分为不同的种类的单词（Token），然后使用单词流作为后续解析的输入。

```js
function test1() {
  let a = 1
}
```

这段代码中有几类分词：

1. 数字 `1`
1. **标识符（Identifier）** `test1`/`a`
1. **保留字（ReservedWord）**`function`/`let`
1. 空白与标点符号

函数名、变量名等位置使用的是标识符类型的 Token，由数字、字母组成。另外为了不与数字冲突所以规定标识符不能以数字开头。`function`/`let`等固定语法位置使用的单词形式上也符合标识符定义，但是因为用作特殊用途，所以这一类单词被划分为保留字类型。

ECMAScript 规范中[名称与关键字](https://262.ecma-international.org/6.0/#sec-names-and-keywords)对名称的合法形式进行规定，主要涉及三个概念标识符名称（IdentifierName）、标识符（Identifier）和保留字（ReservedWord）。

1. 标识符是指能够作为合法的变量名、函数名、类名、属性名等名称的形式
1. 保留字
1. 标识符和保留字的合法形式统称为标识符名称

标识符名称的合法形式使用 BNF 语法规定如下。

```BNF
IdentifierName ::
  IdentifierStart
  IdentifierName IdentifierPart

IdentifierStart ::
  IdentifierStartChar
  \ UnicodeEscapeSequence

IdentifierPart ::
  IdentifierPartChar
  \ UnicodeEscapeSequence

IdentifierStartChar ::
  UnicodeIDStart
  $
  _

IdentifierPartChar ::
  UnicodeIDContinue
  $
  <ZWNJ>
  <ZWJ>
```

关键的含义有两点。

1. 标识符名称的首字母必须满足 IdentifierStartChar 的规定，也就是可以使用`$`、`_`和 Unicode 中能作为名称首字母的字符（UnicodeIDStart）。
1. 标识符名称的后续字母必须满足 IdentifierPartChar 的规定，可以是`$`、`<ZWNJ>`、`<ZWJ>`和 Unicode 中能作为名称后续字母的字符（UnicodeIDContinue）。其中`UnicodeIDContinue`包含了`UnicodeIDStart`、`_`、数字和其他一些合法字符。

也就是说后续字符包含的范围比首字符要大。Javascript 相比于 C 语言允许更多字符作为标识符

1. 开头允许 U+0024 (DOLLAR SIGN) and U+005F (LOW LINE)
1. 后续字符允许 U+200C (ZERO WIDTH NON-JOINER) and U+200D (ZERO WIDTH JOINER)

这解释了`$a = 1`在 Javascript 中合法但是在 C 语言中非法的现象。

## 中文名称

标识符合法形式中允许使用 Unicode 码点分类 UnicodeIDStart/UnicodeIDContinue，这意味着我们可以使用中文、日文、韩文等字符作为名称。

```js
const 姓 = '李'
const 名 = '白'

function 问好(姓, 名) {
  const greeting = `你好，${姓}${名} 🤪`

  console.log(greeting)
}

// 你好，李白 🤪
问好(姓, 名)
```

上面代码中函数名、参数名、变量名都使用了中文，是合法的形式。

## UnicodeIDStart 和 UnicodeIDContinue

完整的 UnicodeIDStart 和 UnicodeIDContinue 包含的字符可以参考[Unicode® Standard Annex #31](https://www.unicode.org/reports/tr31/)中 Default Identifier Syntax 的内容。

Babel 对于标识符的相关实现位于[这里](https://github.com/babel/babel/blob/main/packages/babel-helper-validator-identifier/src/identifier.ts)，使用[Unicode v14.0.0](https://www.npmjs.com/package/@unicode/unicode-14.0.0)提取合法的码点范围并生成正则表达式来检测合法名称字符。

粗略来说，合法的名称字符包括了几类。

<table>
  <tr>
    <th>码点范围</th>
    <th>分类</th>
    <th>字符</th>
  </tr>
  <tr>
    <td>0x00 - 0xff</td>
    <td>ASCII 字符集</td>
    <td>英文大写字母、小写字母、数字和几个特殊字符$、_</td>
  </tr>
  <tr>
    <td>0x0100 - 0xffff</td>
    <td>Unicode 基础平面 BMP 中的合法字符</td>
    <td>中文、日文、韩文</td>
  </tr>
  <tr>
    <td>0x01000 - 0x10ffff</td>
    <td><a href="https://mathiasbynens.be/notes/javascript-identifiers-es6#acceptable-unicode-symbols"> Unicode 补充平面（Astral）<a>，ES 5不允许使用非补充平面字符作为标识符，ES6开始允许</td>
    <td>其他字符</td>
  </tr>
</table>

## 转义序列

标识符名称支持使用 Unicode 转义序列[UnicodeEscapeSequence](https://262.ecma-international.org/6.0/#sec-literals-string-literals)来表示 Unicode 字符，方便在不能直接使用 Unicode 字符的情况下使用。

```jsa
// \u0041 是字符'A'的转义序列
let \u0041 = 1;
console.log('A: ', A)


// \u{0042} 是字符'B'的转义序列
let \u{0042} = 2;
console.log('B: ', B)
```

上面使用了 Unicode 转义序列的两种形式分别定义了变量 A 和 B，`\u HexDigits`的形式只能表示 Unicode 中基本平面的字符，`\u{CodePoint}`的形式能表示 Unicode 中的所有字符，完整的定义如下。

```
UnicodeEscapeSequence ::
  u Hex4Digits
  u{ CodePoint }

Hex4Digits ::
  HexDigit HexDigit HexDigit HexDigit

HexDigit :: one of
  0 1 2 3 4 5 6 7 8 9 a b c d e f A B C D E F

CodePoint ::
  HexDigits[~Sep] but only if MV of HexDigits ≤ 0x10FFFF
```

对于错误形式的转义序列，执行时在代码解析阶段就直接报错。

`\u HexDigits`形式必须是`\u`后面跟着**四个**十六进制字符（HexDigit）。

```js
// SyntaxError: Invalid Unicode escape sequence
const \uaa = 1;

console.log(\uaa)
```

`\u{CodePoint}`形式中括号对内也是十六进制字符，但是要求代表的码点值必须小于等于（0x10FFFF），也就是位于 Unicode 字符集规定的码点范围内。

下面是几种非法的转义序列形式。

```js
// 错误，包含了不属于十六进制字符的字符g
\u{1g}

// 错误，码点范围超出Unicode字符集
\u{110000}

// 正确，\u{42}是字符B的转义形式
const \u{42} = 1;
console.log('B', \u{42})
```

转义序列除了必须形式正确外，其代表的对应码点也必须是合法的名称字符。
例如反撇号`本身不是合法的名称字符，那么使用转义序列的方式书写也是不正确的。

```js
// \u{40}是反撇号`的转义序列形式
// SyntaxError: Invalid or unexpected token
const \u{40} = 1
```

## 码点序列语意

由于允许使用 Unicode 转义序列，所以同一个名称的变量有多种写法。

```c
// 直接书写
let A = 1

// 转义序列形式
// \u0041是 'A'的转义形式
let \u0041 = 1;
```

Javascript 中对于标识符名称的处理都是基于码点序列，具有相同码点序列的不同写法被认为是同一个名称。在 ES6 规范中被称为 [StringValue](https://262.ecma-international.org/6.0/#sec-identifier-names-static-semantics-stringvalue) 语意，在 ES 2022 中被称为 [IdentifierCodePoints](https://tc39.es/ecma262/#sec-identifiercodepoints) 语意，使用的术语不相同，但表达式是同一个意思。因此上面这段代码执行的话会报错，因为同一个名称'A'的变量不允许**重复定义**。

Unicode 中代表相同字符（canonically equivalent）的标识符名称并不一定等价，除非其使用的码点序列相同，参考 [ES 6 规范](https://262.ecma-international.org/6.0/#sec-names-and-keywords)。

> Two IdentifierName that are canonically equivalent according to the Unicode standard are not equal unless, after replacement of each UnicodeEscapeSequence, they are represented by the exact same sequence of code points.

## 合法标识符名称判断

通过上面的介绍我们了解了标识符名称的合法形式的定义，主要是两点。

1. 首字母必须合法
1. 后续字母必须合法

看起来像是废话，但是具体实现逻辑还是有些细节的，这里我们参考[Babel](https://github.com/babel/babel/blob/main/packages/babel-helper-validator-identifier/src/identifier.ts#L85)的实现。

```ts
export function isIdentifierName(name: string): boolean {
  let isFirst = true
  // iterable protocol返回的是code point序列
  for (const char of Array.from(name)) {
    const cp = char.codePointAt(0)
    if (isFirst) {
      if (!isIdentifierStart(cp)) {
        return false
      }
      isFirst = false
    } else if (!isIdentifierChar(cp)) {
      return false
    }
  }
  // isFirst理解为状态机，包含了空串、单个字符、多个字符情况
  return !isFirst
}
```

这个实现中有几个关键点。

第一点，接受的参数是一个字符串，需要从字符串获取其对应的 Unicode 码点序列。由于 Javascript 的字符串使用的是 UTF16 的变长编码，所以字符串获得指定下标位置字符对应码点的方法`codePointAt(index)`不能直接使用，需要增加对于代理对（Surrogate Pair）的检查。Babel 的实现没有包含这个逻辑，而是直接使用了`Array.from(name)`的形式。

原因在于字符串实现了[迭代器协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/@@iterator)，顺序返回字符串每个字符对应的码点，返回形式也是字符串，所以使用 for 循环遍历时每个字符代表一个码点，再使用`codePointAt(0)`获得正确码点。

第二点，关于首字母`isIdentifierStart`和后续字母`isIdentifierChar`的检测逻辑是前文中讲述的内容。

第三点，整个检测逻辑是一个状态机的实现，`isFirst`变量可以理解为记录了状态机的匹配状态。状态机的合法结束情况是接受了至少一个字符，而且每个字符都满足对应的要求。状态机结束时函数返回`true`表示输入是合法的标识符名称。

循环中单个字符非法时直接返回`false`；如果循环能正确结束表示所有字符合法，这时候还要满足至少一个字符，也就是`!isFirst`。

# 名称分类

下图中对标识符名称、标识符、关键字、保留字等概念的关系进行总结。标识符名称是最大的圈，包含了其他三个概念。保留字和标识符是两个互斥的概念，合起来等于标识符名称。关键字和保留字、标识符各有重合。

![名称分类](/images/reserved-word-keyword.jpeg)

名称的分类可以参考[规范](https://tc39.es/ecma262/#sec-keywords-and-reserved-words)中的表述，其中总是**可以**作为标识符的名称（Math,window,toString 等）和总是**不能**作为标识符的名称（if/else 等）两种情况比较清楚，可以重点关注另外的三种情况<span id="conditional-reserved-word"></span>。

<table>
  <tr>
    <th>分类</th>
    <th>列表</th>
  </tr>
  <tr>
    <td>某些条件下可以作为标识符的保留字</td>
    <td>await, yield</td>
  </tr>
  <tr>
    <td>严格模式下激活的保留字 </td>
    <td>let, static, implements, interface, package, private, protected, public</td>
  </tr>
  <tr>
    <td>可以作为标识符的关键字</td>
    <td>as, async, from, get, meta, of, set, target</td>
  </tr>
</table>

## 关键字

关键字（keyword）是指符合标识符名称（IdentifierName）形式，且出现在**语法结构**中的若干个单词，例如下面代码中的`function/if/return`等。

```js
function test(a) {
  if (a) {
    return true
  }

  return false
}
```

大多数关键字不是合法的标识符，也就是不能出现在需要标识符的语法结构位置中，不能用作变量名、函数名、类名等。但是也有个别关键词[例外](#async-await)。

ES 6 中的关键字列表如下，Babel 实现的辅助函数[isKeyword](https://github.com/babel/babel/blob/main/packages/babel-helper-validator-identifier/src/keyword.ts#L94)与其一致。

```
break case catch continue debugger default do else finally for function if return switch throw try var const while with new this super class extends export import null true false in instanceof typeof void delete
```

## 保留字

[保留字](https://262.ecma-international.org/6.0/#sec-reserved-words)（ReservedWord）是指**标识符名称**中不是**标识符**的其余名称。也就是说一个名称如果属于保留字，就不能用到变量名、函数名、类名等需要标识符的语法位置。

```js
var enum = 1
```

上面代码中`enum`是保留字，所以不能作为变量名称使用。但是有些名称作为保留字是[有条件的](#conditional-reserved-word)，条件不满足时不是保留字，从而可以作为变量名存在。设计这种机制主要是出于兼容旧代码的考虑，规范新增保留字时，旧代码中可能存在使用新保留字作为变量的情况，为了保证旧代码在新规范下还能正常运行，保留字的触发就需要设置一定条件。

Javascript 的不同版本规范定义的保留字列表有更新变化，可以参考文章[Reserved keywords in JavaScript](https://mathiasbynens.be/notes/reserved-keywords)。

当前时间最新规范 ES2022 中的保留字列表

```
await break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with yield
```

## 标识符分类

标识符根据所处的语法位置表示不同的语义，划分为绑定标识符（BindingIdentifier）、标识符引用（IdentifierReference）、标签标识符（LabelIdentifier）和普通标识符（Identifier）。

```js
// 绑定标识符，定义一个绑定
let a = 1

// 引用标识符，引用一个绑定
console.log(a)

// a 标签标识符，标签语句中使用的形式
a: console.log

// obj 是绑定标识符
const obj = {
  // id是普通标识符
  id: 1,
}

// id是普通标识符
obj.id
```

标识符的类型是根据 ECMAScript 规范定义的语法形式确定的，针对具体代码可以查询规范确定。

不同的标识符类型对于合法的标识符名称的要求不同，通过 Javascript 语法规则和静态语意进行约束。

下文中的“能/不能作为标识符”、“合法标识符”等表述，如无特殊说明其中“标识符”均指**绑定标识符、引用标识符和标签标识符**，普通标识符的名称没有特殊要求，可以使用符合标识符名称的任意内容。

# 合法标识符

## 是关键字但不是保留字

一部分关键字不是保留字，可以作为合法标识符使用，下面对属于这个分类的情况分别给出代码示例。

模块导入导出语法中的关键字`from`/`as`可以作为标识符使用，因此下面的代码是合法的。

```js
// 将模块导出到标识符from上，第一个from是标识符，第二个from是关键字
import from from 'fs'
console.log('from: ', from)

// 将readFile导入为as变量，第一个as是关键字，第二个as是标识符
import { readFile as as } from 'fs'
console.log('as: ', as)
```

异步函数语法中`async`关键字。

```js
// 定义一个名称为 async的异步函数
async function async() {}
```

`for-of`循环中的`of`关键字。

```js
// 将循环变量命名为of
for (const of of [1, 2, 3]) {
  console.log(of)
}
```

对象语法中 get/set 属性或者类定义中 get/set 方法使用到的关键字`get`/`set`。

对象属性中用到名称为`get`/`set`的变量。

```js
let get = 1
let set = 2
const obj = {
  name: {
    get() {
      return get
    },
    set() {
      set = value
    },
  },
}
```

类中定义名称为 get 的`get`属性和名称为 set 的`set`属性。

```js
class Test {
  get get() {
    return 'get'
  }

  set set(value) {
    console.log('set: ', value)
  }

  print() {
    console.log(this.get)
    this.set = 1
  }
}

new Test().print()
```

`new.target`语法中的`target`关键字可以作为标识符，`new`是保留字不能作为标识符。

```js
class Test {
  constructor() {
    const target = new.target

    console.log('target: ', target)
  }
}
new Test()
```

`import.meta`中的`meta`关键字作为合法的标识符，`import`是保留字不能作为标识符。

```js
const meta = import.meta

console.log('meta: ', meta)
```

上述这些代码示例虽然合法，但是这种写法容易造成误解，实际编码过程中最好**禁用**这种写法。

## 严格模式保留字

严格模式下以下列表中的标识符名称也是保留字，不能作为合法标识符。

```
public
private
protected
interface
package
implements
let
static
yield // 下文有单独讨论
```

## yield

yield 关键字在非严格模式下可以作为合法标识符。

```js
// 正确，非严格模式
var yield = { yield: 1 }

yield: console.log(yield.yield)
```

但是[静态语意](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-identifiers-static-semantics-early-errors)规定**严格模式**下 yield 是保留字，不能作为标识符。

使用'use strict'开启严格模式，下面代码中所有 yield 标识符都是非法的。

```js
// 严格模式
'use strict'
var yield = {}

yield: console.log(yield)
```

但是对象属性的标识符是普通标识符，所以名称为 yield 是合法的。

```js
'use strict'
const obj = { yield: 1 }
console.log(obj.yield)
```

模块代码（Module）中自动开启严格模式，下面的代码是模块代码，`yield`是保留字，所以定义名称为`yield`的变量报错。

```js
// SyntaxError: Unexpected strict mode reserved word
var yield = 1
```

**Generator 函数**中不允许使用名称为 yield 关键字的**绑定标识符**，非 Generator 函数中无此限制。

```js
function yieldIsValidIdentifier() {
  // 普通函数中合法
  let yield = 1
}

function *yieldIsUnexpectedIdentifier() {
  // SyntaxError: Unexpected identifier
  // 迭代器函数中非法
  let yield = 1;
}
```

另外 Generator 函数中不允许以**转义序列**形式出现名称为 yield 的绑定标识符、引用标识符和标签标识符。

```js
function *gen() {
  // yield 转义形式
  yiel\u{64}: console.log(1);
}
```

## await <span id="async-await"></span>

await 关键字在脚本（Script）环境中可以作为合法的标识符，严格模式对 await 是否是保留字**无影响**。下面脚本代码中的 await 都是合法标识符。

```js
var await = 1;

function await() {
  var await = 2
}

function await() {
  'use strict'
  var await = 3
}
```

在**模块代码**中 await 是保留字，不能用做标识符，下面的代码是**模块代码**。

```js
function sync() {
  // 非法
  let await = 1
}

// 非法
async function await() {}

async function test() {
  // 非法
  let await = 1;
}
```

在**异步函数**中 await 是保留字，不能用做标识符，下面的代码是**脚本代码**。

```js
// 同步函数
function sync() {
  // 合法
  let await = 1
}

// 合法，异步函数的函数名不属于函数内部
async function await() {}

// 异步函数
async function test() {
  // SyntaxError: Unexpected reserved word
  let await = 1;
}
```

在异步函数中同样也不允许以**转义序列**形式出现名称为 await 的绑定标识符、引用标识符和标签标识符。

```js
async function test() {
  // SyntaxError: Keyword must not contain escaped characters
  \u{61}wait: console.log(1);
}
```

## yield/await 存疑问题

规范中关于 yield/await[部分](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-identifiers-static-semantics-early-errors)有个问题暂时没搞明白。

```
// 规则1
BindingIdentifier[Yield, Await] : yield
  It is a Syntax Error if this production has a [Yield] parameter.

// 规则2
BindingIdentifier[Yield, Await] : await
  It is a Syntax Error if this production has an [Await] parameter.

// 规则3
IdentifierReference[Yield, Await] : Identifier
BindingIdentifier[Yield, Await] : Identifier
LabelIdentifier[Yield, Await] : Identifier
  It is a Syntax Error if this production has a [Yield] parameter and StringValue of Identifier is "yield".
  It is a Syntax Error if this production has an [Await] parameter and StringValue of Identifier is "await".
```

规则 3 的情况似乎覆盖了规则 1 和规则 2，为什么规则 1 和规则 2 需要单独表述？ （TODO:）

如果有人知道这个问题或者有兴趣交流，可以联系<a href="/about">我</a>。

## eval/arguments

非严格模式下关键字 eval/arguments 可以作为合法标识符。

```js
var eval = 1

console.log(eval)
```

严格模式下不 eval/arguments 虽然不是保留字，但是也不允许作为**绑定标识符**，也就是不能作为变量名、函数名、类型名。

```js
'use strict'

// 非法
function eval() {}
```

但是作为其他类型标识符是合法的。

```js
// 标签标识符 引用标识符
eval: console.log(eval)
```

arguments 关键字的情况类似。

## undefined

`true`、`false`、`null`是保留字，不能作为标识符。`undefined`的情况比较特殊，它是一个合法标识符，不是**关键字**。Javascript 引擎初始化时在全局对象上初始化了名称为`undefined`的属性，值也是`undefined`，所以可以直接使用`undefined`变量。

```js
console.log(undefined)
```

全局环境的`undefined`属性是不能重新**赋值**的，属性配置`configurable: false`。

```js
var originalValue = undefined

// undefined
console.log(undefined)

// 全局undefined赋值不生效
undefined = 1

// undefined
console.log(originalValue)
// undefined 值没有变化
console.log(undefined)
```

但是可以重新定义的方式来覆盖全局`undefined`属性。

```js
var originalValue = undefined

// undefined
console.log(undefined)

// 重新定义
var undefined = 1

// undefined
console.log(originalValue)
// 1
console.log(undefined)
```

函数内部的局部变量`undefined`就可以正常修改。

```js
var globalUndefined = undefined
function localUndefinedIsMutable() {
  var undefined = globalUndefined

  var originalValue = undefined

  // undefined
  console.log(undefined)

  // 局部变量undefined赋值生效
  undefined = 1

  // undefined
  console.log(originalValue)
  // 1 值发生变化
  console.log(undefined)
}

localUndefinedIsMutable()
```

由于存在上述的情况，所以代码中直接使用`undefined`变量时得到的值不一定是`undefined`。为了保证拿到`undefined`值，常见用方式是使用 [void 表达式](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-void-operator)。`void expr`对表达式 expr 进行求值，然后返回`undefined`值，expr 可能包含副作用。

```js
<a href="javascript:void(0)"></a>
```

## let

let 在**非严格模式**下不是保留字，因此下面的形式是正确的。

```js
var let = 1
var { let } = {}
function let() {}

console.log('let: ', let)
```

但是[LexicalDeclaration](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-let-and-const-declarations-static-semantics-early-errors)语句和[ForInOfStatement](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-for-in-and-for-of-statements-static-semantics-early-errors)中不允许`let`作为绑定名称（[BoundNames](https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-static-semantics-boundnames)）。

下面代码中名为`let`变量的声明都是非法的。

```js
// SyntaxError: let is disallowed as a lexically bound name
for (let let in {}) {}
for (const let in {}) {}

for (let let of []) {}
for (const let of []) {}

for await (let let of []) {}
for await (const let of []) {}
```

严格模式下声明名称为`let`的变量同样报错，但是注意报错原因和非严格模式不相同。

```js
// SyntaxError: Unexpected strict mode reserved word
for (let let in {}) {}
```

既然`let`有这些额外的规定，那么`const`是不是也应该同样规定不能作为绑定名称呢？

查看规范原文，可以看到只对 let 做了表述。

> It is a Syntax Error if the BoundNames of ForDeclaration contains "let".

原因在于 const 永远是保留字，不像 let 一样只在严格模式下才是保留字，所以使用 const 作为标识符属于语法错误，在语法解析时就会报错，不需要额外规定。

## PrivateIdentifier

参考[规范](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-class-definitions-static-semantics-early-errors)

## 禁用转义序列的非标准行为

ES6 之前主流的 Javascript 引擎实际上都支持使用保留字作为标识符，只要保留字中包含至少一个转义字符，这是[非标准行为](https://mathiasbynens.be/notes/javascript-identifiers-es6#non-standard)。

```js
// Invalid in ES5 and ES2015
var var;

// Invalid in ES5 and ES2015, but supported in old ES5 engines:
var v\u0061r;
```

但是 ES6 规范明确禁止了这种形式，规定关键字和标识符对于转义序列的使用有差别。**关键字**中不允许使用转义序列。

```js
// let {} = {};
// \u{6C} 是 'l' 的转义序列
\u{6C}et {}  = {};
```

上面将 let 使用了转义序列表示，所以代码解析的时候\u{6C}et 被当成标识符而不是关键字，后续语法解析会报错。

Node 环境运行会给出如下报错信息。

```
\u{6C}et {}  = {};
         ^
SyntaxError: Unexpected token '{'
```

Typescript 的解析和提示更智能，会提示关键字中不能使用转义序列。

```
Keywords cannot contain escape characters.ts(1260)
```

**标识符**中可以使用转义序列，下面两种形式都声明了名称为 let 的变量。

```
var let = 1;
var \u{6C}et = 1;
```

标识符中不允许以转义序列的形式出现保留字。

```js
// 非法，语法解析阶段报错
// SyntaxError: Unexpected token 'const'
var const = 1;

// 转义形式出现也非法，静态语意报错
// SyntaxError: Keyword must not contain escaped characters
var \u{63}onst = 1;
```

# Babel

## 保留字判断

判断一个名称是否为合法的保留字受到严格模式和是否作为绑定标识符两个条件影响，[Babel](https://github.com/babel/babel/blob/main/packages/babel-helper-validator-identifier/src/keyword.ts)提供了四个相关的工具函数。

```js
/**
 * 非严格模式下word是不是保留字
 */
export function isReservedWord(word: string, inModule: boolean): boolean {
  return (inModule && word === 'await') || word === 'enum'
}

/**
 * 严格模式下word是不是保留字，相比于非严格模式多了几个保留字
 */
export function isStrictReservedWord(word: string, inModule: boolean): boolean {
  return isReservedWord(word, inModule) || reservedWordsStrictSet.has(word)
}

/**
 * 严格模式下只针对绑定标识符形式来word说是保留字
 * 也就是word可以作为标识符引用、标签标识符等形式
 */
export function isStrictBindOnlyReservedWord(word: string): boolean {
  return reservedWordsStrictBindSet.has(word)
}

/**
 * 严格模式下word是不是保留字，包括所有可能的保留字情况
 */
export function isStrictBindReservedWord(
  word: string,
  inModule: boolean
): boolean {
  return (
    isStrictReservedWord(word, inModule) || isStrictBindOnlyReservedWord(word)
  )
}
```

## 合法标识符判断

[isValidIdentifier](https://github.com/babel/babel/blob/main/packages/babel-types/src/validators/isValidIdentifier.ts)判断名称 name 是否是合法标识符，reserved 为 true 表示排除保留字。

```js
export default function isValidIdentifier(
  name: string,
  reserved: boolean = true
): boolean {
  if (typeof name !== 'string') return false

  if (reserved) {
    // "await" is invalid in module, valid in script; better be safe (see #4952)
    if (isKeyword(name) || isStrictReservedWord(name, true)) {
      return false
    }
  }

  return isIdentifierName(name)
}
```

[isValidES3Identifier](https://github.com/babel/babel/blob/main/packages/babel-types/src/validators/isValidES3Identifier.ts)判断 name 是否是合法的 ES3 标识符，相比于`isValidIdentifier`排除了 ES3 中规定的标识符。

```js
export default function isValidES3Identifier(name: string): boolean {
  return isValidIdentifier(name) && !RESERVED_WORDS_ES3_ONLY.has(name)
}
```

## 转换合法标识符

[toIdentifier](https://github.com/babel/babel/blob/main/packages/babel-types/src/converters/toIdentifier.ts)将字符串转换为驼峰形式的合法标识符名称，排除可能的保留字形式，可能需要以`_`开头。

```js
export default function toIdentifier(input: string): string {
  input = input + ''

  // replace all non-valid identifiers with dashes
  let name = ''
  for (const c of input) {
    name += isIdentifierChar(c.codePointAt(0)) ? c : '-'
  }

  // remove all dashes and numbers from start of name
  name = name.replace(/^[-0-9]+/, '')

  // camel case
  name = name.replace(/[-\s]+(.)?/g, function (match, c) {
    return c ? c.toUpperCase() : ''
  })

  if (!isValidIdentifier(name)) {
    name = `_${name}`
  }

  return name || '_'
}
```

[toBindingIdentifierName](https://github.com/babel/babel/blob/main/packages/babel-types/src/converters/toBindingIdentifierName.ts)将字符串转换为合法的绑定标识符名称，在`toIdentifier`的基础上再排除`eval`和`arguments`。

```js
export default function toBindingIdentifierName(name: string): string {
  name = toIdentifier(name)
  if (name === 'eval' || name === 'arguments') name = '_' + name

  return name
}
```

# 练习

1. Javascript 和 C 语言在合法标识符名称形式上有什么区别？
1. 解释标识符名称、标识符、关键字、保留字这些概念，它们之间有什么联系和区别？
1. 这段代码的含义是什么，为什么可以这样写？

   ```你好
   function 求和(...数列) {
     return 数列.reduce((和, 数) => 数 + 和, 0)
   }

   console.log(求和(1, 2, 3))
   ```

1. 这段代码正确么，运行结果是什么？

   ```
   var \u{12} = 1
   ```

1. 这段代码会能正确运行么，为什么？
   ```
   var a = 1
   var \u{61} = 2
   console.log(a)
   ```
1. 给一个字符串`input`如何获得对应的码点序列数组？
1. 这段代码会能正确运行么，为什么？

   ```
   let a = 1
   let \u{61} = 2
   console.log(a)
   ```

1. 这段代码正确么，为什么？

   ```
   var private = 2
   console.log(private)
   ```

1. 这段代码正确么，为什么？

   ```
   'use strict';
   var private = 2
   console.log(private)
   ```

1. 这段代码运行结果如何，为什么？
   ```js
   import from from 'fs'
   console.log('from: ', from)
   ```
1. 这段代码能按预期打印 1 么？不能的话如何修改？两个'eval'有什么区别

   ```
   eval('use strict; var eval = 1; console.log(eval)')
   ```

1. yield 和 await 什么时候可以作为标识符，什么情况下作为关键字？
1. 这段代码正确么，为什么？
   ```js
   var \u{63}onst = 1;
   ```
1. undefined 相关
   1. `undefined`是关键字还是标识符？
   1. `<a href="javascript:void(0)"></a>`为什么可以这样写？
   1. `undefined === void 0`的值总是`true`么？
   1. `null`和`undefined`有什么区别？
1. 如何判断名称 name 是否是保留字？
1. 如何判断名称 name 是合法标识符？
1. 给一个字符串 name，如何将其转换成合法的标识符。

# 参考资料

本文的相关参考资料，罗列如下。

可以首先阅读 [Valid JavaScript variable names in ES2015](https://mathiasbynens.be/notes/javascript-identifiers-es6)，Mathias Byens 总结了 ES5 和 ES6 规范对于合法标识符名称的不同规定，从中可以了解到规范的演变过程。

[ES 2015 Names and Keywords](https://262.ecma-international.org/6.0/#sec-names-and-keywords)、[ES 2022 Names and Keywords](https://tc39.es/ecma262/#sec-names-and-keywords)、
[ES 2022 Identifiers Static Semantics Early Errors](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-identifiers-static-semantics-early-errors)等 ECMAScript 规范内容是本文主要来源。

另外参考了 Babel 中标识符 [validators](https://github.com/babel/babel/tree/main/packages/babel-types/src/validators)和 [converters](https://github.com/babel/babel/tree/main/packages/babel-types/src/converters) 源码。

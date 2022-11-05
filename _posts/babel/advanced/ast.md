---
title: 抽象语法树
date: { { date } }
category:
  - Babel
tags:
  - Javascript
  - AST
  - Parsing
---

Javascript 代码经过解析得到抽象语法树（**A**bstract **S**yntax **T**ree），用来表示程序源码结构。

前端基础工具 Babel、ESLint、Prettier 等使用的 Javascript 抽象语法树最早是火狐的工程师开发 SpiderMonkey 引擎时使用的格式，后来发展为统一的[ESTree 规范](https://github.com/estree/estree)，包含 ECMAScript 规范各版本对应的抽象语法树文档和一些废弃或者是提案语法的文档。

Babel 使用的抽象语法树规范参考[官方文档](https://github.com/babel/babel/blob/master/packages/babel-parser/ast/spec.md)。抽象语法树规范主要描述每种语法特性的树节点，主要包括文件（File）、程序（Program）、语句（Statement）、声明（Declaration）、表达式（Expression）和其他杂项类型。

使用网站[astexplorer](https://astexplorer.net/)可以方便的查看任意 JS 代码抽象语法树结构。左边是源码，右边是对应的抽象语法树。

![ast-explorer](/images/ast-explorer.png)

# 节点类型

下面使用 Babel 为例，来看看抽象语法树节点都包含哪些具体类型。

## 基础节点类型

`BaseNode`对象是所有的抽象语法树节点的基础类型，不同的节点在`BaseNode`对象的基础上增加字段代表独有信息。`BaseNode`对象格式如下。

```js
interface BaseNode {
  type: string;
  loc: SourceLocation | null;
  start: number | null;
  end: number | null;

  leadingComments: ReadonlyArray<Comment> | null;
  innerComments: ReadonlyArray<Comment> | null;
  trailingComments: ReadonlyArray<Comment> | null;

  range?: [number, number];
  extra?: Record<string, unknown>;
}
```

其中`type`字段是代表节点类型，不同节点根据类型字段进行区分。`loc`字段代表该节点在源码中的首尾行列位置信息，`start`和`end`代表该节点在源码中的字符下标位置，`range`字段以数组形式存储`[start, end]`。

```js
interface SourceLocation {
  source: string | null;
  start: Position;
  end: Position;
}

interface Position {
  line: number; // >= 1
  column: number; // >= 0
}
```

`leadingComments/innerComments/trailingComments`是节点前后的注释信息。`extra`字段存储额外的信息，例如括号表达式标志为`parenthesized`。

## File & Program & Directive

### 源码类型

JS 抽象语法树根节点都是`File`类型，代表当前整个源码文件。

```ts
export interface File extends BaseNode {
  type: 'File'
  program: Program
  comments?: Array<CommentBlock | CommentLine> | null
  tokens?: Array<any> | null
}
```

`File`节点下包含`Program`类型节点，是代码的根节点。

```ts
export interface Program extends BaseNode {
  type: 'Program'
  body: Array<Statement>
  directives: Array<Directive>
  sourceType: 'script' | 'module'
  interpreter?: InterpreterDirective | null
  sourceFile: string
}
```

ES6 引入模块机制之前，Javascript 的代码都是全局脚本（Script）类型。引入模块（Module）机制后为了与脚本进行区分，`Program`节点使用 `sourceType`字段表示分为脚本（Script）和模块（Module）两种。对于任意 JS 文件，如果包含导入导出（`import/export`）语句，可以确认是模块类型；如果不包含导入导出语句可能是模块类型，也可能是脚本类型。使用 Babel 解析代码时可以指定文件的类型。

```ts
import * as parser from '@babel/types'

const code = `let a = 1;`
parser.parse(code, { sourceType: 'module' })
```

`sourceType`解析参数用来指定代码类型，有三个选项。

1. `module` - 指定代码是模块类型
1. `script` - 指定代码是脚本类型，如果包含导入导出语句会**抛出异常**，默认值。
1. `unambiguous` - 不指定类型，根据是否包含导入导出语句进行推测，不会抛出异常。

### 指令

`Program`节点中包含`directives`字段代表[指令序言](https://262.ecma-international.org/6.0/#sec-directive-prologues-and-the-use-strict-directive)（Directive Prologue），指全局或者函数内部最开始的若干个语句，这些语句的内容是字符串字面量的形式。这些语句合称为指令序言，其中每个语句称为指令（Directive），当前的规范中只规定了严格模式指令（Use Strict Directive）。

```ts
import * as parser from '@babel/parser'

const script = `'use strict'; let a = 1;`

parser.parse(script)
```

指令序言中可能包含多条重复的严格模式指令，不属于语法错误，但是可以由给出警告。

`Program`节点的`interpreter`字段是解释器指令（InterpreterDirective），用来代表 JS 文件作为 Shell 脚本命令运行时指定使用`node`作为解释器运行，这是 Unix 系统的[约定](<https://en.wikipedia.org/wiki/Shebang_(Unix)>)。

```ts
import * as parser from '@babel/parser'

const script = `#!/usr/bin/env node 'use strict'; let a = 1;`

parser.parse(script)
```

注意解释器指令必须位于文件**第一行**，否则解析会报错。解释器指令属于 Babel 的扩展特性，不属于 ECMAScript 规范。

## 语句（Statement）

语句是`Program`节点的子节点，常见的语句类型如下。

```txt
// 只包含一个分号的空语句 EmptyStatement
;

// DebuggerStatement
debugger

// WithStatement
with (a) { }

// 块语句 BlockStatement
{
  let a = 1;
}

// 流程控制语句
return 1;
label1: 1;
break;
continue;

// 分支语句
if (a) {}
switch (a) {}

// 异常语句
try { } catch() {}
throw e;

// 循环语句
while (true) {}
do {} while (true)
for (var i = 0; i < 10; i++) {}
for (const key in obj) {}
for (const value of array) {}
```

除此之外有两种特殊的语句，声明语句（Declaration）和表达式语句（ExpressionStatement）。表达式语句是由任意表达式组成的语句，可能的情况参考表达式类型。

## 声明

声明语句创建一个绑定标识符（Binding Identifier），包括变量（VariableDeclaration）、函数（FunctionDeclaration）、类（ClassDeclaration）、导入导出等情况。

```ts
var foo = 1;
function fun () {}
class Test () {}
import math from 'math'
export { math }
```

函数、类、导入也存在表达式的形式。

```ts
const fun = function () {}
const Test = new (class {})()

import('math').then()
```

## 表达式（Expression）

表达式类型包含了大部分抽象语法树节点类型。

```ts
// UnaryExpression
!a
// BinaryExpression
a + b
// LogicalExpression
a && b
// AssignmentExpression
a = b
// ConditionalExpression
a ? b : c
// MemberExpression
a.b
// CallExpression
a()
// SequenceExpression 逗号表达式
a, b
// 括号表达式
!(a + b)
```

另外一些特殊的表达式

```ts
super.a
this.a
import('a')
```

## 字面量

普通字面量

```ts
// NumericLiteral
1
// BooleanLiteral
true
// NullLiteral
null
// 由StringLiteral组成的BinaryExpression
'a' + 'b'
// RegExpLiteral
/[a-zA-Z0-9]+/g
// BigIntLiteral
1n;
```

其中 Symbol 没有字面量形式。另外 ECMAScript 规范规定`undefined`是标识符，默认值是`undefined`，而不是字面量，这点上和`null`不同。

## 模式 Pattern

解构语法对应的几种特殊形式
扩展语法不是表达式，不能独立存在，只能使用在固定的几个地方。

TODO: 添加指向解构语法的参考

```ts
// ObjectPattern 包括 AssignmentPattern和RestElement
// AssignmentPattern
const { a = 1 } = { a: 2 }
// RestElement
const { b, ...a } = { a: 2 }

// ArrayPattern
const [x, y] = [0, 1]
// RestElement
const [x, ...y] = [0, 1]

// RestElement a
function fun(...a) {}
const obj = { ...a }
const { b, ...a } = {}
```

## 注释

注释分类单行注释（CommentLine）和多行注释（CommentBlock）。

```ts
interface BaseComment {
  value: string
  start: number
  end: number
  loc: SourceLocation
  type: 'CommentBlock' | 'CommentLine'
}

export interface CommentBlock extends BaseComment {
  type: 'CommentBlock'
}

export interface CommentLine extends BaseComment {
  type: 'CommentLine'
}

export type Comment = CommentBlock | CommentLine
```

同一个注释节点可以由多个抽象语法树节点共享，一个节点的注释有三种位置。

```ts
// leading comment
function fun(/* inner comment */ a) {}
// trailing comment
```

对于函数`fun`来说有前置注释（leading comment)、内部注释（inner comment）和后置（trailing comment）注释。`fun`的内部注释对于参数`a`来说是前置注释。顶层的注释也会包含在`Program`节点的`comments`数组属性中。

## 节点别名 Aliases

上述节点都是具体的节点类型，若干不同节点还可以使用别名归类到同一个概念下。

### Binary

二元表达式（BinaryExpression）和逻辑表达式（LogicalExpression）都是两个操作数，可以使用 Binary 来引用。

### 循环相关

For 循环语句包括普通 for 语句、for-in 语句和 for-of 语句，可以统称为 For；While 语句和 Do-While 语句可以统称为 While；For 和 While 又可以统称为 Loop。

### 函数相关

所有可能代表函数的类型，统称为 Function。

```ts
export type Function =
  | FunctionDeclaration
  | FunctionExpression
  | ObjectMethod
  | ArrowFunctionExpression
  | ClassMethod
  | ClassPrivateMethod
```

### 左值类型

左值类型 LVal 指的是能够出现在赋值表达式左边的节点类型。

```ts
export type LVal =
  | Identifier
  | MemberExpression
  | RestElement
  | AssignmentPattern
  | ArrayPattern
  | ObjectPattern
  | TSParameterProperty
```

### 模式类似

可能作为 Pattern 的几种类型。

```ts
export type PatternLike =
  | Identifier
  | RestElement
  | AssignmentPattern
  | ArrayPattern
  | ObjectPattern
```

### 作用域相关

作用域相关的节点别名有 Scopable/BlockParent/Block 等，详细机制可以参考[插件作用域篇](./plugin-scope.md)。

# AST 相关的工具

@babel/types 包为操作 AST 节点提供了很多辅助函数，涵盖了绝大部分使用场景。对于常见的操作可以先查看下官方是否已经提供，下面列出一些常见的工具函数。

## 构造 AST

每个节点在@babel/type 中都定义有相关的构造函数，

```ts
import * as t from '@babel/types'

// 1 + 2
t.binaryExpression('+', t.numericLiteral(1), t.numericLiteral(2))
```

## 查询验证节点类型

每个节点类型都有`is`开头的辅助函数判断指定节点参数是否是某种类型的节点，可以接受第二个可选参数指定需要满足的属性。

```js
// 是否
t.isBinaryExpression(maybeBinaryExpressionNode, { operator: '*' })
```

`assert`开头的辅助函数保证节点必须是指定类型，否则会抛出异常。

```ts
// 保证节点类型
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: '*' })
```

## 多层节点

TODO: looksLike

## 从模板构造 AST

手工构造复杂的 AST 节点树比较麻烦， `@babel/template`提供了从模板字符串自动生成对应 AST 树的方法。

```js
import template from '@babel/template'
import generate from '@babel/generator'
import * as t from '@babel/types'

const buildRequire = template(`
  var %%importName%% = require(%%source%%);
`)

const ast = buildRequire({
  importName: t.identifier('myModule'),
  source: t.stringLiteral('my-module'),
})

console.log(generate(ast).code)
```

## 克隆节点

抽象语法树中每个节点都是唯一的，不能在多个位置重复使用一个节点，对于需要使用两个内容一模一样的节点，可以使用辅助函数进行克隆。

```ts
import * as t from '@babel/types'

const id = t.identifier('a')
const clonedId = t.clone(id)

id !== clonedId
```

## 成员表达式组合

成员表达式（MemberExpression）可以多个组合起来。

```ts
import * as t from '@babel/types'

// a.b
const m = t.memberExpression(t.identifier('a'), t.identifier('b'))
const c = t.identifier('c')

// a.b -> a.b.c
t.appendToMemberExpression(m, c)
// a.b -> c.a.b
t.prependToMemberExpression(m, c)
```

## 注释节点

辅助函数提供了对节点添加、继承、删除注释的操作。

```ts
import * as t from '@babel/types'

const node = t.identifier('a')

// 添加单条注释，可以指明是单行还是多行形式
t.addComment(node, 'leading', 'comment content', 'line')
// 添加多条注释
t.addComments(node, 'leading', comments)

// 子节点node继承父节点parent的所有注释
t.inheritComments(node, parent)

// 删除节点所有注释
t.removeComments(node)
```

## 值转换为 AST 节点

使用`valueToNode`将具体类型未知的运行时值转换为合适的 AST 节点。

```ts
import * as t from '@babel/types'

t.isNodesEquivalent(t.valueToNode(1), t.numericLiteral(1))
```

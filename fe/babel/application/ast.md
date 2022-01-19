### AST

1. 解释基本概念
1. js 的典型语言结构的 AST，以 ES6 为基础包含所有大的分类。
1. aliases 节点别名
1. 节点类型检测
1. Aliases Property
1. 介绍下 virtualTypes 常用的动态类型

参考资料

1. https://medium.com/basecs/leveling-up-ones-parsing-game-with-asts-d7a6fc2400ff
1. https://blog.bitsrc.io/what-is-an-abstract-syntax-tree-7502b71bde27
1. [AST In Modern Javascript](https://juejin.cn/post/6844903540024950791)

#### 节点类型

babel 使用的 AST 节点规范参考[文档](https://github.com/babel/babel/blob/master/packages/babel-parser/ast/spec.md) 和[ESTree 规范](https://github.com/estree/estree)，其中 ESTree 规范可以看到每个版本的 Javascript 新增的节点规范。

1. interpreter directive stage 1
1. t.File 的作用
1. leading comments/trailing comments/inner comments/CommentLine CommentBlock
1. `undefined`为什么是 Identifier 不是 Literal
1. IfStatement test consequent alternate 可以形成嵌套 If。

"-" | "+" | "!" | "~" | "typeof" | "void" | "delete" | "throw"

1. template literal/tagged template literal quasi ?

#### 节点信息

Babel 使用的 AST 节点通用的信息有这些。

```js
{
  // 节点类型
  "type": "File",
  // 字节流中的位置
  "start": 0,
  "end": 481,
  // 文件中的行列位置
  "loc": {
    "start": {
      "line": 1,
      "column": 0
    },
    "end": {
      "line": 20,
      "column": 0
    },
    "filename": undefined,
    "identifierName": undefined
  },
  "range": undefined,
  // 相关注释
  "leadingComments": undefined,
  "trailingComments": undefined,
  "innerComments": undefined,
  "extra": undefined,
}
```

每种 AST 节点有关联的功能点

#### AST 相关的工具

一个 AST 节点类型对应的工具函数。

```js
// 构造
t.binaryExpression()
// 是否
t.isBinaryExpression(maybeBinaryExpressionNode, { operator: '*' })
// 保证节点类型
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: '*' })
```

#### 从模板构造 AST

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

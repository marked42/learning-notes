# Babel

## 使用介绍

版本 6 7 的不同

包括哪些部分

1. @babel/core
1. @babel/parser
1. @babel/traverse
1. @babel/generator
1. @babel/template
1. @babel/types

```js
defineType('BinaryExpression', {
  builder: ['operator', 'left', 'right'],
  fields: {
    operator: {
      validate: assertValueType('string'),
    },
    left: {
      validate: assertNodeType('Expression'),
    },
    right: {
      validate: assertNodeType('Expression'),
    },
  },
  visitor: ['left', 'right'],
  aliases: ['Binary', 'Expression'],
})

t.isBinaryExpression(maybeBinaryExpressionNode, { operator: '*' })
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: '*' })
```

1. @babel/helpers
1. @babel/runtime
1. @babel/code-frame

## preset & plugin 机制

## Parse

AST

[ESTreeSpec](https://github.com/estree/estree)
[Babel 是如何读懂 JS 代码的](https://zhuanlan.zhihu.com/p/27289600)

## Traverse

Traversal 树的遍历
Visitor 模式 https://en.wikipedia.org/wiki/Visitor_pattern

```js
const MyVisitor = {
  'ExportNamedDeclaration|Flow'(path) {},
}

// Function is an alias for FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, ObjectMethod and ClassMethod.
const MyVisitor = {
  Function(path) {},
}
```

Path,

```js
{
  "parent": {...},
  "node": {...},
  "hub": {...},
  "contexts": [],
  "data": {},
  "shouldSkip": false,
  "shouldStop": false,
  "removed": false,
  "state": null,
  "opts": null,
  "skipKeys": null,
  "parentPath": null,
  "context": null,
  "container": null,
  "listKey": null,
  "inList": false,
  "parentKey": null,
  "key": null,
  "scope": null,
  "type": null,
  "typeAnnotation": null
}
```

Scope

```
{
  path: path,
  block: path.node,
  parentBlock: path.parent,
  parent: parentScope,
  bindings: [...]
}
```

Binding

```js
{
  identifier: node,
  scope: scope,
  path: path,
  kind: 'var',

  referenced: true,
  references: 3,
  referencePaths: [path, path, path],

  constant: false,
  constantViolations: [path]
}
```

## Transform

https://summerrouxin.github.io/archives/

babel-plugin-syntax-jsx

AST Manipulation

jscodeshift, codemods

插件分析 按需加载 babel-plugin/component/babel-plugin-import

[Babel Plugin Handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#toc-manipulation)

```js
export default function ({ types: t }) {
  return {
    visitor: {
      Identifier(path, state) {},
      ASTNodeTypeHere(path, state) {},
    },
  }
}
```

https://zhuanlan.zhihu.com/p/333951676

## Generator

1. [source-map](https://github.com/mozilla/source-map)
1. 生成[source-map](https://zhuanlan.zhihu.com/p/308516099)

[State of Babel](https://babeljs.io/blog/2016/12/07/the-state-of-babel)

[Videos](https://www.babeljs.cn/videos)

1. https://www.bilibili.com/video/BV1GK4y1W7fi?from=search&seid=12773308433329510711
1. https://www.bilibili.com/video/BV1N4411R7yP?from=search&seid=12773308433329510711
1. https://www.bilibili.com/video/BV1Rf4y1S7RN?from=search&seid=12773308433329510711
1. https://www.bilibili.com/video/BV1so4y1o7qr?from=search&seid=12773308433329510711

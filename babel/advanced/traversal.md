# 插件机制

1. visitor 哪些子节点需要遍历
1. https://en.wikipedia.org/wiki/Visitor_pattern
1. 深度优先遍历 https://en.wikipedia.org/wiki/Depth-first_search

#### 节点遍历

讲述了来龙去脉 A Little Java, A Few Patterns
packages/babel-traverse/src/path/context.js
采用的是多叉树先序深度优先遍历

1. parent findParent, find, getParentFunction, getParentStatement,
1. sibling [api](https://github.com/babel/babili/blob/master/packages/babel-plugin-transform-merge-sibling-variables/src/index.js)
1. path.skip()/path.stop()
1. posthtml asynchronous tree traversal

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

https://zhuanlan.zhihu.com/p/333951676

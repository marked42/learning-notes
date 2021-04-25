# Babel

## 基本用法

Babel 在前端生态中用来对 JS 进行语法转换、代码迁移、增加垫片（polyfill）等操作。

安装方法如下：

```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

其中`@babel/cli`提供了最常用的使用方法，在命令行中使用`babel`。

```bash
./node_modules/.bin/babel src --out-dir lib
```

也可以直接使用代码的方式使用。

```js
const babel = require('@babel/core')

babel.transformSync('code', optionsObject)
```

## 配置方式

babel 的[配置文件](https://babeljs.io/docs/en/config-files)分为整个项目级别和文件级别。通过配置文件可以定制`babel`的行为，所有参数都可以通过配置文件支持。

使用 JS 配置文件`babel.config.js`可以进行动态配置，导出一个配置对象或者返回配置对象的函数。

```js
const presets = [
  [
    '@babel/env',
    {
      targets: {
        edge: '17',
        firefox: '60',
        chrome: '67',
        safari: '11.1',
      },
      useBuiltIns: 'usage',
      corejs: '3.6.4',
    },
  ],
]

module.exports = { presets }
```

参考[API](https://babeljs.io/docs/en/config-files#config-function-api)

```js
module.exports = function (api) {
  return {}
}
```

## 垫片（Polyfill）

7.4.0 之前，babel 通过`@babel/polyfill`库提供所有的功能[垫片](https://babeljs.io/docs/en/usage#polyfill)实现，之后废弃这种方式转而推荐。

```js
import 'core-js/stable'
import 'regenerator-runtime/runtime'
```

## 包分类

`babel`的[仓库](https://github.com/babel/babel/tree/main/packages)使用 Monorepo 的方式组织，所有包统一发布到`@babel`前缀下。

| 包                | 功能                                                     |
| ----------------- | -------------------------------------------------------- |
| @babel/core       | 核心功能                                                 |
| @babel/cli        | 命令行工具                                               |
| @babel/preset-\*  | 预设                                                     |
| @babel/plugin-\*  | 插件                                                     |
| @babel/parser     | 语法分析                                                 |
| @babel/traverse   | AST 遍历                                                 |
| @babel/generator  | AST 生成 JS 代码                                         |
| @babel/types      | AST 节点功能                                             |
| @babel/runtime    | 运行时                                                   |
| @babel/polyfill   | 功能垫片                                                 |
| @babel/standalone | 运行在浏览器上的版本，不能使用文件操作等 Node 提供的功能 |

### AST

#### 节点信息

ast 的查询、validate、沿着树上下遍历

ast 和 @babel/types t.Program, t.File

手动构造 AST 节点树

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

t.binaryExpression()
t.isBinaryExpression(maybeBinaryExpressionNode, { operator: '*' })
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: '*' })
```

#### 从模板构造 AST

`@babel/template`

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

#### 节点遍历

访问者模式 https://zhuanlan.zhihu.com/p/360664179

1. parent findParent, find, getParentFunction, getParentStatement,
1. sibling [api](https://github.com/babel/babili/blob/master/packages/babel-plugin-transform-merge-sibling-variables/src/index.js)
1. path.skip()/path.stop()

### 节点变换

### scope

1. @babel/helpers
1. @babel/runtime
1. @babel/code-frame

### 增加`import`语句节点

@babel/helper-module-imports

## 在浏览器环境使用

`@babel/standalone`库

```js

```

## 预设和插件（Preset & Plugin）

babel 插件分为转换插件（转换阶段）和语法插件（解析阶段），

TODO: babel 插件机制的设计

1. 统一的插件接口设计，
1. 插件尽可能设计成纯函数式的，无副作用
1. 是否需要全局环境 context 数据
1. 插件的顺序问题？
1. 插件的状态问题，一个插件多次运行，每次能够记录数据，根据数据每次运行的结果不同？
1. 各种设计考虑问题有哪些具体的例子？
1. 插件支持同步和异步的模式

插件包括语法插件和转换插件，如果使用了转换插件，自动激活相应的语法插件，不需要再手动引入。

### babel 现有的插件进行大致的分析和分类。

官方的[插件列表](https://babeljs.io/docs/en/plugins-list)

### 顺序

1. Plugins run before Presets.
1. Plugin ordering is first to last.
1. Preset ordering is reversed (last to first).

### 插件开发

babel-plugin-macro
https://github.com/ElementUI/babel-plugin-component
member-expression-literals

```js
export default function () {
  return {
    visitor: {
      Identifier(path) {
        const name = path.node.name
        // reverse the name: JavaScript -> tpircSavaJ
        path.node.name = name.split('').reverse().join('')
      },
    },
  }
}

// pre post plugin
export default function ({ types: t }) {
  return {
    pre(state) {
      this.cache = new Map()
    },
    visitor: {
      StringLiteral(path) {
        this.cache.set(path.node.value, 1)
      },
      Class(path) {
        throw path.buildCodeFrameError('Error message here')
      },
    },
    post(state) {
      console.log(this.cache)
    },
    inherits: require('babel-plugin-syntax-jsx'),
  }
}
```

1. Merge visitors whenever possible
1. Do not traverse when manual lookup will do
1.

使用测试用例保证插件质量，babel-plugin-tester https://github.com/babel-utils/babel-plugin-tester/blob/master/README.md

```js
import pluginTester from 'babel-plugin-tester'
import identifierReversePlugin from '../identifier-reverse-plugin'

pluginTester({
  plugin: identifierReversePlugin,
  fixtures: path.join(__dirname, '__fixtures__'),
  tests: {
    'does not change code with no identifiers': '"hello";',
    'changes this code': {
      code: 'var hello = "hi";',
      output: 'var olleh = "hi";',
    },
    'using fixtures files': {
      fixture: 'changed.js',
      outputFixture: 'changed-output.js',
    },
    'using jest snapshots': {
      code: `
        function sayHi(person) {
          return 'Hello ' + person + '!'
        }
      `,
      snapshot: true,
    },
  },
})
```

preset 倒序

```js
module.exports = () => ({
  presets: [require('@babel/preset-env')],
  plugins: [
    [require('@babel/plugin-proposal-class-properties'), { loose: true }],
    require('@babel/plugin-proposal-object-rest-spread'),
  ],
})
```

## Parse

AST

[ESTreeSpec](https://github.com/estree/estree)
[Babel 是如何读懂 JS 代码的](https://zhuanlan.zhihu.com/p/27289600)

## Traverse

Traversal 树的遍历
Visitor 模式 https://en.wikipedia.org/wiki/Visitor_pattern
讲述了来龙去脉 A Little Java, A Few Patterns

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

https://github.com/jamiebuilds/babel-handbook

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

## babel-loader

[Videos](https://www.babeljs.cn/videos)

1. [vue 源码]https://www.bilibili.com/video/BV1GK4y1W7fi?from=search&seid=12773308433329510711
1. [活动作品【全网首发:已完结】Vue 的模板编译『模板-AST 树-render-虚拟 DOM-真实 DOM』【面试必备】](https://www.bilibili.com/video/BV1Rf4y1S7RN?from=search&seid=12773308433329510711)

1. [吃一堑长一智系列: 99% 开发者没弄明白的 babel 知识](https://zhuanlan.zhihu.com/p/361874935)

1. [Code Transformation and Linting with ASTs with Kent C Dodds](https://frontendmasters.com/courses/linting-asts/)

1. [How to be a Mentor](https://kentcdodds.com/chats-with-kent-podcast/seasons/01/episodes/creating-successful-mentor-relationships-with-emma-bostian)

1. [Babel 是如何读懂 JS 代码的](https://zhuanlan.zhihu.com/p/27289600)
1. [babel plugin](https://space.bilibili.com/228173207?spm_id_from=333.788.b_765f7570696e666f.2)

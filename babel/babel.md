# Babel

## 基本用法

Babel 在前端生态中用来对 JS 进行语法转换、代码迁移、增加垫片（polyfill）等操作。 [官方使用手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/user-handbook.md)

## 配置

配置文件

1. 项目级别，对整个项目中的所有文件都生效
   1. `babel.config.json`或者其他后缀（`.js`，`.cjs`，`.mjs`）
1. 文件级别，对文件所在目录及所有子目录中文件生效
   1. `.babelrc.json`或者其他后缀(.babelrc, .js, .cjs, .mjs)
   1. `package.json`中的`babel`字段

配置文件与配置合并策略 include/exclude/test/only/overrides/env, 插件 plugin/preset name normalization

版本 6 7 的不同

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

[实践中问题总结](https://zhuanlan.zhihu.com/p/361874935)

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
| @babel/register   | 动态编译                                                 |

TODO: 分析 babel/register 实现

### AST

参考资料

1. https://medium.com/basecs/leveling-up-ones-parsing-game-with-asts-d7a6fc2400ff
1. https://blog.bitsrc.io/what-is-an-abstract-syntax-tree-7502b71bde27

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

1. builder 如何构造节点
1. visitor 哪些子节点需要遍历
1. https://en.wikipedia.org/wiki/Visitor_pattern
1. 深度优先遍历 https://en.wikipedia.org/wiki/Depth-first_search
1. aliases 节点别名
1. 节点类型检测

Babel 使用`defineType`来定义一个节点类型，自动生成相关构造函数、别名、类型检测函数 。

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
```

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

#### 节点变换

ast 的查询、沿着树上下遍历

replaceWithSourceString

https://summerrouxin.github.io/archives/

babel-plugin-syntax-jsx

插件分析 按需加载 babel-plugin/component/babel-plugin-import

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

#### scope

1. @babel/helpers
1. @babel/runtime
1. @babel/code-frame

### 增加`import`语句节点

@babel/helper-module-imports

## 在浏览器环境使用

TODO: 分析 babel 的 standalone 版本逻辑

1. 查询得到 `<script type="text/jsx">`或者`text/babel`类型的标签，
1. 同步或者使用 XHR 异步获取标签内容
1. 读取标签上附加的 data-plugins,data-presets 属性，确定 babel 使用的配置
1. 对代码内容按照设定配置进行转码
1. 新建 script 标签，并添加到 DOM 树种执行转码得到的代码。

`@babel/standalone`库

```js

```

## 预设和插件（Preset & Plugin）

babel 插件分为转换插件（转换阶段）和语法插件（解析阶段），

TODO: babel 插件机制的设计

1. 统一的插件接口设计，
1. 插件尽可能设计成纯函数式的，无副作用
1. 是否需要全局环境 context 数据
1. 插件的顺序问题？ https://jamie.build/babel-plugin-ordering.html
1. 插件的状态问题，一个插件多次运行，每次能够记录数据，根据数据每次运行的结果不同？
1. 各种设计考虑问题有哪些具体的例子？
1. 插件支持同步和异步的模式

插件包括语法插件和转换插件，如果使用了转换插件，自动激活相应的语法插件，不需要再手动引入。

`transformFile`函数中插件的执行过程

1. 遍历插件集合，执行插件的 pre 方法。
1. 遍历插件集合，合并插件的 visitor 方法，输出是一个包含了所有插件逻辑的 visitor 方法。
1. 执行第二步合成的 visitor 方法。
1. 遍历插件集合，执行插件的 post 方法。

### babel 现有的插件进行大致的分析和分类。

官方的[插件列表](https://babeljs.io/docs/en/plugins-list)
[官方插件实现分析](https://space.bilibili.com/228173207?spm_id_from=333.788.b_765f7570696e666f.2)
选择若干典型案例
https://www.sitepoint.com/understanding-asts-building-babel-plugin/?spm=taofed.bloginfo.blog.10.22bb5ac8m6A7NK

@babel/plugin-proposal-nullish-coalescing-operator
@babel/plugin-proposal-optional-chaining

社区插件

1. babel-plugin-lodash
1. babel-plugin-preval
1. babel-plugin-macro

### 顺序

1. Plugins run before Presets.
1. Plugin ordering is first to last.
1. Preset ordering is reversed (last to first).

### 插件开发

参考[官方插件开发手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)

1. [Step-by-step guide for writing a custom babel transformation](https://lihautan.com/step-by-step-guide-for-writing-a-babel-transformation/)

使用 `this.addHelper`添加辅助函数

```js
path.replaceWith(
  t.variableDeclaration('const', [
    t.variableDeclarator(
      t.identifier(path.get('id.name').node),
      t.callExpression(this.addHelper('currying'), [t.toExpression(path.node)])
    ),
  ])
)
```

写一个插件的步骤

1. 确认原始代码的 AST
1. 确认要转换得到的代码的 AST
1. 进行 AST 转换
1. skip 函数跳过当前节点的遍历，防止递归爆栈
1. 插件的 path 参数，为什么不是 node？插件编写需要考虑到节点所在的上级节点
1. scope

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

### 插件测试

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

### 社区插件

#### babel-plugin-preval

四种形式

1. Program 使用@preval 首行注释标记的文件整个替换为导出值
1. ImportDeclaration 使用 preval 注释的导入语句替换为赋值语句，值为模块运行的结果
1. TaggedTemplateLiteral 自身替换为模板字符串作为模块执行的结果
1. CallExpression preval.require 函数调用，替换为模块调用结果，可以传参

注意的要点

1. preval 的模块需要在编译时运行，借助 require-from-string 包实现，这里值的探究，如何将动态运行一个模块？
1. preval 的模块可以导出一个函数，这时函数的运行结果才是最终得到的值
1. preval 使用的函数运行时接受参数，这些参数需要在编译时能够求值，否则会报错

```js
import a from /* preval(1) */ './test'

preval`module.exports = 1`

preval.require('./test', 1, 2)

// @preval
module.exports = 1 + 1
```

1. babel-plugin-lodash
1. babel-plugin-preval
1. babel-plugin-macro
1. https://lihautan.com/babel-macros/
1. [awesome babel macro](https://github.com/jgierer12/awesome-babel-macros)
1. https://github.com/ElementUI/babel-plugin-component
   member-expression-literals

## 解析

1. [The Super Tiny Compiler](https://github.com/jamiebuilds/the-super-tiny-compiler)
1. [Creating custom JavaScript syntax with Babel
   ](https://lihautan.com/creating-custom-javascript-syntax-with-babel/)

## 代码生成

1. [source-map](https://github.com/mozilla/source-map)
1. 生成[source-map](https://zhuanlan.zhihu.com/p/308516099)

[State of Babel](https://babeljs.io/blog/2016/12/07/the-state-of-babel)

## 代码迁移

1. [jscodeshift](https://www.toptal.com/javascript/write-code-to-rewrite-your-code)
1. codemods
1. https://lihautan.com/codemod-with-babel/

## 自定义语法

custom parser syntax

1. [Manipulating AST](https://lihautan.com/manipulating-ast-with-javascript/)
1. [curry function](https://lihautan.com/creating-custom-javascript-syntax-with-babel/)

## babel-loader

## sourcemap

## 资料

1. [Babel 官网视频](https://www.babeljs.cn/videos)
1. [Code Transformation and Linting with ASTs with Kent C Dodds](https://frontendmasters.com/courses/linting-asts/)
1. https://github.com/babel/babel/pull/3561
1. [AST In Modern Javascript](https://juejin.cn/post/6844903540024950791)

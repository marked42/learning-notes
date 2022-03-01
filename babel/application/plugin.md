# 插件开发

1. 单个 babel plugin 怎么开发
1. path
1. scope
1. examples
1. path 相关 介绍下 virtualTypes 常用的动态类型

## 能用 babel 做些什么

1. [Code Transformation and Linting with ASTs with Kent C Dodds](https://www.bilibili.com/video/BV13S4y1G741)
1. [Writing custom Babel and ESLint plugins with ASTs](https://www.bilibili.com/video/BV1zq4y1q7U6/)

例子

1. ESLint 插件，if 语句必须使用 block statement

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

#### 遍历操作类型

1. hasType 给一个全局 boolean 标志位 false，遍历的过程遇到条件成立就设置标志位位 true
1. 深度优先的节点遍历 enter/exit/type enter exit

1. 节点操作类型 replace/replaceWithMultiple/insertBefore/insertAfter/查询操作...
1. 嵌套的 traverse 可以显式传入 parentPath

1. visitor 类型介绍 核心类型是 { keyType: { enter: Array<Function>, exit: Array<Function> } }，每个节点类型支持 enter/exit 两种，每种有多个 callback 数组类型。
1. Identifier -> Identifier{ enter() {} }
1. 'Identifier|NumericLiteral' -> Identifier {}, Numeric Literal

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

### babel helpers

增加`import`语句节点

1. @babel/helper-module-imports
1. @babel/helpers

### 错误处理

1. @babel/runtime
1. @babel/code-frame

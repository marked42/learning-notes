# Javascript 模块机制

## 没有模块时如何写代码，存在哪些问题

举一个例子，这个例子涉及几个模块，表现出下面描述的问题，

1. 全局变量，所有变量都在全局中， variables declared within a module is now "public" and available to other modules, which wasn't intended
1. 多个模块存在命名冲突，需要通过引入标识符重命名功能解决 The "scope pollution" problem
1. 被依赖的脚本必须在之前使用 script 标签引入，需要手动维护这个顺序
1. 异步模块

模块声明导入导出，遵循面向接口编程，而不是面向实现

使用 IIFE 的方式将变量隔离，这种写法叫做 Module Pattern（模块模式）

[Javascript Module Pattern In Depth](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html)

[Object Literal Pattern](http://blog.rebeccamurphey.com/2009/10/15/using-objects-to-organize-your-code)

<a href="https://docs.microsoft.com/en-us/previous-versions/msdn10/hh227261(v=msdn.10)"> Script Loader </a>

各种模块机制

1. CommonJS
1. AMD
1. UMD
1. ES Module

## 模块化机制的设计

调研各种语言的模块机制

1. C++
1. Rust
1. Java
1. C#
1. Javascript
1. Python
1. C

Essentials of Programming Languages Chapter 8 Modules

## 模块化解决的问题

1. 封装内部细节
1. 高内聚、低耦合的原则
1. 模块间的交互问题 导入导出机制，显式导入导出方式优于隐式 explicit is better than implicit, 对比 C++的 using std; Java 的 static import 等，批量导出
1. 模块加载机制 同步、异步
1. 循环依赖处理
1. ES Module 静态机制 对比动态模块
1. ES Module / CommonJS / ADM / UMD / System 的交互
1. [ES6 Module Spec](https://tc39.es/ecma262/#sec-modules) in browser ES Module 把模块的解析划分为三个阶段，这是与 Node 环境的模块加载机制重大区别，浏览器环境要求模块**下载**不能阻塞主线程
   1. https://html.spec.whatwg.org/multipage/webappapis.html#resolve-a-module-specifier
   1. load module [HTML Spec](https://html.spec.whatwg.org/#fetch-a-module-script-tree) [module map](https://html.spec.whatwg.org/multipage/webappapis.html#integration-with-the-javascript-module-system)
   1. Module Record -> Module Instance 浏览器怎么处理 ES Module 的？
   1. Module steps
   1. Construction -> 1. module resolution process， 总共三步 1 module name -> 2 url （远程或者本地） -> 3 read module source -> 4 parse as module record
      module loader 负责前两步
   1. Instantiation ->
   1. Evaluation

```js
// 解释为什么有这些不同
// 正确
require(`${path}/counter.js`).count

// 错误
import { count } from `${path}/counter.js`
```

[dynamic import 动态导入模块](https://github.com/tc39/proposal-dynamic-import)
[Loader Specification](https://whatwg.github.io/loader/)

同一个模块全局只有一个示例

模块化

1.  https://lihautan.com/javascript-modules/
1.  https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/

1.  ES Module Live Binding CommonJS 使用拷贝

module bundler

1. [What is module bundler and how does it work?](https://lihautan.com/what-is-module-bundler-and-how-does-it-work/)
1. https://lihautan.com/i-wrote-my-module-bundler/
1. https://lihautan.com/i-wrote-my-module-bundler-ii-for-the-web/
1. https://lihautan.com/building-a-simplified-webpack-clone/
1. enhanced-resolve

## 不同模块交互机制

CommonJS / ESModule / tsconfig esModuleInterop interoperability
CommonJS 模块历史

Kevin Dangoor 最早在[What Server Side Javascript Needs](https://www.blueskyonmars.com/2009/01/29/what-server-side-javascript-needs/)提出了 CommonJS 的设想，

1. [CommonJS effort sets JavaScript on path for world domination](https://arstechnica.com/information-technology/2009/12/commonjs-effort-sets-javascript-on-path-for-world-domination/)
1. [CommonJS Wiki](http://wiki.commonjs.org/wiki/Modules)
1. [History of Web Development: JavaScript Modules](https://lihautan.com/javascript-modules/)

TODO:

1. 模块化 js ninja ch11
1. 模块化机制，实现 require(commonjs), define(amd), umd 模块的互操作性 https://www.zhihu.com/question/288322186/answer/460742151
1. https://zhuanlan.zhihu.com/p/40733281

1. https://zhuanlan.zhihu.com/p/97335917

## ES Module

模块作用域（Module Scope）

## Javascript 执行环境（Execution Context）

EnvironmentRecord

1. DeclarativeEnvironmentRecord VariableDeclaration/FunctionDeclaration/CatchClause
   1. FunctionEnvironmentRecord
   1. ModuleEnvironmentRecord [[OuterEnv]] -> Global
1. ObjectEnvironmentRecord WithStatement
1. GlobalEnvironmentRecord 有预先初始化的一组标识符绑定到全局对象上

模块标识符是活绑定（Live Binding）的处理

Import Binding 指向另一个模块的导出值，是实时求值的

It creates a new initialized immutable indirect binding for the name N.

https://tc39.es/ecma262/#sec-module-environment-records-getbindingvalue-n-s

标识符绑定（Binding）的状态

1. Nicholas C. Zakas [Human Who Codes](https://humanwhocodes.com/)
1. Robert Nyman [Explaining Javascript Scope and Closures](https://robertnyman.com/2008/10/09/explaining-javascript-scope-and-closures/)

1. [What really is a declarative environment record and how does it differ from an activation object?](https://stackoverflow.com/questions/20139050/what-really-is-a-declarative-environment-record-and-how-does-it-differ-from-an-a)
1. [Understanding Execution Context and Execution Stack in Javascript](https://blog.bitsrc.io/understanding-execution-context-and-execution-stack-in-javascript-1c9ea8642dd0)

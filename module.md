# Javascript 模块机制

## 没有模块时如何写代码，存在哪些问题

1. 全局变量
1. 自己维护依赖

## 模块化机制的设计

调研各种语言的模块机制

1. C++
1. Rust
1. Java
1. C#
1. Javascript
1. Python
1. C

## 模块化解决的问题

1. 封装内部细节
1. 高内聚、低耦合的原则
1. 模块间的交互问题 导入导出机制，显式导入导出方式优于隐式 explicit is better than implicit, 对比 C++的 using std; Java 的 static import 等，批量导出
1. 模块加载机制 同步、异步
1. 循环依赖处理
1. ES Module 静态机制 对比动态模块
1. ES Module / CommonJS / ADM / UMD / System 的交互
1. [ES6 Module Spec](https://tc39.es/ecma262/#sec-modules) in browser ES Module 把模块的解析划分为三个阶段，这是与 Node 环境的模块加载机制重大区别，浏览器环境要求模块下载不能阻塞主线程
   1. load module [HTML Spec](https://html.spec.whatwg.org/#fetch-a-module-script-tree)
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

dynamic import 动态导入模块

同一个模块全局只有一个示例

模块化

1.  https://lihautan.com/javascript-modules/
1.  https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/

module bundler

1. [What is module bundler and how does it work?](https://lihautan.com/what-is-module-bundler-and-how-does-it-work/)
1. https://lihautan.com/i-wrote-my-module-bundler/
1. https://lihautan.com/i-wrote-my-module-bundler-ii-for-the-web/
1. https://lihautan.com/building-a-simplified-webpack-clone/
1. enhanced-resolve

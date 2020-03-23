# Learning Notes

Notes on Web Knowledge

1. https://github.com/Advanced-Frontend/Daily-Interview-Question
1. https://github.com/qiu-deqing/FE-interview
1. https://juejin.im/post/5aae076d6fb9a028cc6100a9
1. https://github.com/haizlin/fe-interview?utm_source=gold_browser_extension
1. https://github.com/yangshun/front-end-interview-handbook/blob/master/Translations/Chinese/README.md
1. https://github.com/h5bp/Front-end-Developer-Interview-Questions
1. https://github.com/include-all/front-end-learning/issues/5

Knowledge Level

1. 了解概念
2. 懂得使用
3. 实例
4. 输出总结
5. 亲自实现

## CSS


## 组件

1. css-in-js
1. components

## HTTP

1. 缓存
    1. https://www.cnblogs.com/lyzg/p/5125934.html
1. https status code
    1. 200 201 Created 206, 300 304 Not Mo, 400, 500
1. [HTTP2.0](https://www.cnblogs.com/yingsmirk/p/5248506.html)
2. HTTPS

## HTML

1. DOM manipulation
1. innerHtml,outerHtml,textContent,innerText,outerText, textNode.data

## 工程化

1. webpack
    1. webpack 打包形成的模块结果分析
    1. style-loader,css-loader,less-loader,url-loader
    1. 样式文件、图片文字文件处理
    1. Tree Shaking
    1. https://medium.com/webpack/webpack-and-rollup-the-same-but-different-a41ad427058c
    1. https://juejin.im/post/59cb6307f265da064e1f65b9#heading-5
    1. 异步组件
    1. code splitting
    1. tree shaking
    1. tapable https://segmentfault.com/a/1190000008060440
    1. webpack 使用tapable的定制流程 webpack/compiler/compilation
2. babel
  1. https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/user-handbook.md
3. [开发部署系统](https://www.zhihu.com/question/20790576)
4. [搭建一个自动化集成测试CI/CD的工作流程](https://juejin.im/post/5ad1980e6fb9a028c42ea1be)

## 安全

1. XSS
    1. https://juejin.im/post/59dc2b7a6fb9a0451869ae3a
1. CRSF
1. [SameSite cookies explained](https://web.dev/samesite-cookies-explained/)
1. https://juejin.im/post/593df628da2f60006728cff2
1. [劫持与反劫持](https://juejin.im/post/593df628da2f60006728cff2)

## 性能优化

1. [Preload & Prefetch](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf)

## node

1. [ElemeFE/node-interview](https://github.com/ElemeFE/node-interview/tree/master/sections/zh-cn)

## UI UX

1. figma

## JS & TS

1. function
    2. function statement 独立的，必须有名字
    1. function expression 非独立的作为另外一个statement的一部分存在，可以匿名
    ```js
    // functions expressions
    // 不同形式的IIFE
    (function () {})()
    (function () {}(3))
    +function () {}()
    !function () {}()
    ~function () {}()
    return function(){}
    call(function (){})
    ```
    1. props and methods on function
    1. arguments[0] is an alias for first parameter in function, change arguments affects parameter, strict mode disables aliasing and make arguments and parameters independent
    1. js和bst一起研究
    1. Javascript Execution Context Javascript代码运行时总是位于一个执行环境（execution context）中，有三种方式创建新的执行环境。
        1. 全局的`Javascript`代码 global context
        2. 函数 local context
        3. `eval()`函数
4. 异步 async/await/Promise  05_You_Don't _Know_JS_Async_&_Performance
    1. java script with promises
    1. https://css-tricks.com/understanding-async-await/
    2. Promise https://juejin.im/post/5b16800fe51d4506ae719bae
    3. https://juejin.im/post/5b2f02cd5188252b937548ab
1. https://juejin.im/post/5d6aa4f96fb9a06b112ad5b1
1. 模块化 js ninja ch11
1. object相关 
    1. 01_You_Don't _Know_JS_Up_&_Going
    1. 03_You_Don't _Know_JS_this_&_Object_Prototypes
    1. 基础 04_You_Don't _Know_JS_Types_&_Grammar
    1. javascript ninja ch7 ch8
    1. collections, Array, Map, set, WeakSet js ninja ch9 
    1. RegExp js ninja ch10
1. 跨浏览器 js ninja ch14
6. [js常见模式](https://www.cnblogs.com/tugenhua0707/p/5198407.html)
    1. pub/sub
    2. event emitter
    3. observer 观察者
    4. https://juejin.im/post/59eff1fb6fb9a044ff30a942
3. es6 新特性
    1. class 面向对象
    1. 06_You_Don't _Know_JS_ES6_&_Beyond

7. [常见算法问题](https://juejin.im/post/5958bac35188250d892f5c91#heading-27)

## 经典题目

1. [从输入URL到页面加载的过程？如何由一道题完善自己的前端知识体系！](https://zhuanlan.zhihu.com/p/34453198?group_id=957277540147056640)

## 浏览器

1. [从浏览器多进程到JS单线程，JS运行机制最全面的一次梳理](https://juejin.im/post/5a6547d0f265da3e283a1df7)
1. 浏览器渲染机制
1. https://time.geekbang.org/column/intro/216

## Books

- [ ] CSS揭秘
- [ ] Secrets of the JavaScript Ninja, 2nd Edition
- [ ] You Don't Know Javascript
- [ ] Functional Programming in JavaScript by Luis Atencio (Manning, 2016),
- [ ] DOM Enlightenment
- [ ] Refactoring 2nd Edition
- [ ] 高性能网站建设指南
- [ ] [Algorithms In JS](https://github.com/trekhleb/javascript-algorithms?utm_source=gold_browser_extension)
